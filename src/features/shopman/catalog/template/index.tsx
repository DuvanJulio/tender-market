"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Bell,
  ChevronDown,
  Grid2X2,
  Heart,
  History,
  LayoutGrid,
  List,
  Package,
  Search,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react"

type CatalogBadgeTone = "sale" | "hot" | "new"

type CatalogBadge = {
  label: string
  tone: CatalogBadgeTone
}

type CatalogCategory = {
  id: string
  label: string
  count: number
  isActive?: boolean
}

type CatalogProduct = {
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
  badges?: CatalogBadge[]
}

type CatalogData = {
  categories: CatalogCategory[]
  products: CatalogProduct[]
}

type CatalogSortOption =
  | "Mas populares"
  | "Precio: menor a mayor"
  | "Precio: mayor a menor"
  | "Nuevos"

type CatalogViewMode = "grid" | "list"

const CATALOG_DATA: CatalogData = {
  categories: [
    { id: "all", label: "Todos", count: 150, isActive: true },
    { id: "alimentos", label: "Alimentos", count: 45 },
    { id: "bebidas", label: "Bebidas", count: 28 },
    { id: "lacteos", label: "Lacteos", count: 18 },
    { id: "limpieza", label: "Limpieza", count: 32 },
    { id: "cuidado-personal", label: "Cuidado Personal", count: 27 },
  ],
  products: [
    {
      id: "aceite-vegetal-1l",
      name: "Aceite Vegetal Premium 1L",
      brand: "Oleica",
      category: "Alimentos",
      rating: 4.5,
      reviews: 128,
      price: 8500,
      oldPrice: 9500,
      unitLabel: "por unidad",
      minOrderLabel: "Min: 6 unidades",
      stock: 150,
      badges: [
        { label: "-10%", tone: "sale" },
        { label: "Top ventas", tone: "hot" },
      ],
    },
    {
      id: "arroz-grano-largo-5kg",
      name: "Arroz Premium Grano Largo 5kg",
      brand: "Arrocera Nacional",
      category: "Alimentos",
      rating: 4.8,
      reviews: 256,
      price: 22000,
      unitLabel: "por bulto",
      minOrderLabel: "Min: 4 bultos",
      stock: 85,
      badges: [{ label: "Nuevo", tone: "new" }],
    },
    {
      id: "detergente-liquido-3l",
      name: "Detergente Liquido 3L",
      brand: "LimpiMax",
      category: "Limpieza",
      rating: 4.3,
      reviews: 89,
      price: 15000,
      oldPrice: 18000,
      unitLabel: "por galon",
      minOrderLabel: "Min: 3 galones",
      stock: 200,
      badges: [
        { label: "-17%", tone: "sale" },
        { label: "Top ventas", tone: "hot" },
      ],
    },
    {
      id: "azucar-refinada-2-5kg",
      name: "Azucar Refinada 2.5kg",
      brand: "Dulce Colombia",
      category: "Alimentos",
      rating: 4.6,
      reviews: 175,
      price: 9800,
      unitLabel: "por paquete",
      minOrderLabel: "Min: 8 paquetes",
      stock: 320,
    },
    {
      id: "jabon-tocador-pack-12",
      name: "Jabon de Tocador Pack x12",
      brand: "Suave Care",
      category: "Cuidado Personal",
      rating: 4.4,
      reviews: 62,
      price: 24000,
      oldPrice: 28000,
      unitLabel: "por pack",
      minOrderLabel: "Min: 2 packs",
      stock: 75,
      badges: [
        { label: "-14%", tone: "sale" },
        { label: "Nuevo", tone: "new" },
      ],
    },
    {
      id: "leche-entera-uht-1l-x6",
      name: "Leche Entera UHT 1L x6",
      brand: "Lacteos del Valle",
      category: "Lacteos",
      rating: 4.7,
      reviews: 203,
      price: 18500,
      unitLabel: "por six-pack",
      minOrderLabel: "Min: 4 six-packs",
      stock: 180,
      badges: [{ label: "Top ventas", tone: "hot" }],
    },
    {
      id: "papel-higienico-24",
      name: "Papel Higienico x24 Rollos",
      brand: "SuaveMax",
      category: "Limpieza",
      rating: 4.5,
      reviews: 147,
      price: 32000,
      oldPrice: 36000,
      unitLabel: "por paquete",
      minOrderLabel: "Min: 2 paquetes",
      stock: 95,
      badges: [{ label: "-11%", tone: "sale" }],
    },
    {
      id: "cafe-molido-500g",
      name: "Cafe Molido Premium 500g",
      brand: "Montana Dorada",
      category: "Bebidas",
      rating: 4.9,
      reviews: 312,
      price: 28000,
      unitLabel: "por bolsa",
      minOrderLabel: "Min: 6 bolsas",
      stock: 120,
      badges: [{ label: "Top ventas", tone: "hot" }],
    },
  ],
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

const badgeStyles: Record<CatalogBadgeTone, string> = {
  sale: "bg-red-500 text-white",
  hot: "bg-orange-500 text-white",
  new: "bg-emerald-600 text-white",
}

const navItems = [
  {
    id: "catalog",
    label: "Catalogo",
    icon: LayoutGrid,
    href: "/shopman/catalog",
    isActive: true,
  },
  {
    id: "cart",
    label: "Carrito",
    icon: ShoppingCart,
    badge: 3,
    href: "/shopman/cart",
  },
  {
    id: "orders",
    label: "Mis Pedidos",
    icon: Package,
    href: "/shopman/orders",
  },
  { id: "history", label: "Historial", icon: History, href: "/shopman/history" },
]

const sortOptions: CatalogSortOption[] = [
  "Mas populares",
  "Precio: menor a mayor",
  "Precio: mayor a menor",
  "Nuevos",
]

const normalizeText = (value: string) => value.toLowerCase()

export const CatalogoTemplate = () => {
  const { categories, products } = CATALOG_DATA
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<CatalogSortOption>(sortOptions[0])
  const [viewMode, setViewMode] = useState<CatalogViewMode>("grid")
  const [favorites, setFavorites] = useState<string[]>([])
  const [addedItems, setAddedItems] = useState<string[]>([])

  const categoryLookup = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, category) => {
        acc[category.id] = category.label
        return acc
      }, {}),
    [categories]
  )

  const activeCategoryLabel =
    activeCategory === "all" ? null : categoryLookup[activeCategory]

  const filteredProducts = useMemo(() => {
    const term = normalizeText(searchTerm.trim())

    return products.filter((product) => {
      const matchesCategory =
        !activeCategoryLabel || product.category === activeCategoryLabel
      const matchesSearch =
        !term ||
        [product.name, product.brand, product.category].some((value) =>
          normalizeText(value).includes(term)
        )

      return matchesCategory && matchesSearch
    })
  }, [products, activeCategoryLabel, searchTerm])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    if (sortOption === "Precio: menor a mayor") {
      sorted.sort((a, b) => a.price - b.price)
      return sorted
    }

    if (sortOption === "Precio: mayor a menor") {
      sorted.sort((a, b) => b.price - a.price)
      return sorted
    }

    if (sortOption === "Nuevos") {
      sorted.sort((a, b) => {
        const aIsNew = a.badges?.some((badge) => badge.label === "Nuevo")
        const bIsNew = b.badges?.some((badge) => badge.label === "Nuevo")
        if (aIsNew && !bIsNew) return -1
        if (!aIsNew && bIsNew) return 1
        return b.reviews - a.reviews
      })
      return sorted
    }

    sorted.sort((a, b) => b.reviews - a.reviews)
    return sorted
  }, [filteredProducts, sortOption])

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleCart = (id: string) => {
    setAddedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const hasResults = sortedProducts.length > 0

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">TenderMarket</span>
          </Link>

          <div className="flex flex-1 items-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar productos, marcas, categorias..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"
              aria-label="Notificaciones"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
                2
              </span>
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                JP
              </span>
              <div className="hidden text-left text-xs sm:block">
                <p className="font-medium text-foreground">Juan Perez</p>
                <p className="text-muted-foreground">Tienda Don Pepe</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="border-t border-border bg-background">
          <nav className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const className = `relative flex items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors ${
                item.isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
              const content = (
                <>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-1 rounded-full bg-orange-500 px-2 text-[11px] font-semibold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              )

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={className}
                    aria-current={item.isActive ? "page" : undefined}
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${className} cursor-not-allowed`}
                  aria-disabled
                >
                  {content}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Catalogo de Productos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Encuentra los mejores productos mayoristas para tu negocio
          </p>
        </div>

        <section className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                    category.id === activeCategory
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={category.id === activeCategory}
                >
                  <span>{category.label}</span>
                  <span
                    className={
                      category.id === activeCategory
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value as CatalogSortOption)
                  }
                  className="bg-transparent text-sm text-foreground focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="inline-flex rounded-lg border border-border bg-background p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                  aria-pressed={viewMode === "list"}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`mt-6 grid gap-6 ${
            viewMode === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {!hasResults ? (
            <div className="col-span-full rounded-2xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
              No hay resultados para los filtros actuales.
            </div>
          ) : null}
          {sortedProducts.map((product) => {
            const isFavorite = favorites.includes(product.id)
            const isAdded = addedItems.includes(product.id)

            return (
              <article
                key={product.id}
                className={`flex rounded-2xl border border-border bg-background p-4 shadow-sm ${
                  viewMode === "grid"
                    ? "h-full flex-col"
                    : "flex-col sm:flex-row"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center rounded-xl bg-muted/60 ${
                    viewMode === "grid"
                      ? "h-40"
                      : "h-32 w-full sm:h-32 sm:w-44"
                  }`}
                >
                  <div className="absolute left-3 top-3 flex flex-col gap-1">
                    {product.badges?.map((badge) => (
                      <span
                        key={badge.label}
                        className={`rounded-md px-2 py-1 text-[11px] font-semibold ${badgeStyles[badge.tone]}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(product.id)}
                    className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background ${
                      isFavorite ? "text-rose-500" : "text-muted-foreground"
                    }`}
                    aria-label="Guardar"
                    aria-pressed={isFavorite}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite ? "fill-rose-500" : ""
                      }`}
                    />
                  </button>
                  <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
                </div>

                <div
                  className={`flex flex-1 flex-col ${
                    viewMode === "grid" ? "mt-4" : "mt-4 sm:ml-6 sm:mt-0"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">
                    {product.brand} <span className="mx-1">&bull;</span> {product.category}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">
                      {product.rating.toFixed(1)}
                    </span>
                    <span>({product.reviews})</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    {product.oldPrice ? (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.oldPrice)}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{product.unitLabel}</p>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{product.minOrderLabel}</span>
                    <span className="font-semibold text-emerald-600">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleCart(product.id)}
                    aria-pressed={isAdded}
                    className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground ${
                      isAdded ? "bg-emerald-600" : "bg-primary"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isAdded ? "Agregado" : "Agregar al carrito"}
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default CatalogoTemplate
