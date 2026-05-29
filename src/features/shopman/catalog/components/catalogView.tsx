"use client"

import { useMemo, useState } from "react"
import {
  ChevronDown,
  Grid2X2,
  Heart,
  List,
  ShoppingCart,
  Star,
} from "lucide-react"
import { useShopmanSearch } from "../../components/shopmanLayout"
import { formatShopmanCurrency } from "../../const"
import {
  CATALOG_BADGE_STYLES,
  CATALOG_MOCK,
  CATALOG_SORT_OPTIONS,
} from "../const"
import type { TCatalogSortOption, TCatalogViewMode } from "../interfaces"

const normalizeText = (value: string) => value.toLowerCase()

export function CatalogView() {
  const { searchTerm } = useShopmanSearch()
  const { categories, products } = CATALOG_MOCK
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortOption, setSortOption] = useState<TCatalogSortOption>(
    CATALOG_SORT_OPTIONS[0]
  )
  const [viewMode, setViewMode] = useState<TCatalogViewMode>("grid")
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
    <>
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
                  setSortOption(event.target.value as TCatalogSortOption)
                }
                className="bg-transparent text-sm text-foreground focus:outline-none"
              >
                {CATALOG_SORT_OPTIONS.map((option) => (
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
                viewMode === "grid" ? "h-full flex-col" : "flex-col sm:flex-row"
              }`}
            >
              <div
                className={`relative flex items-center justify-center rounded-xl bg-muted/60 ${
                  viewMode === "grid" ? "h-40" : "h-32 w-full sm:h-32 sm:w-44"
                }`}
              >
                <div className="absolute left-3 top-3 flex flex-col gap-1">
                  {product.badges?.map((badge) => (
                    <span
                      key={badge.label}
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold ${CATALOG_BADGE_STYLES[badge.tone]}`}
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
                    className={`h-4 w-4 ${isFavorite ? "fill-rose-500" : ""}`}
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
                  {product.brand}{" "}
                  <span className="mx-1">&bull;</span> {product.category}
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
                    {formatShopmanCurrency(product.price)}
                  </span>
                  {product.oldPrice ? (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatShopmanCurrency(product.oldPrice)}
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
    </>
  )
}
