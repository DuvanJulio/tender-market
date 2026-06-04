"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Search, Store } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { getAuthToken } from "@/lib/api-client"
import {
  fetchShopmanUser,
  selectShopmanProfileView,
} from "@/store/shopman/user-slice"
import {
  hydrateCart,
  selectShopmanCartTotalItems,
} from "@/store/shopman/cart-slice"
import { SHOPMAN_NAV_ITEMS } from "../const"
import { ShopmanUserMenu } from "./shopmanUserMenu"

type ShopmanSearchContextValue = {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

const ShopmanSearchContext = createContext<ShopmanSearchContextValue | null>(
  null
)

export function useShopmanSearch() {
  const context = useContext(ShopmanSearchContext)
  if (!context) {
    throw new Error("useShopmanSearch debe usarse dentro de ShopmanLayout")
  }
  return context
}

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface ShopmanLayoutProps {
  children: ReactNode
}

export function ShopmanLayout({ children }: ShopmanLayoutProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const profileView = useAppSelector(selectShopmanProfileView)
  const cartBadgeCount = useAppSelector(selectShopmanCartTotalItems)
  const [searchTerm, setSearchTerm] = useState("")
  const isCatalog = pathname.startsWith("/shopman/catalog")

  useEffect(() => {
    dispatch(hydrateCart())
  }, [dispatch])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/sign-in")
      return
    }

    if (profileView.status === "idle") {
      dispatch(fetchShopmanUser())
    }
  }, [dispatch, router, profileView.status])

  useEffect(() => {
    if (
      profileView.status === "error" &&
      !profileView.profile &&
      getAuthToken()
    ) {
      router.replace("/sign-in?session=expired")
    }
  }, [profileView.status, profileView.profile, router])

  const searchContext = useMemo(
    () => ({ searchTerm, setSearchTerm }),
    [searchTerm]
  )

  return (
    <ShopmanSearchContext.Provider value={searchContext}>
      <div className="min-h-screen bg-muted/40">
        <header className="sticky top-0 z-40 border-b border-border bg-background">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                TenderMarket
              </span>
            </Link>

            <div className="flex flex-1 items-center">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar productos, marcas, categorias..."
                  value={isCatalog ? searchTerm : undefined}
                  onChange={
                    isCatalog
                      ? (event) => setSearchTerm(event.target.value)
                      : undefined
                  }
                  readOnly={!isCatalog}
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
              </button>

              <ShopmanUserMenu />
            </div>
          </div>

          <nav className="border-t border-border bg-background">
            <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
              {SHOPMAN_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = isNavActive(pathname, item.href)
                const badge =
                  item.id === "cart" && cartBadgeCount > 0
                    ? cartBadgeCount
                    : undefined
                const className = `relative flex items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={className}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {badge ? (
                      <span className="ml-1 rounded-full bg-orange-500 px-2 text-[11px] font-semibold text-white">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </ShopmanSearchContext.Provider>
  )
}
