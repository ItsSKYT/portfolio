"use client";
/* eslint-disable @next/next/no-img-element -- remote Discord/Spotify CDN images on a static export */

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { cx, vars } from "@/lib/cx";
import { useReducedMotion } from "@/lib/motion";
import {
  STATUS_LABELS,
  activityImageUrl,
  activityLabel,
  avatarUrl,
  badgeIconUrl,
  bannerUrl,
  customStatus,
  decorationUrl,
  displayName,
  formatTime,
  nameplateStillUrl,
  nameplateVideoUrl,
  noLongDash,
  visibleActivities,
  type DiscordStatus,
  type LanyardActivity,
} from "@/lib/discord";
import { Arrow } from "../skyt/Arrow";
import { useDiscord, useNow } from "./DiscordProvider";

/** Status as a shape and a colour: full disc, crescent, bar, ring. The word always sits beside it. */
export function StatusMark({ status, size = 8, ring }: { status: DiscordStatus | null; size?: number; ring?: boolean }) {
  return (
    <span
      className={cx("dc-mark", `dc-mark--${status ?? "unknown"}`, ring && "dc-mark--ring")}
      style={vars({ "--size": `${size}px` })}
      aria-hidden="true"
    />
  );
}

const TOKEN = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|_[^_\s][^_]*_|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+)/g;

/** A small subset of Discord markdown: bold, italic, code, [links](url) and bare links. */
function Bio({ content }: { content: string }) {
  const lines = noLongDash(content).split("\n").filter((l) => l.trim());
  return (
    <div className="dc-bio">
      {lines.map((line, li) => (
        <p key={li}>
          {line.split(TOKEN).map((part, i) => {
            if (!part) return null;
            if (/^(\*\*|__).+\1$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
            if (/^`.+`$/.test(part)) return <code key={i}>{part.slice(1, -1)}</code>;
            const md = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
            if (md || /^https?:\/\//.test(part)) {
              const href = md ? md[2] : part;
              return (
                <a key={i} className="sk-link sk-link--sky" href={href} target="_blank" rel="noopener noreferrer">
                  {md ? md[1] : part.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              );
            }
            if (/^([*_]).+\1$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
            return <Fragment key={i}>{part}</Fragment>;
          })}
        </p>
      ))}
    </div>
  );
}

/** Discord nameplates animate as .webm; falls back to the still frame under reduced motion or on error. */
function Nameplate({ asset }: { asset: string }) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  if (reduced || failed) {
    return <div className="dc-nameplate" style={{ backgroundImage: `url(${nameplateStillUrl(asset)})` }} aria-hidden="true" />;
  }
  return (
    <video className="dc-nameplate" autoPlay loop muted playsInline poster={nameplateStillUrl(asset)} onError={() => setFailed(true)} aria-hidden="true">
      <source src={nameplateVideoUrl(asset)} type="video/webm" onError={() => setFailed(true)} />
    </video>
  );
}

const ICONS = {
  desktop: "M2.5 4.5h15v9h-15zM7 17.5h6M10 13.5v4",
  mobile: "M6.5 2.5h7v15h-7zM9 15h2",
  web: "M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM2.5 10h15M10 2.5c2.2 2.4 2.2 12.6 0 15M10 2.5c-2.2 2.4-2.2 12.6 0 15",
  game: "M6 7.5h8a3.5 3.5 0 0 1 3.4 4.3l-.6 2.6a1.6 1.6 0 0 1-2.8.6L12.5 13h-5L6 15a1.6 1.6 0 0 1-2.8-.6l-.6-2.6A3.5 3.5 0 0 1 6 7.5ZM6.5 10v2M5.5 11h2M13 10.5h.01M14.5 11.5h.01",
};

function Icon({ name, size = 14 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpotifyGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function TopBar({ status, note }: { status: DiscordStatus | null; note?: string }) {
  return (
    <div className="dc-top">
      <span>Discord / na żywo</span>
      <span className="dc-top__status">
        <StatusMark status={status} size={8} />
        {note ?? (status ? STATUS_LABELS[status] : "")}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Ładowanie statusu Discord">
      <TopBar status={null} note="Łączenie" />
      <div className="dc-banner dc-shimmer" />
      <div className="dc-body">
        <div className="dc-avatar dc-shimmer" />
        <div className="dc-line dc-shimmer" style={{ width: 160, height: 24, marginTop: 20 }} />
        <div className="dc-line dc-shimmer" style={{ width: 96, marginTop: 10 }} />
        <div className="dc-line dc-shimmer" style={{ width: "80%", marginTop: 24 }} />
        <div className="dc-line dc-shimmer" style={{ width: "55%", marginTop: 8 }} />
      </div>
    </div>
  );
}

function Fallback({ name }: { name: string }) {
  return (
    <div>
      <TopBar status={null} note="Status niedostępny" />
      <div className="dc-banner dc-banner--dots" />
      <div className="dc-body">
        <div className="dc-avatar dc-avatar--letter">{name.slice(0, 1)}</div>
        <p className="dc-name">{name}</p>
        <p className="dc-muted">Nie udało się teraz pobrać statusu. Profil na Discordzie działa normalnie.</p>
      </div>
    </div>
  );
}

function Activity({ activity }: { activity: LanyardActivity }) {
  const img = activityImageUrl(activity);
  return (
    <div className="dc-item">
      <div className="dc-art">{img ? <img src={img} alt="" loading="lazy" /> : <Icon name="game" size={20} />}</div>
      <div className="dc-item__text">
        <p className="dc-label">{activityLabel(activity.type)}</p>
        <p className="dc-item__title">{noLongDash(activity.name)}</p>
        {activity.details && <p className="dc-muted dc-trunc">{noLongDash(activity.details)}</p>}
        {activity.state && <p className="dc-faint dc-trunc">{noLongDash(activity.state)}</p>}
      </div>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="dc-row">{children}</div>;
}

/** Live Discord card: presence, profile, custom status, devices, Spotify with progress, games. */
export function DiscordCard({ fallbackName, profileUrl }: { fallbackName: string; profileUrl: string }) {
  const { presence, profile, loading, refetch } = useDiscord();
  const spotify = presence?.listening_to_spotify ? presence.spotify : null;
  const now = useNow(Boolean(spotify));

  // When a track ends, pull the next one (at most every 2 s).
  const lastEndFetch = useRef(0);
  useEffect(() => {
    if (!spotify || !now || now < spotify.timestamps.end) return;
    if (now - lastEndFetch.current > 2000) {
      lastEndFetch.current = now;
      refetch();
    }
  }, [now, spotify, refetch]);

  const state = presence ? "ready" : loading ? "loading" : "error";
  let body: ReactNode;

  if (!presence) {
    body = state === "loading" ? <Skeleton /> : <Fallback name={fallbackName} />;
  } else {
    const user = presence.discord_user;
    const name = noLongDash(displayName(presence));
    const custom = customStatus(presence.activities);
    const activities = visibleActivities(presence.activities, presence.listening_to_spotify);
    const nameplate = profile?.nameplate?.asset ?? user.collectibles?.nameplate?.asset;
    const devices = [
      presence.active_on_discord_desktop && { icon: "desktop" as const, label: "Komputer" },
      presence.active_on_discord_mobile && { icon: "mobile" as const, label: "Telefon" },
      presence.active_on_discord_web && { icon: "web" as const, label: "Przeglądarka" },
    ].filter((d): d is { icon: "desktop" | "mobile" | "web"; label: string } => Boolean(d));
    const total = spotify ? spotify.timestamps.end - spotify.timestamps.start : 0;
    const elapsed = spotify && now ? Math.min(total, Math.max(0, now - spotify.timestamps.start)) : 0;

    body = (
      <div>
        <TopBar status={presence.discord_status} />
        <div className={cx("dc-banner", !profile?.banner && "dc-banner--dots")}>
          {profile?.banner && <img src={bannerUrl(user.id, profile.banner)} alt="" />}
        </div>

        <div className="dc-body">
          {nameplate && <Nameplate asset={nameplate} />}
          <div className="dc-avatar-wrap">
            <div className="dc-avatar">
              <img src={avatarUrl(user.id, user.avatar)} alt={name} />
            </div>
            {user.avatar_decoration_data && (
              <img className="dc-decoration" src={decorationUrl(user.avatar_decoration_data.asset)} alt="" aria-hidden="true" />
            )}
            <span className="dc-avatar__status" title={STATUS_LABELS[presence.discord_status]}>
              <StatusMark status={presence.discord_status} size={16} ring />
            </span>
          </div>

          <div className="dc-ident">
            <div className="dc-ident__names">
              <p className="dc-name">{name}</p>
              <p className="dc-handle">
                @{user.username}
                {profile?.pronouns ? ` / ${noLongDash(profile.pronouns)}` : ""}
              </p>
            </div>
            {profile && profile.badges.length > 0 && (
              <ul className="dc-badges" aria-label="Odznaki Discord">
                {profile.badges.map((b) => (
                  <li key={b.id} title={b.description}>
                    <img src={badgeIconUrl(b.icon)} alt={b.description} width={18} height={18} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {profile?.bio && <Bio content={profile.bio} />}
        </div>

        <Row>
          <div className="dc-now">
            <p className="dc-label">Teraz</p>
            {devices.length > 0 ? (
              <ul className="dc-devices">
                {devices.map((d) => (
                  <li key={d.label}>
                    <Icon name={d.icon} size={13} />
                    {d.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dc-label dc-faint">{STATUS_LABELS[presence.discord_status]}</p>
            )}
          </div>

          {custom?.state && (
            <p className="dc-custom">
              {custom.emoji?.name && !custom.emoji.id && <span className="dc-custom__emoji">{custom.emoji.name}</span>}
              {noLongDash(custom.state)}
            </p>
          )}

          {spotify && (
            <a
              key={spotify.track_id}
              className="dc-item dc-spotify dc-enter"
              href={`https://open.spotify.com/track/${spotify.track_id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Słucha na Spotify: ${spotify.song}, ${spotify.artist}`}
            >
              <div className="dc-art dc-art--lg">{spotify.album_art_url && <img src={spotify.album_art_url} alt="" />}</div>
              <div className="dc-item__text">
                <p className="dc-label dc-spotify__label">
                  <SpotifyGlyph />
                  Słucha na Spotify
                </p>
                <p className="dc-item__title dc-spotify__song">{noLongDash(spotify.song)}</p>
                <p className="dc-muted dc-trunc">{noLongDash(spotify.artist)}</p>
                <div className="dc-progress">
                  <span>{formatTime(elapsed)}</span>
                  <span className="dc-progress__bar">
                    <span style={{ transform: `scaleX(${total ? elapsed / total : 0})` }} />
                  </span>
                  <span>{formatTime(total)}</span>
                </div>
              </div>
            </a>
          )}

          {activities.map((a) => (
            <Activity key={a.id} activity={a} />
          ))}

          {!spotify && activities.length === 0 && !custom?.state && <p className="dc-label dc-faint dc-empty">Brak aktywności w tej chwili</p>}
        </Row>
      </div>
    );
  }

  return (
    <div className="dc-card">
      <div key={state} className="dc-enter">
        {body}
      </div>
      <a className="dc-profile" href={profileUrl} target="_blank" rel="noopener noreferrer" data-cursor="Discord">
        <span>Otwórz profil na Discordzie</span>
        <Arrow />
      </a>
    </div>
  );
}

/** Compact live status for the hero: status word, and the song when Spotify is playing. */
export function PresencePill({ href }: { href: string }) {
  const { presence } = useDiscord();
  if (!presence) return null;
  const spotify = presence.listening_to_spotify ? presence.spotify : null;
  const game = visibleActivities(presence.activities, presence.listening_to_spotify).find((a) => a.type === 0);
  return (
    <a className="dc-pill dc-enter" href={href}>
      <StatusMark status={presence.discord_status} size={8} />
      <span className="dc-pill__status">{STATUS_LABELS[presence.discord_status]} na Discordzie</span>
      {spotify ? (
        <span className="dc-pill__extra">
          <SpotifyGlyph />
          {noLongDash(spotify.song)} · {noLongDash(spotify.artist)}
        </span>
      ) : game ? (
        <span className="dc-pill__extra">Gra w {noLongDash(game.name)}</span>
      ) : null}
    </a>
  );
}
