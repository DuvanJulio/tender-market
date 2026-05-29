export function buildUserInitials(nombre?: string, email?: string): string {
  if (nombre?.trim()) {
    const parts = nombre.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
    }
    return nombre.trim().slice(0, 2).toUpperCase()
  }

  if (email?.trim()) {
    const local = email.split("@")[0] ?? email
    return local.slice(0, 2).toUpperCase()
  }

  return "?"
}

export function buildUserDisplayName(nombre?: string, email?: string): string {
  if (nombre?.trim()) return nombre.trim()
  if (email?.trim()) return email.trim()
  return "Usuario"
}

export function buildUserBusinessLabel(negocio?: string, rol?: string): string {
  if (negocio?.trim()) return negocio.trim()
  if (rol === "proveedor") return "Mi empresa"
  return "Mi tienda"
}
