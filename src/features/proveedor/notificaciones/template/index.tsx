"use client"

import { AccountNotificationsView } from "@/features/account"

export function ProveedorNotificationsTemplate() {
  return (
    <AccountNotificationsView
      scope="proveedor"
      backHref="/proveedor/dashboard"
    />
  )
}

export default ProveedorNotificationsTemplate
