import type { TPaginationMeta, TPaginatedList } from "@/types/pagination"

export type TCategoriaSub = {
  id: number
  nombre: string
  slug: string
  productos: number
  estado: boolean
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

export type TEditCategoriaTarget = {
  id: number
  nombre: string
  slug: string
  estado: boolean
  esSubcategoria: boolean
}

export type TPatchCategoriaBody = {
  nombre?: string
  slug?: string
  estado?: boolean
}

export type IPatchCategoriaResponse = {
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

export type { TPaginationMeta }
