import axios from "axios"
import type {
  IGetProductosAdminResponse,
  TFetchProductosParams,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_PRODUCTOS_ENDPOINT = "/api/catalogo/productos"

function buildQueryString(params: TFetchProductosParams) {
  const search = new URLSearchParams()
  search.set("page", String(params.page))
  search.set("pageSize", String(params.pageSize))
  if (params.search?.trim()) search.set("search", params.search.trim())
  if (params.estado) search.set("estado", params.estado)
  return search.toString()
}

export async function apiGetProductosAction(
  params: TFetchProductosParams
): Promise<IGetProductosAdminResponse> {
  try {
    const res = await apiClient.get<IGetProductosAdminResponse>(
      `${GET_PRODUCTOS_ENDPOINT}?${buildQueryString(params)}`
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
