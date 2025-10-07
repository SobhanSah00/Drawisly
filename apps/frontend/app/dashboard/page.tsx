"use client";

import { useState, useEffect } from "react";
import { Pencil, Users, MessageCircle, Calendar, ArrowRight, Sparkles, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter()

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDashBorardToRoom = (joinCode : string) => {
    router.push(`dashboard/${joinCode}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center transform rotate-12">
                <Pencil className="w-7 h-7 text-white -rotate-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Your Dashboard
                </h1>
                <p className="text-sm text-gray-600">Manage your drawing rooms</p>
              </div>
            </div>
            <button className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>New Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("admin")}
            className={`relative px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "admin"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-orange-50 border-2 border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Created Rooms</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("participant")}
            className={`relative px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "participant"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-orange-50 border-2 border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Joined Rooms</span>
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {message && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-center">
            {message}
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !message && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  <h3 className="text-xl font-bold text-white mb-2 relative z-10 truncate">
                    {room.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-orange-100 text-sm relative z-10">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(room.createdat)}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Admin: {room.admin.username}</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Join Code</p>
                    <p className="text-lg font-bold text-orange-600 tracking-wider">
                      {room.joincode}
                    </p>
                  </div>

                  {room.chat && room.chat.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center space-x-2 text-gray-500 text-xs mb-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Latest Chat</span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">
                        <span className="font-semibold">{room.chat[0].user.username}:</span> {room.chat[0].content}
                      </p>
                    </div>
                  )}

                  <button onClick={() => handleDashBorardToRoom(room.joincode)} className="w-full group/btn px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    <span>Open Room</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !message && rooms.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pencil className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No rooms yet
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "admin"
                ? "Create your first drawing room to get started"
                : "Join a room to start collaborating"}
            </p>
            <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2 mx-auto">
              <Plus className="w-5 h-5" />
              <span>Create New Room</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}