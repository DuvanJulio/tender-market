import type { AppDispatch } from "@/store"
import { resetProveedorDashboard } from "@/store/proveedor/dashboard-slice"
import { resetProveedorPedidos } from "@/store/proveedor/pedidos-slice"
import { resetProveedorProductos } from "@/store/proveedor/productos-slice"
import { clearShopmanUser } from "@/store/shopman/user-slice"
import { resetNotifications } from "@/store/notifications-slice"

/** Limpia datos en caché del usuario anterior al cerrar sesión o iniciar con otra cuenta. */
export function resetSessionState(dispatch: AppDispatch) {
  dispatch(resetProveedorDashboard())
  dispatch(resetProveedorPedidos())
  dispatch(resetProveedorProductos())
  dispatch(clearShopmanUser())
  dispatch(resetNotifications())
}
