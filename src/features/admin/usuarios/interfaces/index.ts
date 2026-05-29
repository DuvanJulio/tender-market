import type { TPaginationMeta, TPaginatedList } from "@/types/pagination"
import type { TUsuarioEstadoFilter, TUsuarioRolFilter } from "../const"

export type TUsuarioRol = "tendero" | "proveedor"

export type TUsuarioEstado = "activo" | "pendiente" | "inactivo"

export type TAdminUsuario = {
  id: string
  nombre: string
  nombre_pila: string
  apellido: string | null
  email: string | null
  telefono: string | null
  rol: TUsuarioRol
  negocio: string
  ciudad: string | null
  estado: TUsuarioEstado
  pedidos: number
  total_gastado: number
  fecha_registro: string
}

export type TAdminUsuarioDetalle = TAdminUsuario & {
  fecha_actualizacion: string
  ultimo_acceso: string | null
  nit: string | null
  nombre_tienda: string | null
  nombre_empresa: string | null
  nombre_contacto: string | null
  telefono_negocio: string | null
  direccion: string | null
  barrio: string | null
  departamento: string | null
}

export type TFetchUsuariosParams = {
  page: number
  pageSize: number
  search?: string
  rol?: Exclude<TUsuarioRolFilter, "all">
  estado?: Exclude<TUsuarioEstadoFilter, "all">
}

export type TPatchUsuarioBody = {
  nombre?: string
  apellido?: string
  telefono?: string
  negocio?: string
}

export type IGetUsuariosAdminResponse = {
  success: boolean
  message: string
  data?: TPaginatedList<TAdminUsuario>
}

export type IGetUsuarioDetalleResponse = {
  success: boolean
  message: string
  data?: TAdminUsuarioDetalle
}

export type IPatchUsuarioResponse = {
  success: boolean
  message: string
  data?: TAdminUsuario
}

export type IPatchUsuarioEstadoResponse = {
  success: boolean
  message: string
  data?: { id: string; estado: TUsuarioEstado }
}

export type IDeleteUsuarioResponse = {
  success: boolean
  message: string
  data?: { id: string }
}

export type { TPaginationMeta }
