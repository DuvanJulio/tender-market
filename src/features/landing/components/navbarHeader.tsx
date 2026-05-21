import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const NavbarHeader = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                        <img src="/Logo.svg" alt="TenderMarket" width={300} height={300} />
                    </div>
                    <span className="text-xl font-bold text-foreground"> <span className="text-primary">Tender</span><span className="text-accent">Market</span></span>
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
                        href="/sign-in"
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
    );
}

export default NavbarHeader;