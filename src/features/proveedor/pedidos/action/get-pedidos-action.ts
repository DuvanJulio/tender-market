import axios from "axios"
import type {
  IGetProveedorPedidosResponse,
  TFetchProveedorPedidosParams,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const ENDPOINT = "/api/proveedor/pedidos"

function buildQueryString(params: TFetchProveedorPedidosParams) {
  const search = new URLSearchParams()
  if (params.search?.trim()) search.set("search", params.search.trim())
  if (params.estado && params.estado !== "all") {
    search.set("estado", params.estado)
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function apiGetProveedorPedidosAction(
  params: TFetchProveedorPedidosParams = {}
): Promise<IGetProveedorPedidosResponse> {
  try {
    const res = await apiClient.get<IGetProveedorPedidosResponse>(
      `${ENDPOINT}${buildQueryString(params)}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar los pedidos" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudieron cargar los pedidos",
      }
    }
    return { success: false, message: "No se pudieron cargar los pedidos" }
  }
}
