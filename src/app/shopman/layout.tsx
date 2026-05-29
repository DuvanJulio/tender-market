import { ShopmanLayout } from "@/features/shopman"

export default function ShopmanRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ShopmanLayout>{children}</ShopmanLayout>
}
