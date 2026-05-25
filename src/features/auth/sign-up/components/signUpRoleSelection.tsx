import Link from "next/link"
import { ArrowRight, Store, TruckIcon } from "lucide-react"
import type { TSignUpRole } from "../interfaces"

interface SignUpRoleSelectionProps {
  onSelectRole: (rol: TSignUpRole) => void
}

export function SignUpRoleSelection({ onSelectRole }: SignUpRoleSelectionProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Crear cuenta
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {"Selecciona tu tipo de cuenta para comenzar"}
      </p>

      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={() => onSelectRole("tendero")}
          className="group flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-card-foreground">Soy Tendero</div>
            <div className="text-sm text-muted-foreground">
              Quiero comprar productos al por mayor
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
        </button>

        <button
          type="button"
          onClick={() => onSelectRole("proveedor")}
          className="group flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-4 text-left transition-all hover:border-accent hover:bg-accent/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
            <TruckIcon className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-card-foreground">Soy Proveedor</div>
            <div className="text-sm text-muted-foreground">
              Quiero vender mis productos a tenderos
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent" />
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {"¿Ya tienes cuenta?"}{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
