import axios from "axios"
import type {
  IPatchProveedorProductoResponse,
  TPatchProveedorProductoBody,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiPatchProveedorProductoAction(
  productoId: number,
  body: TPatchProveedorProductoBody
): Promise<IPatchProveedorProductoResponse> {
  try {
    const res = await apiClient.patch<IPatchProveedorProductoResponse>(
      `/api/proveedor/productos/${productoId}`,
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo actualizar el producto" }
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
