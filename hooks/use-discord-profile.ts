"use client"

import { useEffect, useState } from "react"
import {
  DISCORD_USER_ID,
  type DiscordProfileData,
} from "@/lib/discord-profile"

export function useDiscordProfile(userId = DISCORD_USER_ID) {
  const [profile, setProfile] = useState<DiscordProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://dcdn.dstn.to/profile/${userId}`)
      .then((res) => res.json())
      .then((json) => {
        const user = json.user
        const userProfile = json.user_profile

        if (!user) {
          setLoading(false)
          return
        }

        setProfile({
          bio: userProfile?.bio ?? user.bio ?? null,
          pronouns: userProfile?.pronouns ?? null,
          banner: user.banner ?? userProfile?.banner ?? null,
          bannerColor: user.banner_color ?? null,
          themeColors: userProfile?.theme_colors ?? [],
          badges: (json.badges ?? []).map(
            (badge: {
              id: string
              description: string
              icon: string
              link?: string
            }) => ({
              id: badge.id,
              description: badge.description,
              icon: badge.icon,
              link: badge.link,
            }),
          ),
          nameplate: user.collectibles?.nameplate ?? null,
          profileEffectSku: userProfile?.profile_effect?.sku_id ?? null,
        })
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [userId])

  return { profile, loading }
}
