import axios from "axios"
import type { IGetProductosAdminResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_PRODUCTOS_ENDPOINT = "/api/catalogo/productos"

export async function apiGetProductosAction(): Promise<IGetProductosAdminResponse> {
  try {
    const res = await apiClient.get<IGetProductosAdminResponse>(
      GET_PRODUCTOS_ENDPOINT
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar los productos" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar los productos",
      }
    }
    return { success: false, message: "No se pudieron cargar los productos" }
  }
}
