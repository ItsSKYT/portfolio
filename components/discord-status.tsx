"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Gamepad2, Monitor, Smartphone, Tv } from "lucide-react"
import { DiscordBio } from "@/components/discord-bio"
import { useDiscordProfile } from "@/hooks/use-discord-profile"
import { useLanyard } from "@/hooks/use-lanyard"
import {
  DISCORD_USER_ID,
  colorIntToHex,
  getBadgeIconUrl,
  getBannerUrl,
  getNameplateStaticUrl,
  getNameplateVideoUrl,
} from "@/lib/discord-profile"
import {
  STATUS_COLORS,
  STATUS_LABELS,
  getAvatarUrl,
  getCustomStatus,
  getDecorationUrl,
  getDisplayName,
  getVisibleActivities,
  type LanyardActivity,
} from "@/lib/lanyard"

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function useSpotifyProgress(
  trackId: string | undefined,
  start: number,
  end: number,
  active: boolean,
  onTrackEnd: () => void,
) {
  const [progress, setProgress] = useState(0)
  const onTrackEndRef = useRef(onTrackEnd)
  const lastEndFetchRef = useRef(0)

  useEffect(() => {
    onTrackEndRef.current = onTrackEnd
  }, [onTrackEnd])

  useEffect(() => {
    if (!active || !trackId) {
      setProgress(0)
      return
    }

    const update = () => {
      const now = Date.now()

      if (now >= end) {
        setProgress(100)
        if (now - lastEndFetchRef.current > 2_000) {
          lastEndFetchRef.current = now
          onTrackEndRef.current()
        }
        return
      }

      lastEndFetchRef.current = 0
      const value = ((now - start) / (end - start)) * 100
      setProgress(Math.min(100, Math.max(0, value)))
    }

    update()
    const interval = setInterval(update, 500)
    return () => clearInterval(interval)
  }, [trackId, start, end, active])

  return progress
}

function ActivityRow({ activity }: { activity: LanyardActivity }) {
  const label =
    activity.type === 0
      ? "Gra w"
      : activity.type === 1
        ? "Streamuje"
        : activity.type === 3
          ? "Ogląda"
          : activity.type === 5
            ? "Rywalizuje w"
            : "Aktywność"

  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-3 backdrop-blur-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-muted-foreground">
        <Gamepad2 size={16} />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">{activity.name}</p>
        {activity.details && (
          <p className="truncate text-xs text-muted-foreground">{activity.details}</p>
        )}
        {activity.state && (
          <p className="truncate text-xs text-muted-foreground">{activity.state}</p>
        )}
      </div>
    </div>
  )
}

function NameplateBackground({ asset }: { asset: string }) {
  const [useVideo, setUseVideo] = useState(true)

  if (useVideo) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        onError={() => setUseVideo(false)}
      >
        <source src={getNameplateVideoUrl(asset)} type="video/webm" />
      </video>
    )
  }

  return (
    <img
      src={getNameplateStaticUrl(asset)}
      alt=""
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  )
}

function DiscordStatusSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/50">
      <div className="h-28 animate-pulse bg-secondary" />
      <div className="px-5 pb-5">
        <div className="-mt-10 h-20 w-20 animate-pulse rounded-full bg-secondary" />
        <div className="mt-4 h-4 w-32 animate-pulse rounded bg-secondary" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-secondary" />
        <div className="mt-6 h-16 animate-pulse rounded-xl bg-secondary" />
      </div>
    </div>
  )
}

export function DiscordStatus() {
  const { profile, loading: profileLoading } = useDiscordProfile()
  const { presence, loading: presenceLoading, refetch } = useLanyard()
  const isSpotifyActive = Boolean(
    presence?.listening_to_spotify && presence.spotify,
  )
  const spotifyProgress = useSpotifyProgress(
    presence?.spotify?.track_id,
    presence?.spotify?.timestamps.start ?? 0,
    presence?.spotify?.timestamps.end ?? 0,
    isSpotifyActive,
    refetch,
  )

  const loading = profileLoading && presenceLoading && !presence

  if (loading) {
    return <DiscordStatusSkeleton />
  }

  if (!presence) {
    return (
      <div className="rounded-3xl border border-border bg-card/50 p-5 text-sm text-muted-foreground">
        Nie udało się pobrać statusu Discord.
      </div>
    )
  }

  const displayName = getDisplayName(presence)
  const customStatus = getCustomStatus(presence.activities)
  const activities = getVisibleActivities(
    presence.activities,
    presence.listening_to_spotify,
  )
  const statusColor = STATUS_COLORS[presence.discord_status]
  const nameColors =
    presence.discord_user.display_name_styles?.colors.map(colorIntToHex) ?? []
  const nameplateAsset =
    profile?.nameplate?.asset ??
    presence.discord_user.collectibles?.nameplate?.asset
  const themeGradient =
    profile?.themeColors && profile.themeColors.length >= 2
      ? `linear-gradient(135deg, ${profile.themeColors.map(colorIntToHex).join(", ")})`
      : null

  return (
    <motion.div
      role="link"
      tabIndex={0}
      onClick={() =>
        window.open(`https://discord.com/users/${DISCORD_USER_ID}`, "_blank", "noopener,noreferrer")
      }
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          window.open(
            `https://discord.com/users/${DISCORD_USER_ID}`,
            "_blank",
            "noopener,noreferrer",
          )
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="group relative block cursor-pointer overflow-hidden rounded-3xl border border-border bg-[#111214] shadow-2xl transition-colors hover:border-primary/40"
    >
      {nameplateAsset && <NameplateBackground asset={nameplateAsset} />}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#111214]/55 backdrop-blur-[1px]"
      />

      {themeGradient && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
          style={{ background: themeGradient }}
        />
      )}

      <div className="relative">
        <div className="relative h-28 overflow-hidden">
          {profile?.banner ? (
            <Image
              src={getBannerUrl(presence.discord_user.id, profile.banner, 600)}
              alt=""
              fill
              className="object-cover"
              sizes="480px"
              priority
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                backgroundColor: profile?.bannerColor ?? "#1a1a1f",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#111214]/90" />
        </div>

        <div className="relative px-5 pb-5">
          <div className="relative -mt-12 w-fit">
            <div
              className="absolute -inset-1 rounded-full opacity-90"
              style={{
                background: `conic-gradient(from 180deg, ${statusColor}, transparent 55%, ${statusColor})`,
              }}
            />
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-[5px] border-[#111214] bg-[#111214]">
              <Image
                src={getAvatarUrl(
                  presence.discord_user.id,
                  presence.discord_user.avatar,
                  256,
                )}
                alt={displayName}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            {presence.discord_user.avatar_decoration_data && (
              <img
                src={getDecorationUrl(
                  presence.discord_user.avatar_decoration_data.asset,
                )}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] max-w-none"
              />
            )}
            <span
              className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[4px] border-[#111214]"
              style={{ backgroundColor: statusColor }}
              title={STATUS_LABELS[presence.discord_status]}
            />
          </div>

          <div className="mt-3">
            <p
              className={`truncate text-xl font-semibold ${
                presence.discord_user.display_name_styles
                  ? "discord-display-name"
                  : ""
              }`}
              style={
                nameColors.length > 1
                  ? {
                      backgroundImage: `linear-gradient(90deg, ${nameColors.join(", ")})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : nameColors.length === 1
                    ? { color: nameColors[0] }
                    : undefined
              }
            >
              {displayName}
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              @{presence.discord_user.username}
            </p>
          </div>

          {profile?.badges && profile.badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.badges.map((badge) => (
                <img
                  key={badge.id}
                  src={getBadgeIconUrl(badge.icon)}
                  alt={badge.description}
                  title={badge.description}
                  className="h-5 w-5"
                />
              ))}
            </div>
          )}

          {profile?.pronouns && (
            <p className="mt-3 text-sm text-muted-foreground">{profile.pronouns}</p>
          )}

          {profile?.bio && <DiscordBio content={profile.bio} />}

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: statusColor }}
              >
                {STATUS_LABELS[presence.discord_status]}
              </span>
              <span className="text-border">·</span>
              <div className="flex items-center gap-1.5">
                {presence.active_on_discord_desktop && (
                  <Monitor size={13} className="opacity-70" />
                )}
                {presence.active_on_discord_mobile && (
                  <Smartphone size={13} className="opacity-70" />
                )}
                {presence.active_on_discord_web && (
                  <Tv size={13} className="opacity-70" />
                )}
              </div>
            </div>

            {customStatus?.state && (
              <div className="mt-3 text-sm text-foreground/90">
                {customStatus.emoji?.name && (
                  <span className="mr-1.5">{customStatus.emoji.name}</span>
                )}
                {customStatus.state}
              </div>
            )}

            {isSpotifyActive && presence.spotify && (
              <div
                key={presence.spotify.track_id}
                className="relative mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3"
              >
                {presence.spotify.album_art_url && (
                  <div
                    aria-hidden
                    className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-xl"
                    style={{
                      backgroundImage: `url(${presence.spotify.album_art_url})`,
                    }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={presence.spotify.album_art_url}
                      alt={presence.spotify.album}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1.5 text-[#1db954]">
                      <SpotifyIcon className="h-3.5 w-3.5" />
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                        Słucha na Spotify
                      </span>
                    </div>
                    <p className="truncate text-sm font-medium text-foreground">
                      {presence.spotify.song}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {presence.spotify.artist}
                    </p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#1db954] transition-[width] duration-500 ease-linear"
                        style={{ width: `${spotifyProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activities.map((activity) => (
              <div key={activity.id} className="mt-3">
                <ActivityRow activity={activity} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
