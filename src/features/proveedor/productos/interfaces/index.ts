import type { TPaginationMeta, TPaginatedList } from "@/types/pagination"
import type { TProductoEstadoFilter } from "../const"

export type TProductoEstado = "borrador" | "publicado" | "inactivo"

export type TProveedorProducto = {
  id: number
  nombre: string
  categoria_id: number
  categoria: string | null
  precio: number
  stock: number
  estado: TProductoEstado
  imagen_url: string | null
}

export type TProveedorProductosSummary = {
  total: number
  activos: number
  pendientes: number
  inactivos: number
  bajo_stock: number
}

export type TFetchProveedorProductosParams = {
  page: number
  pageSize: number
  search?: string
  estado?: Exclude<TProductoEstadoFilter, "all" | "low-stock" | "out-of-stock">
  bajo_stock?: boolean
  sin_stock?: boolean
}

export type TPostProveedorProductoBody = {
  nombre: string
  categoria_id: number
  precio_mayorista: number
  stock: number
  imagen_url?: string | null
}

export type TPatchProveedorProductoBody = {
  nombre?: string
  categoria_id?: number
  precio_mayorista?: number
  stock?: number
  imagen_url?: string | null
  estado?: "borrador" | "inactivo"
}

export type IGetProveedorProductosResponse = {
  success: boolean
  message: string
  data?: {
    productos: TPaginatedList<TProveedorProducto>
    summary: TProveedorProductosSummary
  }
}

export type IGetProveedorProductoResponse = {
  success: boolean
  message: string
  data?: TProveedorProducto
}

export type IPostProveedorProductoResponse = {
  success: boolean
  message: string
  data?: TProveedorProducto
}

export type IPatchProveedorProductoResponse = {
  success: boolean
  message: string
  data?: TProveedorProducto
}

export type IDeleteProveedorProductoResponse = {
  success: boolean
  message: string
  data?: { id: number }
}

export type { TPaginationMeta }
