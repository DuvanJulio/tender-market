import { CheckCircle, Store } from "lucide-react"

const DECORATIVE_FEATURES = [
  "Acceso seguro y encriptado",
  "Historial de pedidos disponible",
  "Soporte personalizado 24/7",
] as const

export function SignInDecorativePanel() {
  return (
    <div className="relative hidden flex-1 lg:block">
      <div className="absolute inset-0 bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
        <div className="flex h-full flex-col items-center justify-center p-12">
          <div className="max-w-md text-center text-primary-foreground">
            <div className="mb-6 flex justify-center">
              <Store className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold">Bienvenido de vuelta</h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Accede a tu cuenta para gestionar tus pedidos, ver productos y hacer crecer tu negocio.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              {DECORATIVE_FEATURES.map((feature) => (
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
