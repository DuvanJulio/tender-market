"use client"

import { AccountUserMenu } from "@/features/account"
import { useAppSelector } from "@/store"
import { selectShopmanProfileView } from "@/store/shopman/user-slice"

export function ProveedorUserMenu() {
  const { status, profile } = useAppSelector(selectShopmanProfileView)

  return (
    <AccountUserMenu
      status={status}
      profile={profile}
      perfilHref="/proveedor/perfil"
      notificacionesHref="/proveedor/notificaciones"
      avatarClassName="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-medium text-accent"
      showHeaderDetails={false}
    />
  )
}
