"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Menu, Truck, X } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { getAuthToken } from "@/lib/api-client"
import { PROVEEDOR_MOCK_PROFILE, PROVEEDOR_NAV_ITEMS } from "../const"
import { ProveedorUserMenu } from "./proveedorUserMenu"

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Nuevo pedido #5678",
    message: "Tienda Don Pepe realizó un pedido",
    time: "Hace 2 min",
    unread: true,
  },
  {
    id: 2,
    title: "Pedido confirmado",
    message: "El pedido #5677 fue confirmado",
    time: "Hace 30 min",
    unread: true,
  },
  {
    id: 3,
    title: "Stock bajo",
    message: "Aceite Vegetal Premium tiene poco stock",
    time: "Hace 1 hora",
    unread: false,
  },
]

interface ProveedorLayoutProps {
  children: ReactNode
}

export function ProveedorLayout({ children }: ProveedorLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/sign-in")
    }
  }, [router])

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

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length

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
            {item.badge ? (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
            {PROVEEDOR_MOCK_PROFILE.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {PROVEEDOR_MOCK_PROFILE.nombre}
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              {PROVEEDOR_MOCK_PROFILE.rol}
            </p>
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
                    {item.badge ? (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                        {item.badge}
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              {notificationsOpen ? (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card shadow-lg">
                    <div className="flex items-center justify-between border-b border-border p-4">
                      <h3 className="font-semibold text-card-foreground">
                        Notificaciones
                      </h3>
                      <Link
                        href="/proveedor/notificaciones"
                        className="text-xs text-primary hover:text-primary/80"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        Ver todas
                      </Link>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {MOCK_NOTIFICATIONS.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border-b border-border p-4 last:border-0 ${
                            notification.unread ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 h-2 w-2 rounded-full ${
                                notification.unread
                                  ? "bg-primary"
                                  : "bg-transparent"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-card-foreground">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <ProveedorUserMenu />
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
