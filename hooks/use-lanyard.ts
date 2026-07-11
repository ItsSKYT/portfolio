"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { DISCORD_USER_ID, type LanyardPresence } from "@/lib/lanyard"

const POLL_MS = 12_000
const SPOTIFY_POLL_MS = 3_000

export function useLanyard(userId = DISCORD_USER_ID) {
  const [presence, setPresence] = useState<LanyardPresence | null>(null)
  const [loading, setLoading] = useState(true)
  const presenceRef = useRef<LanyardPresence | null>(null)

  const applyPresence = useCallback((data: LanyardPresence) => {
    presenceRef.current = data
    setPresence(data)
    setLoading(false)
  }, [])

  const fetchPresence = useCallback(async () => {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
        cache: "no-store",
      })
      const json = await res.json()
      if (json.success) applyPresence(json.data)
    } catch {
      setLoading(false)
    }
  }, [applyPresence, userId])

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let pollTimer: ReturnType<typeof setInterval> | null = null
    let spotifyTimer: ReturnType<typeof setInterval> | null = null
    let closed = false

    const connect = () => {
      if (closed) return

      ws = new WebSocket("wss://api.lanyard.rest/socket")

      ws.onopen = () => {
        ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }))
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (message.op === 1) {
          ws?.send(JSON.stringify({ op: 3 }))
          return
        }

        if (message.op === 0) {
          if (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE") {
            applyPresence(message.d)
          }
        }
      }

      ws.onclose = () => {
        if (!closed) {
          reconnectTimer = setTimeout(connect, 2500)
        }
      }

      ws.onerror = () => {
        ws?.close()
      }
    }

    fetchPresence()
    connect()

    pollTimer = setInterval(fetchPresence, POLL_MS)

    spotifyTimer = setInterval(() => {
      const current = presenceRef.current
      if (!current?.listening_to_spotify || !current.spotify) return

      const { end } = current.spotify.timestamps
      if (Date.now() >= end - 500) {
        fetchPresence()
      }
    }, SPOTIFY_POLL_MS)

    return () => {
      closed = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (pollTimer) clearInterval(pollTimer)
      if (spotifyTimer) clearInterval(spotifyTimer)
      ws?.close()
    }
  }, [applyPresence, fetchPresence, userId])

  return { presence, loading, refetch: fetchPresence }
}
