import Link from "next/link";
import { Store, Clock } from "lucide-react";

export const FooterSection = () => {
    return (
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
                            <li><Link href="/sign-up?role=tendero" className="hover:text-foreground">Registrarse</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Ver Catálogo</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-card-foreground">Para Proveedores</h4>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/sign-up?role=proveedor" className="hover:text-foreground">Registrarse</Link></li>
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
    );
}

export default FooterSection;