import { CheckCircle, Store, TruckIcon } from "lucide-react"
import type { TSignUpRole } from "../interfaces"

interface SignUpDecorativePanelProps {
  role: TSignUpRole
}

const TENDERO_FEATURES = [
  "Registro 100% gratuito",
  "Miles de productos disponibles",
  "Soporte personalizado 24/7",
] as const

const PROVEEDOR_FEATURES = [
  "Registro 100% gratuito",
  "Panel de gestión completo",
  "Soporte personalizado 24/7",
] as const

export function SignUpDecorativePanel({ role }: SignUpDecorativePanelProps) {
  const isProveedor = role === "proveedor"
  const features = isProveedor ? PROVEEDOR_FEATURES : TENDERO_FEATURES

  return (
    <div className="relative hidden flex-1 lg:block">
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
        <div className="flex h-full flex-col items-center justify-center p-12">
          <div className="max-w-md text-center text-primary-foreground">
            <div className="mb-6 flex justify-center">
              {isProveedor ? (
                <TruckIcon className="h-16 w-16" />
              ) : (
                <Store className="h-16 w-16" />
              )}
            </div>
            <h2 className="text-3xl font-bold">
              {isProveedor
                ? "Llega a miles de tiendas"
                : "Los mejores productos mayoristas"}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              {isProveedor
                ? "Conecta con tenderos en todo el país y haz crecer tu negocio de distribución."
                : "Accede a precios mayoristas, entregas rápidas y las mejores marcas para tu tienda."}
            </p>
            <div className="mt-8 flex flex-col gap-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-lg bg-white/10 p-4"
                >
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
