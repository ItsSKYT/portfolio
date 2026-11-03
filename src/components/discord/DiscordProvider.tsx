"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { DiscordProfile, LanyardPresence } from "@/lib/discord";

type DiscordState = {
  presence: LanyardPresence | null;
  profile: DiscordProfile | null;
  /** True until the first presence answer (or failure) arrives. */
  loading: boolean;
  refetch: () => void;
};

const DiscordContext = createContext<DiscordState>({ presence: null, profile: null, loading: true, refetch: () => {} });

const POLL_MS = 12_000;

/**
 * One Lanyard connection for the whole page (websocket + REST polling as a fallback)
 * and one fetch of the public profile (bio, banner, badges, nameplate).
 */
export function DiscordProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [presence, setPresence] = useState<LanyardPresence | null>(null);
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const presenceRef = useRef<LanyardPresence | null>(null);

  const apply = useCallback((data: LanyardPresence) => {
    presenceRef.current = data;
    setPresence(data);
    setLoading(false);
  }, []);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) apply(json.data);
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [apply, userId]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeat: number | undefined;
    let reconnect: number | undefined;
    let closed = false;

    const connect = () => {
      if (closed) return;
      ws = new WebSocket("wss://api.lanyard.rest/socket");
      ws.onmessage = (event) => {
        let msg: { op: number; t?: string; d?: { heartbeat_interval?: number } & Partial<LanyardPresence> };
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        if (msg.op === 1) {
          ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
          window.clearInterval(heartbeat);
          heartbeat = window.setInterval(() => ws?.send(JSON.stringify({ op: 3 })), msg.d?.heartbeat_interval ?? 30_000);
        } else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
          apply(msg.d as LanyardPresence);
        }
      };
      ws.onclose = () => {
        window.clearInterval(heartbeat);
        if (!closed) reconnect = window.setTimeout(connect, 2500);
      };
      ws.onerror = () => ws?.close();
    };

    const first = window.setTimeout(refetch, 0);
    connect();
    const poll = window.setInterval(refetch, POLL_MS);

    return () => {
      closed = true;
      window.clearTimeout(first);
      window.clearTimeout(reconnect);
      window.clearInterval(heartbeat);
      window.clearInterval(poll);
      ws?.close();
    };
  }, [apply, refetch, userId]);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://dcdn.dstn.to/profile/${userId}`)
      .then((res) => res.json())
      .then((json) => {
        const user = json.user;
        const p = json.user_profile;
        if (!user || cancelled) return;
        setProfile({
          bio: p?.bio ?? user.bio ?? null,
          pronouns: p?.pronouns || null,
          banner: user.banner ?? p?.banner ?? null,
          badges: (json.badges ?? []).map((b: { id: string; description: string; icon: string; link?: string }) => ({
            id: b.id,
            description: b.description,
            icon: b.icon,
            link: b.link,
          })),
          nameplate: user.collectibles?.nameplate ?? null,
        });
      })
      .catch(() => {
        // The card still works from Lanyard alone.
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return <DiscordContext.Provider value={{ presence, profile, loading, refetch }}>{children}</DiscordContext.Provider>;
}

export const useDiscord = () => useContext(DiscordContext);

/** A clock that ticks every 500 ms while active (Spotify progress). */
export function useNow(active: boolean) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 500);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [active]);
  return now;
}
