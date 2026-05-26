import Link from "next/link";
import { ArrowRight } from "lucide-react";


export const CTASection = () => {
    return (
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
                            href="/sign-up"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary shadow-lg transition-all hover:bg-white/90 sm:w-auto"
                        >
                            Crear Cuenta Gratis
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/sign-in"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary-foreground/30 px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10 sm:w-auto"
                        >
                            Ya tengo cuenta
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTASection;