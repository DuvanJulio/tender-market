"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { setAuthToken } from "@/lib/api-client"
import { PROVEEDOR_MOCK_PROFILE } from "../const"

export function ProveedorUserMenu() {
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { initials, nombre, email } = PROVEEDOR_MOCK_PROFILE

  const handleLogout = () => {
    setUserMenuOpen(false)
    setAuthToken(null)
    router.push("/sign-in")
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setUserMenuOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
        aria-expanded={userMenuOpen}
        aria-haspopup="menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-medium text-accent">
          {initials}
        </div>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
      </button>

      {userMenuOpen ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setUserMenuOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-border bg-card shadow-lg"
          >
            <div className="border-b border-border p-4">
              <p className="font-medium text-card-foreground">{nombre}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="p-2">
              <Link
                href="/proveedor/perfil"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Mi Perfil
              </Link>
              <Link
                href="/proveedor/configuracion"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Link>
              <hr className="my-2 border-border" />
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
