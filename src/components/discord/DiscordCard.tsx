"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Globe, Monitor, Smartphone } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { useDiscordProfile } from "@/hooks/use-discord-profile";
import { useLanyard } from "@/hooks/use-lanyard";
import { DISCORD_USER_ID, getBadgeIconUrl, getBannerUrl, getNameplateStaticUrl } from "@/lib/discord-profile";
import {
  STATUS_LABELS,
  activityLabel,
  getActivityImageUrl,
  getAvatarUrl,
  getCustomStatus,
  getDecorationUrl,
  getDisplayName,
  getVisibleActivities,
  noLongDash,
  type DiscordStatus,
  type LanyardActivity,
} from "@/lib/lanyard";
import { DUR, EASE_OUT } from "../fx/hooks";
import { DiscordBio } from "./DiscordBio";

const PROFILE_URL = `https://discord.com/users/${DISCORD_USER_ID}`;
/** Monochromatyczne zdjęcia: wszystko z Discorda/Spotify w skali szarości */
const MONO = "grayscale contrast-[1.1]";

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/** Status jako monochromatyczny kształt (jak w Discordzie, ale bez kolorów): pełne koło, półksiężyc, minus, pierścień. */
export function StatusMark({ status, size = 8, ring }: { status: DiscordStatus | null; size?: number; ring?: boolean }) {
  const s = { width: size, height: size };
  const ringCls = ring ? "ring-[3px] ring-black" : "";
  if (status === "online")
    return (
      <span className="relative inline-flex shrink-0" style={s} aria-hidden>
        <span className="absolute inset-0 rounded-full bg-white opacity-50 motion-safe:animate-ping" />
        <span className={`relative inline-flex h-full w-full rounded-full bg-white ${ringCls}`} />
      </span>
    );
  if (status === "idle")
    return (
      <span className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-white ${ringCls}`} style={s} aria-hidden>
        <span className="absolute -left-[12%] -top-[12%] h-[62%] w-[62%] rounded-full bg-black" />
      </span>
    );
  if (status === "dnd")
    return (
      <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-white ${ringCls}`} style={s} aria-hidden>
        <span className="h-[22%] w-[58%] rounded-full bg-black" />
      </span>
    );
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border border-white/60 bg-black ${ring ? "ring-[3px] ring-black" : ""}`}
      style={s}
      aria-hidden
    />
  );
}

/** Zegar odświeżany co 500 ms, tylko gdy coś gra (pasek postępu Spotify). */
function useNow(active: boolean) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 500);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [active]);
  return now;
}

const fmt = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-t border-white/15 px-5 py-5 sm:px-7 sm:py-6 ${className}`}>{children}</div>;
}

function ProfileLink() {
  return (
    <a
      href={PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Discord"
      className="group relative flex items-center justify-between overflow-hidden border-t border-white/15 px-5 py-5 text-[0.9375rem] font-medium focus-visible:outline-offset-[-1px] sm:px-7"
    >
      <span className="fill-wipe absolute inset-0 bg-white" aria-hidden />
      <span className="relative transition-colors duration-500 ease-out-soft group-hover:text-black">{site.personal.discordCta}</span>
      <span
        className="relative transition-[transform,color] duration-500 ease-out-soft group-hover:rotate-45 group-hover:text-black"
        aria-hidden
      >
        ↗
      </span>
    </a>
  );
}

function TopBar({ status, note }: { status: DiscordStatus | null; note?: string }) {
  return (
    <div className="t-label flex items-center justify-between gap-4 px-5 py-3.5 text-white/45 sm:px-7">
      <span>Discord / na żywo</span>
      <span className="flex items-center gap-2 text-white/70">
        <StatusMark status={status} size={7} />
        {note ?? (status ? STATUS_LABELS[status] : "")}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Ładowanie statusu Discord">
      <TopBar status={null} note="Łączenie" />
      <div className="h-28 animate-pulse border-y border-white/15 bg-white/[0.04] sm:h-32" />
      <div className="px-5 pb-6 sm:px-7">
        <div className="-mt-11 h-[88px] w-[88px] animate-pulse rounded-full border-[5px] border-black bg-white/[0.08]" />
        <div className="mt-5 h-6 w-40 animate-pulse bg-white/[0.08]" />
        <div className="mt-2.5 h-3 w-24 animate-pulse bg-white/[0.06]" />
        <div className="mt-6 h-3 w-full max-w-xs animate-pulse bg-white/[0.06]" />
        <div className="mt-2 h-3 w-2/3 max-w-[14rem] animate-pulse bg-white/[0.06]" />
      </div>
      <Row>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 animate-pulse bg-white/[0.08]" />
            <div className="h-3 w-1/3 animate-pulse bg-white/[0.06]" />
          </div>
        </div>
      </Row>
    </div>
  );
}

/** Gdy Lanyard nie odpowiada: statyczna wizytówka zamiast pustego pudełka. */
function Fallback() {
  return (
    <div>
      <TopBar status={null} note="Status niedostępny" />
      <div className="pattern-1 h-28 border-y border-white/15 sm:h-32" />
      <div className="px-5 pb-6 sm:px-7">
        <div className="-mt-11 grid h-[88px] w-[88px] place-items-center rounded-full border-[5px] border-black bg-white text-3xl font-semibold tracking-[-0.04em] text-black">
          {site.name.slice(0, 1)}
        </div>
        <p className="mt-5 text-[1.75rem] font-medium leading-none tracking-[-0.03em]">{site.name}</p>
        <p className="t-body mt-4 max-w-[34ch] text-white/55">
          Nie udało się teraz pobrać statusu. Profil na Discordzie działa normalnie.
        </p>
      </div>
    </div>
  );
}

function Activity({ activity }: { activity: LanyardActivity }) {
  const img = getActivityImageUrl(activity);
  return (
    <div className="flex items-start gap-4">
      <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden border border-white/15 text-white/60">
        {img ? <Image src={img} alt="" fill sizes="56px" className={`object-cover ${MONO}`} /> : <Gamepad2 size={18} strokeWidth={1.5} />}
      </div>
      <div className="min-w-0">
        <p className="t-label text-white/45">{activityLabel(activity.type)}</p>
        <p className="mt-1 truncate text-[1.0625rem] font-medium tracking-[-0.015em]">{noLongDash(activity.name)}</p>
        {activity.details && <p className="truncate text-sm text-white/55">{noLongDash(activity.details)}</p>}
        {activity.state && <p className="truncate text-sm text-white/45">{noLongDash(activity.state)}</p>}
      </div>
    </div>
  );
}

export function DiscordCard() {
  const { profile, loading: profileLoading } = useDiscordProfile();
  const { presence, loading: presenceLoading, refetch } = useLanyard();
  const spotify = presence?.listening_to_spotify ? presence.spotify : null;
  const now = useNow(Boolean(spotify));

  // koniec utworu: dociągnij nowy stan (maks. raz na 2 s)
  const lastEndFetch = useRef(0);
  useEffect(() => {
    if (!spotify || !now || now < spotify.timestamps.end) return;
    if (now - lastEndFetch.current > 2000) {
      lastEndFetch.current = now;
      refetch();
    }
  }, [now, spotify, refetch]);

  const state = presence ? "ready" : presenceLoading || profileLoading ? "loading" : "error";

  let body: React.ReactNode = null;
  if (state === "loading") body = <Skeleton />;
  else if (state === "error" || !presence) body = <Fallback />;
  else {
    const user = presence.discord_user;
    const displayName = noLongDash(getDisplayName(presence));
    const custom = getCustomStatus(presence.activities);
    const activities = getVisibleActivities(presence.activities, presence.listening_to_spotify);
    const nameplate = profile?.nameplate?.asset ?? user.collectibles?.nameplate?.asset;
    const devices = [
      presence.active_on_discord_desktop && { icon: Monitor, label: "Komputer" },
      presence.active_on_discord_mobile && { icon: Smartphone, label: "Telefon" },
      presence.active_on_discord_web && { icon: Globe, label: "Przeglądarka" },
    ].filter(Boolean) as { icon: typeof Monitor; label: string }[];
    const progress =
      spotify && now ? Math.min(100, Math.max(0, ((now - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)) : 0;

    body = (
      <div>
        <TopBar status={presence.discord_status} />

        {/* banner w skali szarości */}
        <div className="relative h-28 overflow-hidden border-y border-white/15 sm:h-32">
          {profile?.banner ? (
            <Image src={getBannerUrl(user.id, profile.banner, 600)} alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className={`object-cover opacity-80 ${MONO}`} />
          ) : (
            <div className="pattern-1 h-full w-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70" aria-hidden />
        </div>

        <div className="relative px-5 pb-6 sm:px-7">
          {/* nameplate: delikatne tło za nazwą */}
          {nameplate && (
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 bottom-0 top-10 bg-cover bg-right opacity-[0.18] ${MONO} [mask-image:linear-gradient(to_left,black,transparent_75%)]`}
              style={{ backgroundImage: `url(${getNameplateStaticUrl(nameplate)})` }}
            />
          )}

          <div className="relative -mt-11 w-fit">
            <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full border-[5px] border-black bg-black">
              <Image src={getAvatarUrl(user.id, user.avatar, 256)} alt={displayName} fill sizes="88px" className={`object-cover ${MONO}`} />
            </div>
            {user.avatar_decoration_data && (
              <Image
                src={getDecorationUrl(user.avatar_decoration_data.asset)}
                alt=""
                aria-hidden
                width={106}
                height={106}
                className={`pointer-events-none absolute -left-[9px] -top-[9px] h-[106px] w-[106px] max-w-none ${MONO}`}
              />
            )}
            <span className="absolute bottom-1.5 right-1.5 flex" title={STATUS_LABELS[presence.discord_status]}>
              <StatusMark status={presence.discord_status} size={16} ring />
            </span>
          </div>

          <div className="relative mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div className="min-w-0">
              <p className="truncate text-[1.75rem] font-medium leading-none tracking-[-0.03em]">{displayName}</p>
              <p className="mt-2 font-mono text-[12px] text-white/45">
                @{user.username}
                {profile?.pronouns ? ` / ${noLongDash(profile.pronouns)}` : ""}
              </p>
            </div>
            {profile?.badges && profile.badges.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Odznaki Discord">
                {profile.badges.map((badge) => (
                  <li key={badge.id} title={badge.description}>
                    <Image
                      src={getBadgeIconUrl(badge.icon)}
                      alt={badge.description}
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] opacity-60 grayscale transition-opacity duration-500 ease-out-soft hover:opacity-100"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {profile?.bio && <DiscordBio content={profile.bio} className="relative mt-5 text-[0.9375rem] leading-relaxed text-white/60" />}
        </div>

        {/* teraz: urządzenia + status własny */}
        <Row>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="t-label text-white/45">Teraz</p>
            {devices.length > 0 ? (
              <ul className="t-label flex flex-wrap gap-x-4 gap-y-1 text-white/60">
                {devices.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-1.5">
                    <Icon size={13} strokeWidth={1.5} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="t-label text-white/35">{STATUS_LABELS[presence.discord_status]}</p>
            )}
          </div>
          {custom?.state && (
            <p className="mt-4 text-[1.0625rem] tracking-[-0.01em] text-white/85">
              {custom.emoji?.name && !custom.emoji.id && <span className="mr-2 grayscale">{custom.emoji.name}</span>}
              {noLongDash(custom.state)}
            </p>
          )}

          <AnimatePresence mode="wait" initial={false}>
            {spotify ? (
              <motion.a
                key={spotify.track_id}
                href={`https://open.spotify.com/track/${spotify.track_id}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: DUR.fast, ease: EASE_OUT }}
                className="group/sp mt-5 flex items-center gap-4"
                aria-label={`Słucha na Spotify: ${spotify.song}, ${spotify.artist}`}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-white/15">
                  {spotify.album_art_url && (
                    <Image src={spotify.album_art_url} alt={spotify.album} fill sizes="64px" className={`object-cover ${MONO}`} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="t-label flex items-center gap-1.5 text-white/45">
                    <SpotifyIcon className="h-3 w-3 text-white" />
                    Słucha na Spotify
                  </p>
                  <p className="mt-1 truncate text-[1.0625rem] font-medium tracking-[-0.015em] underline-offset-4 group-hover/sp:underline">
                    {noLongDash(spotify.song)}
                  </p>
                  <p className="truncate text-sm text-white/55">{noLongDash(spotify.artist)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="t-label w-9 tabular-nums !text-[10px] text-white/45">{fmt(now - spotify.timestamps.start)}</span>
                    <div className="relative h-px flex-1 bg-white/15">
                      <div className="absolute inset-y-0 left-0 bg-white transition-[width] duration-500 ease-linear" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="t-label w-9 text-right tabular-nums !text-[10px] text-white/45">
                      {fmt(spotify.timestamps.end - spotify.timestamps.start)}
                    </span>
                  </div>
                </div>
              </motion.a>
            ) : null}
          </AnimatePresence>

          {activities.length > 0 && (
            <div className="mt-5 space-y-4">
              {activities.map((a) => (
                <Activity key={a.id} activity={a} />
              ))}
            </div>
          )}

          {!spotify && activities.length === 0 && !custom?.state && (
            <p className="t-label mt-4 text-white/35">Brak aktywności w tej chwili</p>
          )}
        </Row>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border border-white/15 bg-black">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.fast, ease: EASE_OUT }}
        >
          {body}
        </motion.div>
      </AnimatePresence>
      <ProfileLink />
    </div>
  );
}
