import type { TUserRole } from "../interfaces"

export const ROLE_REDIRECT_ROUTES: Record<TUserRole, string> = {
  tendero: "/tendero/catalogo",
  proveedor: "/proveedor/dashboard",
  admin: "/admin/dashboard",
}

export const DEFAULT_POST_SIGN_IN_ROUTE = "/"
