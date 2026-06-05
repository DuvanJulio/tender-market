"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, LogOut, User } from "lucide-react"
import { useAppDispatch } from "@/store"
import { setAuthToken } from "@/lib/api-client"
import { resetSessionState } from "@/store/reset-session-state"
import type { TUserProfile } from "../utils/map-user-profile"
import type { TStatus } from "@/types"

type AccountUserMenuProps = {
  status: TStatus
  profile: TUserProfile | null
  perfilHref: string
  notificacionesHref: string
  avatarClassName?: string
  showHeaderDetails?: boolean
}

export function AccountUserMenu({
  status,
  profile,
  perfilHref,
  notificacionesHref,
  avatarClassName = "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
  showHeaderDetails = true,
}: AccountUserMenuProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const fullName = profile
    ? [profile.nombre, profile.apellido].filter(Boolean).join(" ")
    : ""
  const name =
    status === "loading" ? "Cargando..." : fullName || profile?.email || "Usuario"
  const businessLabel =
    status === "loading" ? "" : (profile?.negocio ?? "")
  const email = profile?.email ?? ""
  const initials = profile?.initials ?? "··"

  const handleLogout = () => {
    setUserMenuOpen(false)
    setAuthToken(null)
    resetSessionState(dispatch)
    router.push("/sign-in")
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setUserMenuOpen((open) => !open)}
        className="flex items-center gap-3 rounded-md bg-background p-2 transition-colors hover:bg-muted/70"
        aria-expanded={userMenuOpen}
        aria-haspopup="menu"
        aria-busy={status === "loading"}
      >
        <span className={avatarClassName}>{initials}</span>
        {showHeaderDetails ? (
          <div className="hidden text-left text-xs sm:block">
            <p className="font-medium text-foreground">{name}</p>
            {businessLabel ? (
              <p className="text-muted-foreground">{businessLabel}</p>
            ) : null}
          </div>
        ) : null}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
              <p className="font-medium text-sm text-card-foreground">
                {fullName || name}
              </p>
              {email ? (
                <p className="text-sm text-muted-foreground">{email}</p>
              ) : null}
            </div>
            <div className="p-2">
              <Link
                href={perfilHref}
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Mi Perfil
              </Link>
              <Link
                href={notificacionesHref}
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                Notificaciones
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
