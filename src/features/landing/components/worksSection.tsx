import { Store, Truck } from "lucide-react";

export const WorksSection = () => {
    return (
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
                            <Truck className="h-6 w-6 text-accent" />
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
    );
}

export default WorksSection;