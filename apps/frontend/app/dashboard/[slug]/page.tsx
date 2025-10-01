"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatPanel from "@/components/ChatPanel";
import DrawingPanel from "@/components/DrawingPanel";

interface Drawing {
  id: string;
  data: any;
  createdAt: string;
}

interface Chat {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

export default function RoomDetailPage() {
  const { slug } = useParams(); // dynamic joincode
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

  const [roomId, setRoomId] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch roomId using slug
  useEffect(() => {
    if (!slug) return;
    const fetchRoomId = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/room/slugToRoomId/${slug}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.roomId) {
          setRoomId(data.roomId.id);
        }
      } catch (err) {
        console.error("Error fetching roomId", err);
      }
    };
    fetchRoomId();
  }, [slug]);

  // 2️⃣ Once roomId available → fetch drawings + chats
  useEffect(() => {
    if (!roomId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [drawRes, chatRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/draw/AllDraw/${roomId}`, { credentials: "include" }),
          fetch(`${API_URL}/api/v1/chat/chatDetails/${roomId}`, { credentials: "include" }),
        ]);

        const [drawData, chatData] = await Promise.all([
          drawRes.json(),
          chatRes.json(),
        ]);

        if (drawRes.ok) setDrawings(drawData.AllDrawings || []);
        if (chatRes.ok) setChats(chatData.chats || []);
      } catch (err) {
        console.error("Error fetching room data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading room...</p>;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
      {/* 🎨 Drawing Section */}
      <div style={{ flex: showChat ? 0.7 : 1, transition: "all 0.3s ease" }}>
        <DrawingPanel drawings={drawings} />
      </div>

      {/* 💬 Collapsible Chat Section */}
      <div
        style={{
          flex: showChat ? 0.3 : 0,
          transition: "all 0.3s ease",
          overflow: "hidden",
          borderLeft: showChat ? "1px solid #ddd" : "none",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showChat && <ChatPanel chats={chats} />}
      </div>

      {/* Toggle Chat Button */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        style={{
          position: "absolute",
          right: showChat ? "32%" : "1rem",
          top: "1rem",
          backgroundColor: "#0070f3",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          zIndex: 100,
        }}
      >
        {showChat ? "Hide Chat" : "Show Chat"}
      </button>
    </div>
  );
}
