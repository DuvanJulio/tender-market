export type TCategoriaSubcategoria = {
  id: number
  name: string
  products: number
}

export type TCategoria = {
  id: number
  name: string
  slug: string
  products: number
  subcategories: TCategoriaSubcategoria[]
  status: "active" | "inactive"
}

export const CATEGORIAS_MOCK: TCategoria[] = [
  {
    id: 1,
    name: "Alimentos",
    slug: "alimentos",
    products: 245,
    subcategories: [
      { id: 11, name: "Granos y Cereales", products: 45 },
      { id: 12, name: "Aceites y Grasas", products: 32 },
      { id: 13, name: "Azúcar y Endulzantes", products: 18 },
      { id: 14, name: "Enlatados", products: 56 },
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Bebidas",
    slug: "bebidas",
    products: 128,
    subcategories: [
      { id: 21, name: "Gaseosas", products: 28 },
      { id: 22, name: "Jugos", products: 35 },
      { id: 23, name: "Agua", products: 15 },
      { id: 24, name: "Café y Té", products: 50 },
    ],
    status: "active",
  },
  {
    id: 3,
    name: "Lácteos",
    slug: "lacteos",
    products: 89,
    subcategories: [
      { id: 31, name: "Leches", products: 25 },
      { id: 32, name: "Quesos", products: 34 },
      { id: 33, name: "Yogurt", products: 30 },
    ],
    status: "active",
  },
  {
    id: 4,
    name: "Limpieza",
    slug: "limpieza",
    products: 156,
    subcategories: [
      { id: 41, name: "Detergentes", products: 42 },
      { id: 42, name: "Desinfectantes", products: 38 },
      { id: 43, name: "Papel y Desechables", products: 56 },
    ],
    status: "active",
  },
  {
    id: 5,
    name: "Cuidado Personal",
    slug: "cuidado-personal",
    products: 112,
    subcategories: [
      { id: 51, name: "Jabones", products: 28 },
      { id: 52, name: "Shampoo", products: 32 },
      { id: 53, name: "Cremas", products: 25 },
      { id: 54, name: "Higiene Oral", products: 27 },
    ],
    status: "active",
  },
]
