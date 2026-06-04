export type TCatalogBadgeTone = "sale" | "hot" | "new"

export type TCatalogBadge = {
  label: string
  tone: TCatalogBadgeTone
}

export type TCatalogCategory = {
  id: string
  label: string
  count: number
}

export type TCatalogProduct = {
  id: string
  productoId: number
  proveedorId: number
  name: string
  brand: string
  category: string
  price: number
  stock: number
  imagen_url: string | null
  created_at: string
  badges?: TCatalogBadge[]
}

export type TCatalogData = {
  categories: TCatalogCategory[]
  products: TCatalogProduct[]
  totalProductos: number
}

export type TCatalogSortOption =
  | "Mas populares"
  | "Precio: menor a mayor"
  | "Precio: mayor a menor"
  | "Nuevos"

export type TCatalogViewMode = "grid" | "list"

export type ICatalogoCategoriaApi = {
  id: number
  nombre: string
  slug: string
  productos_count: number
}

export type ICatalogoProductoApi = {
  id: number
  nombre: string
  proveedor: string
  proveedor_id: number
  categoria: string | null
  categoria_id: number | null
  precio: number
  stock: number
  imagen_url: string | null
  created_at: string
}

export type IGetCatalogoResponse = {
  success: boolean
  message: string
  data?: {
    categorias: ICatalogoCategoriaApi[]
    productos: ICatalogoProductoApi[]
    total_productos: number
    total_publicados: number
  }
}

export type TFetchCatalogoParams = {
  search?: string
  categoria_id?: number
}
