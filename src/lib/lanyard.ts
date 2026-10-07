import { DISCORD_USER_ID } from "@/lib/discord-profile";

export { DISCORD_USER_ID };

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type LanyardActivity = {
  id: string;
  name: string;
  type: number;
  state?: string | null;
  details?: string | null;
  emoji?: {
    id?: string;
    name: string;
    animated?: boolean;
  } | null;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  } | null;
};

export type LanyardSpotify = {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: {
    start: number;
    end: number;
  };
};

export type LanyardPresence = {
  discord_user: {
    id: string;
    username: string;
    global_name: string | null;
    display_name: string | null;
    avatar: string | null;
    avatar_decoration_data?: {
      asset: string;
    } | null;
    display_name_styles?: {
      colors: number[];
      effect_id: number;
    } | null;
    collectibles?: {
      nameplate?: {
        asset: string;
        palette: string;
      };
    } | null;
  };
  discord_status: DiscordStatus;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
};

export const STATUS_LABELS: Record<DiscordStatus, string> = {
  online: "Online",
  idle: "Zaraz wracam",
  dnd: "Nie przeszkadzać",
  offline: "Offline",
};

/** Etykieta typu aktywności (Discord activity type) */
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

export function getAvatarUrl(userId: string, avatar: string | null, size = 128) {
  if (!avatar) {
    const index = Number(BigInt(userId) >> BigInt(22)) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${size}`;
}

export function getDecorationUrl(asset: string) {
  return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=160&passthrough=false`;
}

/** Obrazek aktywności (np. okładka gry). Obsługuje "mp:external/..." i zwykłe asset ID aplikacji. */
export function getActivityImageUrl(activity: LanyardActivity & { application_id?: string }) {
  const img = activity.assets?.large_image;
  if (!img) return null;
  if (img.startsWith("mp:")) return `https://media.discordapp.net/${img.slice(3)}`;
  if (img.startsWith("spotify:")) return `https://i.scdn.co/image/${img.slice(8)}`;
  if (activity.application_id) return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  return null;
}

export function getDisplayName(presence: LanyardPresence) {
  return presence.discord_user.display_name || presence.discord_user.global_name || presence.discord_user.username;
}

export function getCustomStatus(activities: LanyardActivity[]) {
  return activities.find((activity) => activity.type === 4) ?? null;
}

export function isSpotifyActivity(activity: LanyardActivity) {
  return activity.type === 2 && activity.name === "Spotify";
}

export function getVisibleActivities(activities: LanyardActivity[], listeningToSpotify = false) {
  return activities.filter((activity) => {
    if (activity.type === 4) return false;
    if (listeningToSpotify && isSpotifyActivity(activity)) return false;
    return true;
  });
}

/** Strona nie używa długich myślników: zamieniamy je w danych na żywo na zwykły łącznik. */
export function noLongDash(text: string) {
  return text.replace(/\s*[\u2014\u2013]\s*/g, " - ");
}
