import axios from "axios"
import type {
  IPostProveedorProductoResponse,
  TPostProveedorProductoBody,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiPostProveedorProductoAction(
  body: TPostProveedorProductoBody
): Promise<IPostProveedorProductoResponse> {
  try {
    const res = await apiClient.post<IPostProveedorProductoResponse>(
      "/api/proveedor/productos",
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo crear el producto" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo crear el producto",
      }
    }
    return { success: false, message: "No se pudo crear el producto" }
  }
}
