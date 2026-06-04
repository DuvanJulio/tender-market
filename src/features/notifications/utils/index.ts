export function formatNotificationTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "Hace un momento"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `Hace ${days} d`
}

export function getNotificationOrdersHref(
  scope: "tendero" | "proveedor" | "admin",
  tipo: string
) {
  if (scope === "admin") {
    if (tipo === "usuario_pendiente") return "/admin/usuarios?estado=pendiente"
    if (tipo === "producto_pendiente") return "/admin/productos"
    return "/admin/dashboard"
  }

  if (scope === "tendero") {
    if (tipo === "pedido_entregado" || tipo === "pedido_cancelado") {
      return "/shopman/history"
    }
    return "/shopman/orders"
  }
  return "/proveedor/pedidos"
}

export function getNotificationsFooterHref(scope: "tendero" | "proveedor" | "admin") {
  if (scope === "admin") return "/admin/dashboard"
  if (scope === "tendero") return "/shopman/orders"
  return "/proveedor/pedidos"
}

export function getNotificationsFooterLabel(scope: "tendero" | "proveedor" | "admin") {
  if (scope === "admin") return "Ir al panel"
  return "Ver pedidos"
}
