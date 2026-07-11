export const DISCORD_USER_ID = "490026522560823296"

export type DiscordBadge = {
  id: string
  description: string
  icon: string
  link?: string
}

export type DiscordProfileData = {
  bio: string | null
  pronouns: string | null
  banner: string | null
  bannerColor: string | null
  themeColors: number[]
  badges: DiscordBadge[]
  nameplate: {
    asset: string
    palette: string
  } | null
  profileEffectSku: string | null
}

export function getBannerUrl(userId: string, bannerHash: string, size = 600) {
  return `https://cdn.discordapp.com/banners/${userId}/${bannerHash}.png?size=${size}`
}

export function getBadgeIconUrl(iconHash: string) {
  return `https://cdn.discordapp.com/badge-icons/${iconHash}.png`
}

export function getNameplateStaticUrl(asset: string) {
  const path = asset.replace(/\/$/, "")
  return `https://cdn.discordapp.com/assets/collectibles/${path}/static.png`
}

export function getNameplateVideoUrl(asset: string) {
  const path = asset.replace(/\/$/, "")
  return `https://cdn.discordapp.com/assets/collectibles/${path}/asset.webm`
}

export function colorIntToHex(color: number) {
  return `#${color.toString(16).padStart(6, "0")}`
}
