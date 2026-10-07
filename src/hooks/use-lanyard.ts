"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DISCORD_USER_ID, type LanyardPresence } from "@/lib/lanyard";

const POLL_MS = 12_000;
const SPOTIFY_POLL_MS = 3_000;

/** Status Discord na żywo z Lanyard: websocket + zapasowe odpytywanie REST. */
export function useLanyard(userId = DISCORD_USER_ID) {
  const [presence, setPresence] = useState<LanyardPresence | null>(null);
  const [loading, setLoading] = useState(true);
  const presenceRef = useRef<LanyardPresence | null>(null);

  const applyPresence = useCallback((data: LanyardPresence) => {
    presenceRef.current = data;
    setPresence(data);
    setLoading(false);
  }, []);

  const fetchPresence = useCallback(async () => {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) applyPresence(json.data);
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [applyPresence, userId]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    const connect = () => {
      if (closed) return;
      ws = new WebSocket("wss://api.lanyard.rest/socket");
      ws.onopen = () => ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
      ws.onmessage = (event) => {
        let message: { op: number; t?: string; d?: unknown };
        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }
        if (message.op === 1) {
          ws?.send(JSON.stringify({ op: 3 }));
          return;
        }
        if (message.op === 0 && (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE")) {
          applyPresence(message.d as LanyardPresence);
        }
      };
      ws.onclose = () => {
        if (!closed) reconnectTimer = setTimeout(connect, 2500);
      };
      ws.onerror = () => ws?.close();
    };

    const first = setTimeout(fetchPresence, 0);
    connect();
    const pollTimer = setInterval(fetchPresence, POLL_MS);
    const spotifyTimer = setInterval(() => {
      const current = presenceRef.current;
      if (!current?.listening_to_spotify || !current.spotify) return;
      if (Date.now() >= current.spotify.timestamps.end - 500) fetchPresence();
    }, SPOTIFY_POLL_MS);

    return () => {
      closed = true;
      clearTimeout(first);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearInterval(pollTimer);
      clearInterval(spotifyTimer);
      ws?.close();
    };
  }, [applyPresence, fetchPresence, userId]);

  return { presence, loading, refetch: fetchPresence };
}
