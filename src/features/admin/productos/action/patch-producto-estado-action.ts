import axios from "axios"
import type {
  IPatchProductoEstadoResponse,
  TProductoEstado,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiPatchProductoEstadoAction(
  productoId: number,
  estado: Extract<TProductoEstado, "publicado" | "inactivo">
): Promise<IPatchProductoEstadoResponse> {
  try {
    const res = await apiClient.patch<IPatchProductoEstadoResponse>(
      `/api/catalogo/productos/${productoId}/estado`,
      { estado }
    )

    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudo actualizar el producto",
      }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo actualizar el producto",
      }
    }
    return { success: false, message: "No se pudo actualizar el producto" }
  }
}
