"use client";

import { useRouter } from "next/navigation";
interface RoomCardProps {
  room: {
    id: string;
    title: string;
    joincode: string;
    createdat: string;
    admin: { username: string };
    chat: {
      user: { username: string };
      content: string;
      createdAt: string;
    }[];
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()
  const latestChat = room.chat?.[0];
  const lastMessage = latestChat
    ? `${latestChat.user.username}: ${latestChat.content}`
    : "No messages yet";

  const formattedDate = new Date(room.createdat).toLocaleString();

  const handleDashBorardToRoom = (joinCode : string) => {
    router.push(`dashboard/${joinCode}`)
  }

  return (
    <button
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        background: "black",
        color: "white"

      }}
      onClick={ () => handleDashBorardToRoom(room.joincode)}
    >
      <h3>{room.title}</h3>
      <p>
        <strong>Join Code:</strong> {room.joincode}
      </p>
      <p>
        <strong>Admin:</strong> {room.admin.username}
      </p>
      <p>
        <strong>Last Message:</strong> {lastMessage}
      </p>
      <p>
        <strong>Created:</strong> {formattedDate}
      </p>
    </button>
  );
}
