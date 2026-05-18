
import { Star } from "lucide-react";


export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Miles de negocios ya confían en TenderMarket
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {"\"Desde que uso TenderMarket, mis compras son mucho más eficientes. Los precios son excelentes y la entrega siempre es puntual.\""}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                MR
              </div>
              <div>
                <div className="text-sm font-medium text-card-foreground">María Rodríguez</div>
                <div className="text-xs text-muted-foreground">{"Tienda Don Pepe, Bogotá"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {"\"Como proveedor, TenderMarket me ha permitido llegar a cientos de tiendas nuevas. El panel es muy fácil de usar y el soporte es excelente.\""}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                CL
              </div>
              <div>
                <div className="text-sm font-medium text-card-foreground">Carlos López</div>
                <div className="text-xs text-muted-foreground">{"Distribuidora El Sol, Medellín"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {"\"La opción de crédito me ha ayudado mucho con el flujo de caja. Ahora puedo comprar más inventario sin preocuparme por el pago inmediato.\""}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 font-semibold text-success">
                AG
              </div>
              <div>
                <div className="text-sm font-medium text-card-foreground">Ana García</div>
                <div className="text-xs text-muted-foreground">{"Mini Mercado La Esquina, Cali"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}

export default TestimonialsSection;