import Link from "next/link";
import { Store, Truck, CheckCircle } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(45,120,180,0.15),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Plataforma B2B Lider en LATAM
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Conectamos <span className="text-primary">Tenderos</span> con{" "}
            <span className="text-accent">Proveedores</span> Mayoristas
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Simplifica tus compras al por mayor. Accede a miles de productos con los mejores precios,
            entregas rápidas y financiamiento flexible para hacer crecer tu negocio.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up?role=tendero"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl sm:w-auto"
            >
              <Store className="h-5 w-5" />
              Soy Tendero
            </Link>
            <Link
              href="/sign-up?role=proveedor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-accent bg-accent/5 px-6 py-3 text-base font-semibold text-accent-foreground transition-all hover:bg-accent hover:text-accent-foreground sm:w-auto"
            >
              <Truck className="h-5 w-5" />
              Soy Proveedor
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Sin costo de registro</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>+5,000 productos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Entregas en 24-48h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
