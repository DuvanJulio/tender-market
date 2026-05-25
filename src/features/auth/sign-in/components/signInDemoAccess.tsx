"use client"

import { useRouter } from "next/navigation"
import { Store } from "lucide-react"

export function SignInDemoAccess() {
  const router = useRouter()

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Acceso rápido demo</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => router.push("/tendero/catalogo")}
          className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
        >
          <Store className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Tendero</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/proveedor/dashboard")}
          className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
        >
          <Store className="h-4 w-4 text-accent" />
          <span className="text-muted-foreground">Proveedor</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
        >
          <Store className="h-4 w-4 text-success" />
          <span className="text-muted-foreground">Admin</span>
        </button>
      </div>
    </div>
  )
}
