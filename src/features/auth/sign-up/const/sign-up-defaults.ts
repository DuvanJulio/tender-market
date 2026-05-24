import type { TSignUpFormData } from "./sign-up-schema"
import type { TSignUpRole } from "../interfaces"
import {
  DEFAULT_POST_SIGN_IN_ROUTE,
  ROLE_REDIRECT_ROUTES,
} from "@/features/auth/sign-in/const/role-routes"
import type { TUserRole } from "@/features/auth/sign-in/interfaces"

export const SIGN_UP_DEFAULT_VALUES: TSignUpFormData = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  password: "",
  confirmPassword: "",
  rol: "tendero",
  ciudad_id: 0,
  direccion: "",
  barrio: "",
  nombre_tienda: "",
  nit_tienda: "",
  nombre_empresa: "",
  nit_empresa: "",
  nombre_contacto: "",
  acceptTerms: false,
}

export function parseInitialRole(roleParam: string | null): TSignUpRole | null {
  if (roleParam === "tendero" || roleParam === "proveedor") {
    return roleParam
  }
  return null
}

export function getRedirectPathByRole(rol: TSignUpRole): string {
  if (rol in ROLE_REDIRECT_ROUTES) {
    return ROLE_REDIRECT_ROUTES[rol as TUserRole]
  }
  return DEFAULT_POST_SIGN_IN_ROUTE
}
