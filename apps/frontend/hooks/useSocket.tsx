"use client";

import { useEffect, useRef, useState } from "react";
import useExtractToken from "./useExtractToken";

export function useWebSocket() {
  const [token] = useExtractToken();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🔗 Connected to WebSocket");
      setIsConnected(true);
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = (err) => console.error("⚠️ WebSocket error:", err);

    return () => ws.close();
  }, [token]);

  return { ws: wsRef.current, isConnected };
}
