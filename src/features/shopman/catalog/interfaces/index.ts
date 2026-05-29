export type TCatalogBadgeTone = "sale" | "hot" | "new"

export type TCatalogBadge = {
  label: string
  tone: TCatalogBadgeTone
}

export type TCatalogCategory = {
  id: string
  label: string
  count: number
  isActive?: boolean
}

export type TCatalogProduct = {
  id: string
  name: string
  brand: string
  category: string
  rating: number
  reviews: number
  price: number
  oldPrice?: number
  unitLabel: string
  minOrderLabel: string
  stock: number
  badges?: TCatalogBadge[]
}

export type TCatalogData = {
  categories: TCatalogCategory[]
  products: TCatalogProduct[]
}

export type TCatalogSortOption =
  | "Mas populares"
  | "Precio: menor a mayor"
  | "Precio: mayor a menor"
  | "Nuevos"

export type TCatalogViewMode = "grid" | "list"
