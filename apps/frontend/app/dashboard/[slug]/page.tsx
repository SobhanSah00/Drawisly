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

export default function RoomDetailPage() {
  const { slug } = useParams();
  const API_URL = "http://localhost:5050";

  const [roomId, setRoomId] = useState<string>("");
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!roomId) return;

    const fetchDrawings = async () => {
      setLoading(true);
      try {
        const drawRes = await fetch(`${API_URL}/api/v1/draw/AllDraw/${roomId}`, {
          credentials: "include",
        });
        const drawData = await drawRes.json();

        if (drawRes.ok) setDrawings(drawData.AllDrawings || []);
      } catch (err) {
        console.error("Error fetching drawings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawings();
  }, [roomId]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "white" }}>
        Loading room...
      </p>
    );
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", background: "#0a0a0a" }}>
      {/* Drawing Panel */}
      <div
        style={{
          flex: showChat ? 0.7 : 1,
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        <DrawingPanel drawings={drawings} />
      </div>

      {/* Chat Panel */}
      <div
        style={{
          flex: showChat ? 0.3 : 0,
          transition: "all 0.3s ease",
          overflow: "hidden",
          borderLeft: showChat ? "1px solid #333" : "none",
          background: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showChat && roomId && <ChatPanel roomId={roomId} apiUrl={API_URL} slug={slug}/>}
      </div>

      {/* Toggle Chat Button */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        style={{
          position: "absolute",
          right: showChat ? "calc(30% + 1rem)" : "1rem",
          top: "1rem",
          backgroundColor: "#0070f3",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          zIndex: 100,
          fontWeight: "500",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 8px rgba(0, 112, 243, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0051cc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0070f3";
        }}
      >
        {showChat ? "Hide Chat" : "Show Chat"}
      </button>
    </div>
  );
}