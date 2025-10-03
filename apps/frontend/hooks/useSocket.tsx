"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(roomId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // or skip if using cookies
    const url = `ws://localhost:8080?token=${token}${roomId ? `&roomId=${roomId}` : ""}`;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => console.log("🔗 Connected to WebSocket");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Message:", data);
      setMessages((prev) => [...prev, data]);
    };
    ws.onclose = () => console.log("❌ Disconnected");
    ws.onerror = (err) => console.error("⚠️ WebSocket error:", err);

    return () => {
      ws.close();
    };
  }, [roomId]);

  const sendMessage = useCallback((type: string, content: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, content }));
    }
  }, []);

  return { socket: socketRef.current, messages, sendMessage };
}
