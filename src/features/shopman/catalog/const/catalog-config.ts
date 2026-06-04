import type {
  ICatalogoCategoriaApi,
  ICatalogoProductoApi,
  TCatalogBadge,
  TCatalogCategory,
  TCatalogData,
  TCatalogProduct,
} from "../interfaces"

export const CATALOG_SORT_OPTIONS = [
  "Mas populares",
  "Precio: menor a mayor",
  "Precio: mayor a menor",
  "Nuevos",
] as const

export const CATALOG_BADGE_STYLES = {
  sale: "bg-red-500 text-white",
  hot: "bg-orange-500 text-white",
  new: "bg-emerald-600 text-white",
} as const

const NEW_PRODUCT_DAYS = 14

type TCatalogoApiData = {
  categorias: ICatalogoCategoriaApi[]
  productos: ICatalogoProductoApi[]
  total_productos: number
  total_publicados: number
}

export function mapCatalogoFromApi(data: TCatalogoApiData): TCatalogData {
  const categories: TCatalogCategory[] = [
    {
      id: "all",
      label: "Todos",
      count: data.total_publicados,
    },
    ...data.categorias.map((cat) => ({
      id: String(cat.id),
      label: cat.nombre,
      count: cat.productos_count,
    })),
  ]

  const now = Date.now()

  const products: TCatalogProduct[] = data.productos.map((producto) => {
    const createdAt = new Date(producto.created_at).getTime()
    const daysSinceCreated = (now - createdAt) / (1000 * 60 * 60 * 24)
    const badges: TCatalogBadge[] = []

    if (daysSinceCreated <= NEW_PRODUCT_DAYS) {
      badges.push({ label: "Nuevo", tone: "new" })
    }
    if (producto.stock > 0 && producto.stock <= 10) {
      badges.push({ label: "Poco stock", tone: "hot" })
    }

      return {
        id: String(producto.id),
        productoId: producto.id,
        proveedorId: producto.proveedor_id,
        name: producto.nombre,
      brand: producto.proveedor,
      category: producto.categoria ?? "Sin categoría",
      price: producto.precio,
      stock: producto.stock,
      imagen_url: producto.imagen_url,
      created_at: producto.created_at,
      badges: badges.length > 0 ? badges : undefined,
    }
  })

  return {
    categories,
    products,
    totalProductos: data.total_productos,
  }
}
