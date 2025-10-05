"use client";

import { useWebSocket } from "@/hooks/useSocket";
import { ParamValue } from "next/dist/server/request/params";
import { useEffect, useState, useRef, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";

interface Chat {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

interface ChatPanelProps {
  roomId: string;
  apiUrl: string;
  slug: ParamValue;
}

export default function ChatPanel({ roomId, apiUrl, slug }: ChatPanelProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  const { ws, isConnected } = useWebSocket();

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);

  const fetchChats = useCallback(
    async (isInitial = false) => {
      if (!roomId || (!isInitial && (!hasMore || loading))) return;

      setLoading(true);
      try {
        const url = new URL(`${apiUrl}/api/v1/chat/chatDetails/${roomId}`);
        url.searchParams.append("limit", "6");
        if (cursor && !isInitial) {
          url.searchParams.append("cursor", cursor);
        }

        const res = await fetch(url.toString(), {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          const newChats = data.chats || [];

          if (isInitial) {
            setChats(newChats);
            setInitialLoad(false);
            setTimeout(() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }, 100);
          } else {
            prevScrollHeight.current = scrollRef.current?.scrollHeight || 0;
            setChats((prev) => [...prev, ...newChats]);
            setTimeout(() => {
              if (scrollRef.current && prevScrollHeight.current > 0) {
                const newScrollHeight = scrollRef.current.scrollHeight;
                scrollRef.current.scrollTop =
                  newScrollHeight - prevScrollHeight.current;
              }
            }, 0);
          }

          setCursor(data.pagination.nextCursor);
          setHasMore(data.pagination.hasMore);
        }
      } catch (err) {
        console.error("Chat fetch error", err);
      } finally {
        setLoading(false);
      }
    },
    [roomId, cursor, hasMore, loading, apiUrl]
  );

  // Join room and listen for messages
  useEffect(() => {
    if (!ws || !isConnected) return;

    ws.send(JSON.stringify({ type: "join_room", roomId: slug }));

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        console.log("📩 Received WebSocket message:", data);

        if (data.type === "chat") {
          const newChat: Chat = {
            id: data.id || `temp-${Date.now()}`,
            content: data.content,
            createdAt: data.createdAt || new Date().toISOString(),
            user: {
              username: data.user?.username || "Unknown",
            },
          };

          setChats((prev) => [newChat, ...prev]);

          setTimeout(() => {
            if (scrollRef.current) {
              const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
              const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
              if (isNearBottom) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }
          }, 0);
        } else if (data.type === "info") {
          console.log("ℹ️ Info:", data.content);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
      ws.send(JSON.stringify({ type: "leave_room", roomId: slug }));
    };
  }, [ws, isConnected, slug]);

  useEffect(() => {
    if (!roomId) return;

    setChats([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoad(true);
    fetchChats(true);
  }, [roomId]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore || initialLoad) return;
    if (el.scrollTop < 150) {
      fetchChats(false);
    }
  }, [loading, hasMore, fetchChats, initialLoad]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !ws || !isConnected) return;

    ws.send(
      JSON.stringify({
        type: "chat",
        roomId: slug,
        content: message.trim(),
      })
    );
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Header */}
      <div className="p-4 border-b border-[#333] bg-[#0f0f0f]">
        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span>Chat</span>
        </h2>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto flex flex-col-reverse gap-2"
      >
        {loading && cursor && (
          <div className="text-center text-gray-500 py-2 text-sm flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            Loading older messages...
          </div>
        )}

        {!hasMore && chats.length > 0 && (
          <div className="text-center text-gray-600 py-2 text-sm">
            📜 No more messages
          </div>
        )}

        {chats.length === 0 && !loading && (
          <div className="text-gray-500 text-center py-8 px-4">
            No messages yet. Start the conversation!
          </div>
        )}

        {chats.map((msg) => (
          <div
            key={msg.id}
            className="p-3 bg-[#2a2a2a] text-white rounded-lg border border-[#333] hover:border-[#444] transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <strong className="text-[#ff6b35] text-sm font-medium">
                {msg.user.username}
              </strong>
              <small className="text-gray-500 text-xs">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
            <p className="text-gray-100 break-words leading-relaxed text-[15px]">
              {msg.content}
            </p>
          </div>
        ))}

        {loading && !cursor && (
          <div className="text-center text-gray-500 py-8 flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            Loading messages...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-[#333] flex gap-2"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="flex-1 px-4 py-3 rounded-lg border border-[#444] bg-[#2a2a2a] text-white outline-none focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35] transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!message.trim() || !isConnected}
          className="px-6 py-3 rounded-lg border-none bg-[#ff6b35] text-white cursor-pointer font-medium transition-all hover:bg-[#e55a2b] disabled:bg-[#444] disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Send size={18} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}