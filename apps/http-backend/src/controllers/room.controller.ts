import { Request, Response } from "express"
import { reandomeCodeGenerator } from "../utils/randomRoomCodeGenerate"
import { prisma } from "@repo/db/client";
import { JoinRoomSchema } from "@repo/common/type";

export async function createRoom(req: Request, res: Response) {
  try {

    const title = req.body.title
    const userId = req.userId;
    const roomCode: string = reandomeCodeGenerator(7);

    if (!userId) {
      res.status(401).json({
        message: "User Id is not Found ."
      })
      return;
    }

    if (!roomCode) {

    }
    const room = await prisma.room.create({
      data: {
        title: title,
        joincode: roomCode,
        adminId: userId,
        participants: {
          connect: [
            {
              id: userId
            }
          ]
        }
      }
    })
    res.status(201).json({
      message: "Room Created successfully",
      room
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating room",
    });
  }
}

export async function joinRoomController(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "User Id not found",
    });
    return;
  }

  const validInputs = JoinRoomSchema.safeParse(req.body);
  console.log(req.body);
  if (!validInputs.success) {
    res.status(411).json({
      message: "Invalid Input",
    });
    return;
  }

  try {
    const joinCode = validInputs.data.joinCode;
    const room = await prisma.room.update({
      where: {
        joincode: joinCode,
      },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.json({
      message: "Room Joined Successfully",
      room,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "Faced error joining room, please try again",
    });
    return;
  }
}

export async function fetchAllRoomsController(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "User Id not found",
    });
    return;
  }
  try {
    const rooms = await prisma.room.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      select: {
        id: true,
        title: true,
        joincode: true,
        createdat: true,
        admin: {
          select: {
            username: true,
          },
        },
        adminId: true,
        chat: {
          take: 1,
          orderBy: {
            id: "desc",
          },
          select: {
            user: {
              select: {
                username: true,
              },
            },
            content: true,
            createdAt: true,
          },
        },
        draw: {
          take: 10,
        },
      },
      orderBy: {
        createdat: "desc",
      },
    });

    const sortedRooms = rooms.sort((a, b) => {
      const aLatestChat = a.chat[0]?.createdAt || a.createdat;
      const bLatestChat = b.chat[0]?.createdAt || b.createdat;
      return new Date(bLatestChat).getTime() - new Date(aLatestChat).getTime();
    });

    res.json({
      message: "Rooms fetched successfully",
      rooms: sortedRooms,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error fetching rooms",
    });
  }
}
