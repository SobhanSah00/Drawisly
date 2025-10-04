"use client";

import { useWebSocket } from "@/hooks/useSocket";
import { ParamValue } from "next/dist/server/request/params";
import { useEffect, useState, useRef, useCallback } from "react";

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

  useEffect(() => {
    if (!ws || !isConnected) return;

    ws.send(JSON.stringify({ type: "join_room", roomId: slug }));

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "chat") {
          const newChat: Chat = {
            id: data.id ,
            content: data.content,
            createdAt: data.createdAt || new Date().toISOString(),
            user: {
              username: data.user?.username ?? "Unknown",
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#1a1a1a",
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #333",
          background: "#0f0f0f",
        }}
      >
        <h2 style={{ margin: 0, color: "white", fontSize: "1.25rem" }}>
          💬 Chat
        </h2>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          gap: "0.5rem",
        }}
      >
        {loading && cursor && (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              padding: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            Loading older messages...
          </div>
        )}

        {!hasMore && chats.length > 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              padding: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            📜 No more messages
          </div>
        )}

        {chats.length === 0 && !loading && (
          <div
            style={{
              color: "#888",
              textAlign: "center",
              padding: "2rem 1rem",
            }}
          >
            No messages yet. Start the conversation!
          </div>
        )}

        {chats.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "0.75rem",
              background: "#2a2a2a",
              color: "white",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <strong style={{ color: "#60a5fa", fontSize: "0.9rem" }}>
                {msg.user.username}
              </strong>
              <small style={{ color: "#888", fontSize: "0.75rem" }}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
            <p
              style={{
                margin: 0,
                wordBreak: "break-word",
                lineHeight: "1.5",
                fontSize: "0.95rem",
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}

        {loading && !cursor && (
          <div style={{ textAlign: "center", color: "#888", padding: "2rem" }}>
            Loading messages...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          padding: "1rem",
          borderTop: "1px solid #333",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#2a2a2a",
            color: "white",
            outline: "none",
            fontSize: "0.95rem",
          }}
        />
        <button
          type="submit"
          disabled={!message.trim() || !isConnected}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            border: "none",
            background: message.trim() && isConnected ? "#0070f3" : "#444",
            color: "white",
            cursor: message.trim() && isConnected ? "pointer" : "not-allowed",
            fontWeight: "500",
            fontSize: "0.95rem",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}