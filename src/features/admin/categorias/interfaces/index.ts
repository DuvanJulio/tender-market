import type { TPaginationMeta, TPaginatedList } from "@/types/pagination"

export type TCategoriaSub = {
  id: number
  nombre: string
  productos: number
}

export type TCategoria = {
  id: number
  nombre: string
  slug: string
  productos: number
  subcategorias: TCategoriaSub[]
  estado: boolean
}

export type TFetchCategoriasParams = {
  page: number
  pageSize: number
  search?: string
}

export type IGetCategoriasResponse = {
  success: boolean
  message: string
  data?: TPaginatedList<TCategoria>
}

export type TPostCategoriaBody = {
  nombre: string
  slug?: string
  categoria_padre_id?: number | null
}

export type IPostCategoriaResponse = {
  success: boolean
  message: string
  data?: {
    id: number
    nombre: string
    slug: string
    categoria_padre_id: number | null
    estado: boolean
  }
}

export type IDeleteCategoriaResponse = {
  success: boolean
  message: string
  data?: { id: number }
}

export type TDeleteCategoriaTarget = {
  id: number
  nombre: string
  esSubcategoria: boolean
}

export type { TPaginationMeta }
