import type { IGetUserDataResponseData } from "@/features/auth/sign-in/interfaces"
import type { TUserRole } from "@/features/auth/sign-in/interfaces"

export type TUserProfile = {
  nombre: string
  apellido: string
  email: string
  telefono: string
  rol: TUserRole
  negocio: string
  telefonoNegocio: string
  nit: string | null
  nombreContacto: string | null
  direccion: string
  barrio: string
  ciudad: string
  initials: string
}

function buildInitials(displayName: string): string {
  const parts = displayName.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
  }
  return displayName.slice(0, 2).toUpperCase()
}

export function mapUserProfileFromApi(
  data: IGetUserDataResponseData
): TUserProfile | null {
  if (!data.isAuthenticated || !data.email || !data.rol) return null

  const displayName =
    data.nombre_completo?.trim() ||
    [data.nombre, data.apellido].filter(Boolean).join(" ").trim() ||
    data.email

  const defaultNegocio =
    data.rol === "proveedor" ? "Mi empresa" : "Mi tienda"

  return {
    nombre: data.nombre?.trim() || displayName,
    apellido: data.apellido?.trim() || "",
    email: data.email,
    telefono: data.telefono?.trim() || data.telefono_negocio?.trim() || "—",
    rol: data.rol,
    negocio: data.negocio?.trim() || defaultNegocio,
    telefonoNegocio: data.telefono_negocio?.trim() || "—",
    nit: data.nit?.trim() || null,
    nombreContacto: data.nombre_contacto?.trim() || null,
    direccion: data.direccion?.trim() || "—",
    barrio: data.barrio?.trim() || "—",
    ciudad: data.ciudad?.trim() || "—",
    initials: buildInitials(displayName),
  }
}
