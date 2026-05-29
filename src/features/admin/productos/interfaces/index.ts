import type { TPaginationMeta, TPaginatedList } from "@/types/pagination"
import type { TProductoEstadoFilter } from "../const"

export type TProductoEstado = "borrador" | "publicado" | "inactivo"

export type TAdminProducto = {
  id: number
  nombre: string
  proveedor: string | null
  categoria: string | null
  precio: number
  stock: number
  estado: TProductoEstado
  imagen_url: string | null
}

export type TAdminProductosSummary = {
  total: number
  activos: number
  pendientes: number
  rechazados: number
}

export type TFetchProductosParams = {
  page: number
  pageSize: number
  search?: string
  estado?: Exclude<TProductoEstadoFilter, "all">
}

export type IGetProductosAdminResponse = {
  success: boolean
  message: string
  data?: {
    productos: TPaginatedList<TAdminProducto>
    summary: TAdminProductosSummary
  }
}

export type IPatchProductoEstadoResponse = {
  success: boolean
  message: string
  data?: { id: number; estado: TProductoEstado }
}

export type IDeleteProductoResponse = {
  success: boolean
  message: string
  data?: { id: number }
}

export type { TPaginationMeta }
