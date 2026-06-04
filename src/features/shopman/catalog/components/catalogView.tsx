"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ChevronDown,
  Grid2X2,
  Heart,
  List,
  Loader2,
  Package,
  ShoppingCart,
} from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchCatalogo,
  selectShopmanCatalogView,
} from "@/store/shopman/catalog-slice"
import {
  addCartItem,
  hydrateCart,
  selectShopmanCartHydrated,
  selectShopmanCartItems,
} from "@/store/shopman/cart-slice"
import { useShopmanSearch } from "../../components/shopmanLayout"
import { formatShopmanCurrency } from "../../const"
import { CATALOG_BADGE_STYLES, CATALOG_SORT_OPTIONS } from "../const"
import type { TCatalogSortOption, TCatalogViewMode } from "../interfaces"

export function CatalogView() {
  const dispatch = useAppDispatch()
  const { searchTerm } = useShopmanSearch()
  const { status, message, catalog } = useAppSelector(selectShopmanCatalogView)
  const cartItems = useAppSelector(selectShopmanCartItems)
  const cartHydrated = useAppSelector(selectShopmanCartHydrated)
  const { categories, products } = catalog

  const [activeCategory, setActiveCategory] = useState("all")
  const [sortOption, setSortOption] = useState<TCatalogSortOption>(
    CATALOG_SORT_OPTIONS[0]
  )
  const [viewMode, setViewMode] = useState<TCatalogViewMode>("grid")
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (!cartHydrated) dispatch(hydrateCart())
  }, [cartHydrated, dispatch])

  const loadCatalogo = useCallback(
    (search: string, categoryId: string) => {
      dispatch(
        fetchCatalogo({
          search: search.trim() || undefined,
          categoria_id:
            categoryId === "all" ? undefined : Number(categoryId),
        })
      )
    },
    [dispatch]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCatalogo(searchTerm, activeCategory)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, activeCategory, loadCatalogo])

  const sortedProducts = useMemo(() => {
    const sorted = [...products]

    if (sortOption === "Precio: menor a mayor") {
      sorted.sort((a, b) => a.price - b.price)
      return sorted
    }

    if (sortOption === "Precio: mayor a menor") {
      sorted.sort((a, b) => b.price - a.price)
      return sorted
    }

    if (sortOption === "Nuevos") {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      return sorted
    }

    sorted.sort((a, b) => b.stock - a.stock)
    return sorted
  }, [products, sortOption])

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleAddToCart = (product: (typeof products)[number]) => {
    if (product.stock <= 0) return

    dispatch(
      addCartItem({
        productoId: product.productoId,
        proveedorId: product.proveedorId,
        id: product.id,
        name: product.name,
        brand: product.brand,
        unitPrice: product.price,
        stock: product.stock,
        imagen_url: product.imagen_url,
        quantity: 1,
      })
    )
    toast.success(`${product.name} agregado al carrito`)
  }

  const isLoading = status === "loading"
  const hasResults = sortedProducts.length > 0
  const cartProductIds = new Set(cartItems.map((item) => item.productoId))

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

      {status === "error" && message ? (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message}
        </div>
      ) : null}

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

      {isLoading ? (
        <div className="mt-12 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <section
          className={`mt-6 grid gap-6 ${
            viewMode === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {!hasResults ? (
            <div className="col-span-full rounded-2xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
              No hay productos publicados que coincidan con los filtros.
            </div>
          ) : null}
          {sortedProducts.map((product) => {
            const isFavorite = favorites.includes(product.id)
            const isAdded = cartProductIds.has(product.productoId)
            const outOfStock = product.stock <= 0

            return (
              <article
                key={product.id}
                className={`flex rounded-2xl border border-border bg-background p-4 shadow-sm ${
                  viewMode === "grid" ? "h-full flex-col" : "flex-col sm:flex-row"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-muted/60 ${
                    viewMode === "grid"
                      ? "h-40"
                      : "h-32 w-full sm:h-32 sm:w-44"
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
                  {product.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imagen_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-10 w-10 text-muted-foreground/40" />
                  )}
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

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-primary">
                      {formatShopmanCurrency(product.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      precio mayorista
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Proveedor: {product.brand}</span>
                    <span
                      className={`font-semibold ${
                        outOfStock ? "text-destructive" : "text-emerald-600"
                      }`}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={outOfStock}
                    aria-pressed={isAdded}
                    className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 ${
                      isAdded ? "bg-emerald-600" : "bg-primary"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {outOfStock
                      ? "Sin stock"
                      : isAdded
                        ? "Agregar más"
                        : "Agregar al carrito"}
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </>
  )
}
