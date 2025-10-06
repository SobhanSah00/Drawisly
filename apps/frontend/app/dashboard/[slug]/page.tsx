"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatPanel from "@/components/ChatPanel";
import DrawingPanel from "@/components/DrawingPanel";
import { MessageSquare, X } from "lucide-react";

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
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b35] mb-4"></div>
          <p className="text-gray-400 text-lg">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Drawing Panel */}
      <div 
        className={`relative transition-all duration-300 ease-in-out ${
          showChat ? "w-[70%]" : "w-full"
        }`}
      >
        <DrawingPanel drawings={drawings} roomId={roomId} slug={slug} />
      </div>

      {/* Chat Panel */}
      <div 
        className={`transition-all duration-300 ease-in-out border-l border-[#333] bg-[#1a1a1a] flex flex-col ${
          showChat ? "w-[30%]" : "w-0"
        } overflow-hidden`}
      >
        {showChat && roomId && <ChatPanel roomId={roomId} apiUrl={API_URL} slug={slug} />}
      </div>

      {/* Toggle Chat Button */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className={`fixed top-4 z-50 bg-[#ff6b35] text-white px-4 py-2 rounded-lg border-none cursor-pointer font-medium transition-all duration-300 ease-in-out shadow-lg hover:bg-[#e55a2b] flex items-center gap-2 ${
          showChat ? "right-[calc(30%+1rem)]" : "right-4"
        }`}
        title={showChat ? "Hide Chat" : "Show Chat"}
      >
        {showChat ? (
          <>
            <X size={18} />
            <span>Hide Chat</span>
          </>
        ) : (
          <>
            <MessageSquare size={18} />
            <span>Show Chat</span>
          </>
        )}
      </button>
    </div>
  );
}