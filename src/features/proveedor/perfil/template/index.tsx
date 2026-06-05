"use client"

import { AccountProfileView } from "@/features/account"
import { useAppSelector } from "@/store"
import { selectShopmanProfileView } from "@/store/shopman/user-slice"

export function ProveedorProfileTemplate() {
  const { status, message, profile } = useAppSelector(selectShopmanProfileView)

  return (
    <AccountProfileView
      profile={profile}
      status={status}
      message={message}
    />
  )
}

export default ProveedorProfileTemplate
