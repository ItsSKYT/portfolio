"use client";
/* eslint-disable @next/next/no-img-element -- remote Spotify/Discord CDN images on a static export */

import { STATUS_LABELS, activityImageUrl, formatTime, noLongDash, visibleActivities } from "@/lib/discord";
import { dayNote, useWarsawTime } from "@/lib/ui";
import { StatusBadge } from "../skyt/Primitives";
import { StatusMark } from "./DiscordCard";
import { useDiscord, useNow } from "./DiscordProvider";

/**
 * The hero's right column: what is true right now. Local time in Poland, Discord status,
 * the song or game in progress, the project being built and availability.
 */
export function HeroPanel({
  project,
  availability,
  discordHref,
}: {
  project: { name: string; href: string };
  availability: string;
  discordHref: string;
}) {
  const time = useWarsawTime();
  const { presence, loading } = useDiscord();
  const spotify = presence?.listening_to_spotify ? presence.spotify : null;
  const now = useNow(Boolean(spotify));
  const game = presence ? visibleActivities(presence.activities, presence.listening_to_spotify).find((a) => a.type === 0) : null;
  const total = spotify ? spotify.timestamps.end - spotify.timestamps.start : 0;
  const elapsed = spotify && now ? Math.min(total, Math.max(0, now - spotify.timestamps.start)) : 0;
  const gameArt = game ? activityImageUrl(game) : null;

  return (
    <aside className="hp" aria-label="Teraz">
      <div className="hp__head">
        <span>Teraz</span>
        <span className="hp__time">
          Polska{" "}
          <b>
            {time ? (
              <>
                {time.text.slice(0, 2)}
                <i className="hp__colon">:</i>
                {time.text.slice(3)}
              </>
            ) : (
              "--:--"
            )}
          </b>
        </span>
      </div>
      {time && <p className="hp__note">{dayNote(time.hour)}</p>}

      <a className="hp__row hp__discord" href={discordHref} target="_blank" rel="noopener noreferrer" data-cursor="Discord">
        <span className="hp__label">Discord</span>
        {presence ? (
          <span className="hp__status">
            <StatusMark status={presence.discord_status} size={8} />
            {STATUS_LABELS[presence.discord_status]}
          </span>
        ) : (
          <span className="hp__status hp__faint">{loading ? "Łączenie…" : "Niedostępny"}</span>
        )}
      </a>

      {spotify ? (
        <a key={spotify.track_id} className="hp__row hp__media dc-enter" href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noopener noreferrer">
          <span className="hp__art">{spotify.album_art_url && <img src={spotify.album_art_url} alt="" />}</span>
          <span className="hp__media-text">
            <span className="hp__label">Słucha</span>
            <span className="hp__title">{noLongDash(spotify.song)}</span>
            <span className="hp__sub">{noLongDash(spotify.artist)}</span>
            <span className="hp__bar" aria-label={`${formatTime(elapsed)} z ${formatTime(total)}`}>
              <span style={{ transform: `scaleX(${total ? elapsed / total : 0})` }} />
            </span>
          </span>
        </a>
      ) : game ? (
        <div className="hp__row hp__media dc-enter">
          <span className="hp__art">{gameArt && <img src={gameArt} alt="" />}</span>
          <span className="hp__media-text">
            <span className="hp__label">Gra w</span>
            <span className="hp__title">{noLongDash(game.name)}</span>
            {game.details && <span className="hp__sub">{noLongDash(game.details)}</span>}
          </span>
        </div>
      ) : null}

      <a className="hp__row" href={project.href} target="_blank" rel="noopener noreferrer">
        <span className="hp__label">Rozwijam</span>
        <span className="hp__value">
          {project.name} <span aria-hidden="true">↗</span>
        </span>
      </a>
      <div className="hp__row">
        <span className="hp__label">Dostępność</span>
        <StatusBadge status="live" className="hp__avail">
          {availability}
        </StatusBadge>
      </div>
    </aside>
  );
}
