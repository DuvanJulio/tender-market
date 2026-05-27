import { AdminLayout } from "@/features/admin"

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
