"use client"

import { AccountUserMenu } from "@/features/account"
import { useAppSelector } from "@/store"
import { selectShopmanProfileView } from "@/store/shopman/user-slice"

export function ShopmanUserMenu() {
  const { status, profile } = useAppSelector(selectShopmanProfileView)

  return (
    <AccountUserMenu
      status={status}
      profile={profile}
      perfilHref="/shopman/perfil"
      notificacionesHref="/shopman/notificaciones"
    />
  )
}
