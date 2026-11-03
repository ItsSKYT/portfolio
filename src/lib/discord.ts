// Discord presence (Lanyard) and public profile (dcdn.dstn.to): types and URL helpers.

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type LanyardActivity = {
  id: string;
  name: string;
  type: number;
  state?: string | null;
  details?: string | null;
  application_id?: string;
  emoji?: { id?: string; name: string; animated?: boolean } | null;
  assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string } | null;
};

export type LanyardSpotify = {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: { start: number; end: number };
};

export type LanyardPresence = {
  discord_user: {
    id: string;
    username: string;
    global_name: string | null;
    display_name: string | null;
    avatar: string | null;
    avatar_decoration_data?: { asset: string } | null;
    collectibles?: { nameplate?: { asset: string; palette: string } } | null;
  };
  discord_status: DiscordStatus;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
};

export type DiscordBadge = { id: string; description: string; icon: string; link?: string };

export type DiscordProfile = {
  bio: string | null;
  pronouns: string | null;
  banner: string | null;
  badges: DiscordBadge[];
  nameplate: { asset: string; palette: string } | null;
};

export const STATUS_LABELS: Record<DiscordStatus, string> = {
  online: "Online",
  idle: "Zaraz wracam",
  dnd: "Nie przeszkadzać",
  offline: "Offline",
};

/** Label for a Discord activity type. */
export function activityLabel(type: number) {
  switch (type) {
    case 0:
      return "Gra w";
    case 1:
      return "Streamuje";
    case 2:
      return "Słucha";
    case 3:
      return "Ogląda";
    case 5:
      return "Rywalizuje w";
    default:
      return "Aktywność";
  }
}

/** Animated Discord assets (avatar, banner, decoration) have hashes starting with "a_". */
export const isAnimatedHash = (hash: string | null | undefined) => Boolean(hash?.startsWith("a_"));

export function avatarUrl(userId: string, avatar: string | null, size = 256) {
  if (!avatar) return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(userId) >> BigInt(22)) % 6}.png`;
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${isAnimatedHash(avatar) ? "gif" : "png"}?size=${size}`;
}

/** Animated decorations need passthrough=true to come back as APNG instead of a still frame. */
export const decorationUrl = (asset: string) =>
  `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=160&passthrough=${isAnimatedHash(asset)}`;

export const bannerUrl = (userId: string, hash: string, size = 600) =>
  `https://cdn.discordapp.com/banners/${userId}/${hash}.${isAnimatedHash(hash) ? "gif" : "png"}?size=${size}`;

export const badgeIconUrl = (icon: string) => `https://cdn.discordapp.com/badge-icons/${icon}.png`;

const collectiblePath = (asset: string) => `https://cdn.discordapp.com/assets/collectibles/${asset.replace(/\/$/, "")}`;
export const nameplateStillUrl = (asset: string) => `${collectiblePath(asset)}/static.png`;
export const nameplateVideoUrl = (asset: string) => `${collectiblePath(asset)}/asset.webm`;

/** Activity artwork: handles "mp:external/…", "spotify:…" and plain application asset ids. */
export function activityImageUrl(activity: LanyardActivity) {
  const img = activity.assets?.large_image;
  if (!img) return null;
  if (img.startsWith("mp:")) return `https://media.discordapp.net/${img.slice(3)}`;
  if (img.startsWith("spotify:")) return `https://i.scdn.co/image/${img.slice(8)}`;
  if (activity.application_id) return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  return null;
}

export const displayName = (p: LanyardPresence) => p.discord_user.display_name || p.discord_user.global_name || p.discord_user.username;

export const customStatus = (activities: LanyardActivity[]) => activities.find((a) => a.type === 4) ?? null;

/** Games and other activities, without the custom status and without Spotify when it is shown separately. */
export const visibleActivities = (activities: LanyardActivity[], listeningToSpotify: boolean) =>
  activities.filter((a) => a.type !== 4 && !(listeningToSpotify && a.type === 2 && a.name === "Spotify"));

/** The site avoids long dashes; live data gets a plain hyphen instead. */
export const noLongDash = (text: string) => text.replace(/\s*[\u2014\u2013]\s*/g, " - ");

export function formatTime(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
