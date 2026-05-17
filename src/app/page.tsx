"use client"

import Link from "next/link"
import { 
  Store, 
  TruckIcon, 
  ShieldCheck, 
  ArrowRight, 
  Package, 
  Users, 
  TrendingUp,
  CheckCircle,
  Star,
  Clock,
  CreditCard,
  Headphones
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TenderMarket</span>
          </Link>
          
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Beneficios
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {"Cómo Funciona"}
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Testimonios
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="hidden text-sm font-medium text-foreground transition-colors hover:text-primary sm:block"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/auth/register" 
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Registrarse
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
                href="/auth/register?role=tendero"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl sm:w-auto"
              >
                <Store className="h-5 w-5" />
                Soy Tendero
              </Link>
              <Link 
                href="/auth/register?role=proveedor"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-accent bg-accent/5 px-6 py-3 text-base font-semibold text-accent-foreground transition-all hover:bg-accent hover:text-accent-foreground sm:w-auto"
              >
                <TruckIcon className="h-5 w-5" />
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

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">10K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Tenderos Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">500+</div>
              <div className="mt-1 text-sm text-muted-foreground">Proveedores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">50K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Pedidos Mensuales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">98%</div>
              <div className="mt-1 text-sm text-muted-foreground">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
                <TruckIcon className="h-6 w-6 text-success" />
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

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {"¿Cómo funciona?"}
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Empieza a comprar o vender en solo 3 simples pasos
            </p>
          </div>

          <div className="mt-16">
            {/* Tenderos Flow */}
            <div className="mb-16">
              <div className="mb-8 flex items-center justify-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Para Tenderos</h3>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    1
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">Regístrate gratis</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Crea tu cuenta en minutos con tu información básica y datos de tu negocio.
                  </p>
                </div>
                <div className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    2
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">Explora el catálogo</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Navega por miles de productos, compara precios y agrega al carrito.
                  </p>
                </div>
                <div className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    3
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">Recibe tu pedido</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Confirma tu orden, realiza el pago y recibe en tu tienda en 24-48 horas.
                  </p>
                </div>
              </div>
            </div>

            {/* Proveedores Flow */}
            <div>
              <div className="mb-8 flex items-center justify-center gap-2">
                <TruckIcon className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-semibold text-foreground">Para Proveedores</h3>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                    1
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">Registra tu empresa</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Completa tu perfil empresarial y pasa nuestro proceso de verificación.
                  </p>
                </div>
                <div className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                    2
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">Sube tu catálogo</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Agrega tus productos con precios, inventario y fotos desde nuestro panel.
                  </p>
                </div>
                <div className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground">
                    3
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-foreground">Recibe pedidos</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Gestiona pedidos, coordina entregas y haz crecer tu negocio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

      {/* CTA Section */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {"¿Listo para hacer crecer tu negocio?"}
            </h2>
            <p className="mt-4 text-pretty text-lg text-primary-foreground/80">
              {"Únete a miles de tenderos y proveedores que ya están creciendo con TenderMarket"}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link 
                href="/auth/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary shadow-lg transition-all hover:bg-white/90 sm:w-auto"
              >
                Crear Cuenta Gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/auth/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary-foreground/30 px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10 sm:w-auto"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-card-foreground">TenderMarket</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                La plataforma B2B que conecta tenderos con proveedores mayoristas en toda LATAM.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-card-foreground">Para Tenderos</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/register?role=tendero" className="hover:text-foreground">Registrarse</Link></li>
                <li><Link href="#" className="hover:text-foreground">Ver Catálogo</Link></li>
                <li><Link href="#" className="hover:text-foreground">Preguntas Frecuentes</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-card-foreground">Para Proveedores</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/register?role=proveedor" className="hover:text-foreground">Registrarse</Link></li>
                <li><Link href="#" className="hover:text-foreground">Panel de Control</Link></li>
                <li><Link href="#" className="hover:text-foreground">{"Términos y Condiciones"}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-card-foreground">Contacto</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Lun - Vie: 8am - 6pm
                </li>
                <li><Link href="#" className="hover:text-foreground">soporte@tendermarket.co</Link></li>
                <li><Link href="#" className="hover:text-foreground">+57 300 123 4567</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              {"© 2024 TenderMarket. Todos los derechos reservados."}
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">Privacidad</Link>
              <Link href="#" className="hover:text-foreground">Términos</Link>
              <Link href="#" className="hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
