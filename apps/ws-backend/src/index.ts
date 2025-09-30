import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });
const JWT_TOKEN = process.env.JWT_SECRET_TOKEN || "helloDrawisly";

enum MessageType {
  JOIN_ROOM = "join_room",
  LEAVE_ROOM = "leave_room",
  CHAT = "chat",
  DRAW = "draw",
  MOVE = "move",
  RESIZE = "resize",
  ERASE = "erase",
  ERROR = "error",
}

interface User {
  userId: string;
  ws: WebSocket;
  rooms: Set<string>;
}

interface Room {
  roomId: string
  participants: Set<string>
}

const clients = new Map<string, User>(); // userId -> User
const rooms = new Map<string, Room>();   // roomId -> Room

wss.on("connection", async (socket: WebSocket, req: Request) => {
  try {
    if (!req.url) {
      socket.close(4000, "Missing URL");
      return;
    }

    const fullUrl = new URL(req.url, "ws://localhost:8080");
    const token = fullUrl.searchParams.get("token");

    if (!token) {
      socket.close(4001, "Missing token");
      return;
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_TOKEN) as JwtPayload;
    } catch (err) {
      console.error("❌ Invalid token:", err);
      socket.close(4002, "Invalid or expired token");
      return;
    }

    if (!decoded.id && !decoded.userId) {
      socket.close(4003, "Missing userId in token");
      return;
    }

    const userId = decoded.userId || decoded.id;
    (socket as any).userId = userId;
    console.log(`✅ User ${userId} connected`);

    const user: User = {
      userId,
      ws: socket,
      rooms: new Set()
    }

    clients.set(userId, user);

    socket.on("message", (data) => {
      try {
        const msg = data.toString()
        const parsedMessage = JSON.parse(msg);

        switch (parsedMessage.type) {
          case MessageType.JOIN_ROOM:
            if (!parsedMessage.roomId) return;
            handleJoin(parsedMessage.roomId, user)
            break;
          case MessageType.LEAVE_ROOM:
            if (!parsedMessage.roomId) return;
            leaveRoom(parsedMessage.roomId, user)
            break;
          case MessageType.CHAT:
            if (!parsedMessage.roomId) return;
            chatRoom(user, parsedMessage.roomId, parsedMessage.content)
            break;
          default:
            user.ws.send(JSON.stringify({ type: MessageType.ERROR, content: "Unknown message type" }));

        }
      } catch (error) {
        console.error("Invalid message format", error);
        socket.send(JSON.stringify({ type: MessageType.ERROR, content: "Invalid message format" }));
      }
    })

    socket.on("close", () => {
      for (const roomId of user.rooms) {
        const room = rooms.get(roomId)
        room?.participants.delete(userId)
      }
      clients.delete(userId)
      console.log(`🔌 User ${userId} disconnected`);
    })

    socket.on("error", (err) => {
      console.error(`⚠️ Socket error for ${userId}:`, err);
    });



  } catch (err) {
    console.error("Unexpected error:", err);
    socket.close(1011, "Internal server error");
  }
});

async function handleJoin(roomId: string, user: User) {
  const roomRecord = await prisma.room.findUnique({
    where:
    {
      joincode: roomId
    },
    select: {
      id: true,
      participants: {
        select: {
          id: true
        }
      }
    },
  });

  if (!roomRecord) {
    console.warn(`❌ Room ${roomId} not found`);
    return;
  }

  user.rooms.add(roomId);

  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomId,
      participants: new Set(),
    });
  }

  const room = rooms.get(roomId)!;

  await prisma.room.update({
    where: {
      joincode: roomId
    },
    data: {
      participants: {
        connect: {
          id: user.userId
        }
      },
    },
  });

  const updatedRoom = await prisma.room.findUnique({
    where: {
      joincode: roomId
    },
    select: {
      participants: {
        select: {
          id: true
        }
      }
    },
  });

  const isInRoom = updatedRoom?.participants.some(p => p.id === user.userId);

  if (!isInRoom) {
    console.error(`❌ Failed to add user ${user.userId} to room ${roomId} in DB`);
    return;
  }

  room.participants.add(user.userId);

  console.log(`✅ User ${user.userId} joined room ${roomId}`);

  brodCast(roomId, {
    type: "info",
    content: `User ${user.userId} joined the room`,
  });
}

async function leaveRoom(roomId: string, user: User) {
  const checkRoomExist = await prisma.room.findUnique({
    where: {
      joincode: roomId
    }
  })
  if (!checkRoomExist) {
    return;
  }
  user.rooms.delete(roomId)
  const foundedRoom = rooms.get(roomId)!
  console.log("founded room : ", foundedRoom);


  foundedRoom.participants.delete(user.userId)
  console.log(`User ${user.userId} left room ${roomId}`);
  brodCast(roomId, {
    content: `User ${user.userId} left the room`
  })
}

async function chatRoom(user: User, roomId: string, content: string) {
  console.log(`💬 [${roomId}] ${user.userId}: ${content}`);

  if (!content.trim()) return;

  const room = await prisma.room.findUnique({
    where: { joincode: roomId },
    select: { id: true },
  });
  if (!room) {
    console.warn(`❌ Room ${roomId} not found`);
    return;
  }

  await prisma.chat.create({
    data: {
      content,
      user: {
        connect: {
          id: user.userId
        }
      },
      room: {
        connect: {
          id: room.id
        }
      },
    },
  });

  brodCast(roomId, {
    type: "chat",
    userId: user.userId,
    content,
  });
}

function brodCast(roomId: string, data: any) {
  const room = rooms.get(roomId)

  if (!room) return;


  for (const usId of room.participants) {
    const client = clients.get(usId)

    if (client?.ws.readyState == WebSocket.OPEN) {
      // there are different type of state are there like 0, 1,2 ,3 
      // if the client ws state is 1 and websocket state also 1 (if both are open )
      // then send the data 
      client.ws.send(JSON.stringify(data))
    }
  }
}

// What is race condition