'use client';

import { useAppSelector } from "@/store"
import { selectGetStats } from "@/store/landing/landing-slice"

export const StatsSection = () => {

    const stats = useAppSelector(selectGetStats);
    return (
        <section className="border-y border-border bg-muted/30 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">
                            {stats.data?.tenderos_activos}+
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">Tenderos Activos</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">
                            {stats.data?.proveedores_activos}+
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">Proveedores</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">
                            {stats.data?.pedidos_mensuales ?? 0}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">Pedidos Mensuales</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary sm:text-4xl">
                            {stats.data?.productos_total ?? 0}+
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">Productos</div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default StatsSection;