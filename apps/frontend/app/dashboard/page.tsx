"use client";

import { useState, useEffect } from "react";
import RoomCard from "@/components/RoomCard";

interface Room {
  id: string;
  title: string;
  joincode: string;
  createdat: string;
  admin: {
    username: string;
  };
  chat: {
    user: { username: string };
    content: string;
    createdAt: string;
  }[];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"admin" | "participant">("admin");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5050";

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const endpoint =
          activeTab === "admin"
            ? "api/v1/room/adminRoom"
            : "api/v1/room/partcipantsRoom";

        const res = await fetch(`${API_URL}/${endpoint}`, {
          credentials: "include", 
        });

        const data = await res.json();

        if (res.ok) {
          setRooms(data.rooms);
          setMessage("");
        } else {
          setMessage(data.message || "Failed to load rooms");
        }
      } catch (err) {
        setMessage("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [activeTab]);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Your Dashboard</h1>

      {/* Tab Switch */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveTab("admin")}
          style={{
            backgroundColor: activeTab === "admin" ? "#0070f3" : "#ddd",
            color: activeTab === "admin" ? "#fff" : "#000",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Created Rooms
        </button>

        <button
          onClick={() => setActiveTab("participant")}
          style={{
            backgroundColor: activeTab === "participant" ? "#0070f3" : "#ddd",
            color: activeTab === "participant" ? "#fff" : "#000",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Joined Rooms
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}

      {!loading && !message && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
