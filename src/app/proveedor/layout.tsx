import { ProveedorLayout } from "@/features/proveedor"

export default function ProveedorRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProveedorLayout>{children}</ProveedorLayout>
}
