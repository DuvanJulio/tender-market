"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Truck, X } from "lucide-react"
import { NotificationsBell } from "@/features/notifications/components"
import { useEffect, useState, type ReactNode } from "react"
import { getAuthToken } from "@/lib/api-client"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchPendientesCount,
  selectProveedorPedidosPendientesCount,
} from "@/store/proveedor/pedidos-slice"
import {
  fetchShopmanUser,
  selectShopmanProfileView,
} from "@/store/shopman/user-slice"
import { PROVEEDOR_NAV_ITEMS } from "../const"
import { ProveedorUserMenu } from "./proveedorUserMenu"

const PEDIDOS_NAV_HREF = "/proveedor/pedidos"

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface ProveedorLayoutProps {
  children: ReactNode
}

export function ProveedorLayout({ children }: ProveedorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const pendientesCount = useAppSelector(selectProveedorPedidosPendientesCount)
  const profileView = useAppSelector(selectShopmanProfileView)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/sign-in")
      return
    }
    dispatch(fetchPendientesCount())
    if (profileView.status === "idle") {
      dispatch(fetchShopmanUser())
    }
  }, [router, dispatch, pathname, profileView.status])

  const pedidosNavBadge =
    pendientesCount > 0 ? pendientesCount : undefined

  const profile = profileView.profile
  const sidebarInitials = profile?.initials ?? "··"
  const sidebarName = profile?.negocio ?? profile?.nombre ?? "Proveedor"
  const sidebarRole = profile ? "Proveedor verificado" : "Cargando..."

  const activeNavItem = PROVEEDOR_NAV_ITEMS.find((item) =>
    isNavActive(pathname, item.href)
  )

  const navLinkClass = (href: string) => {
    const isActive = isNavActive(pathname, href)
    return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
    }`
  }

  const sidebarContent = (onNavigate?: () => void) => (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Truck className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">
          TenderMarket
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {PROVEEDOR_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={navLinkClass(item.href)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
            {item.href === PEDIDOS_NAV_HREF && pedidosNavBadge ? (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                {pedidosNavBadge > 9 ? "9+" : pedidosNavBadge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
            {sidebarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {sidebarName}
            </p>
            <p className="text-xs text-sidebar-foreground/60">{sidebarRole}</p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {sidebarContent()}
      </aside>

      {sidebarOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <Truck className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-sidebar-foreground">
                  TenderMarket
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-sidebar-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 p-4">
                {PROVEEDOR_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={navLinkClass(item.href)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.href === PEDIDOS_NAV_HREF && pedidosNavBadge ? (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                        {pedidosNavBadge > 9 ? "9+" : pedidosNavBadge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-foreground">
                {activeNavItem?.label ?? "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationsBell
              scope="proveedor"
              buttonClassName="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              iconClassName="h-5 w-5"
            />

            <ProveedorUserMenu />
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
