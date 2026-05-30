import axios from "axios"
import type {
  IGetProveedorProductosResponse,
  TFetchProveedorProductosParams,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const ENDPOINT = "/api/proveedor/productos"

function buildQueryString(params: TFetchProveedorProductosParams) {
  const search = new URLSearchParams()
  search.set("page", String(params.page))
  search.set("pageSize", String(params.pageSize))
  if (params.search?.trim()) search.set("search", params.search.trim())
  if (params.estado) search.set("estado", params.estado)
  if (params.bajo_stock) search.set("bajo_stock", "true")
  if (params.sin_stock) search.set("sin_stock", "true")
  return search.toString()
}

export async function apiGetProveedorProductosAction(
  params: TFetchProveedorProductosParams
): Promise<IGetProveedorProductosResponse> {
  try {
    const res = await apiClient.get<IGetProveedorProductosResponse>(
      `${ENDPOINT}?${buildQueryString(params)}`
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
