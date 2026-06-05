"use client"

import { AccountNotificationsView } from "@/features/account"

export function ShopmanNotificationsTemplate() {
  return (
    <AccountNotificationsView
      scope="tendero"
      backHref="/shopman/catalog"
    />
  )
}

export default ShopmanNotificationsTemplate
