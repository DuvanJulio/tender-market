import axios from "axios"
import type {
  IPatchProveedorPedidoEstadoResponse,
  TProveedorPedido,
} from "../interfaces"
import type { TProveedorPedidoStatus } from "../const"
import { apiClient } from "@/lib/api-client"

export async function apiPatchProveedorPedidoEstadoAction(
  codigo: string,
  estado: TProveedorPedidoStatus
): Promise<IPatchProveedorPedidoEstadoResponse> {
  try {
    const res = await apiClient.patch<IPatchProveedorPedidoEstadoResponse>(
      `/api/proveedor/pedidos/${encodeURIComponent(codigo)}/estado`,
      { estado }
    )

    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudo actualizar el pedido",
      }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo actualizar el pedido",
      }
    }
    return { success: false, message: "No se pudo actualizar el pedido" }
  }
}
