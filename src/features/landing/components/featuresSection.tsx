import { Package, TrendingUp, Truck, CreditCard, ShieldCheck, Headphones } from "lucide-react";


export const FeaturesSection = () => {
  return (

    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todo lo que necesitas para tu negocio
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Una plataforma completa que conecta a tenderos y proveedores de manera eficiente
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature Cards */}
          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">Catálogo Extenso</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Accede a más de 5,000 productos de diversas categorías: alimentos, bebidas, limpieza, cuidado personal y más.
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">Mejores Precios</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Precios mayoristas competitivos directamente de proveedores verificados. Ahorra hasta un 30% en tus compras.
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Truck className="h-6 w-6 text-success" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">Entrega Rápida</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Recibe tus pedidos en 24-48 horas con seguimiento en tiempo real y notificaciones de entrega.
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <CreditCard className="h-6 w-6 text-warning" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">Pago Flexible</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Múltiples opciones de pago: transferencia, contraentrega, o crédito disponible para clientes frecuentes.
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">Proveedores Verificados</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Todos nuestros proveedores pasan por un proceso de verificación para garantizar calidad y confiabilidad.
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Headphones className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">Soporte 24/7</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Equipo de soporte disponible por chat, WhatsApp o teléfono para ayudarte en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </section>

  );
}

export default FeaturesSection;
