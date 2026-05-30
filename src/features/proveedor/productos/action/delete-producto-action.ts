import axios from "axios"
import type { IDeleteProveedorProductoResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiDeleteProveedorProductoAction(
  productoId: number
): Promise<IDeleteProveedorProductoResponse> {
  try {
    const res = await apiClient.delete<IDeleteProveedorProductoResponse>(
      `/api/proveedor/productos/${productoId}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo eliminar el producto" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo eliminar el producto",
      }
    }
    return { success: false, message: "No se pudo eliminar el producto" }
  }
}
