"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { getAuthToken } from "@/lib/api-client"

export function AdminDemoBanner() {
  const [hasSession, setHasSession] = useState(true)

  useEffect(() => {
    setHasSession(Boolean(getAuthToken()))
  }, [])

  if (hasSession) return null

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Estás en modo demo: las notificaciones y otras APIs de admin requieren
          iniciar sesión con una cuenta administrador.
        </p>
      </div>
      <Link
        href="/sign-in"
        className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700"
      >
        Iniciar sesión
      </Link>
    </div>
  )
}
