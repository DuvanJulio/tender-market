import axios from "axios"
import type {
  IGetCatalogoResponse,
  TFetchCatalogoParams,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const ENDPOINT = "/api/tendero/catalogo"

function buildQueryString(params: TFetchCatalogoParams) {
  const search = new URLSearchParams()
  if (params.search?.trim()) search.set("search", params.search.trim())
  if (params.categoria_id) {
    search.set("categoria_id", String(params.categoria_id))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function apiGetCatalogoAction(
  params: TFetchCatalogoParams = {}
): Promise<IGetCatalogoResponse> {
  try {
    const res = await apiClient.get<IGetCatalogoResponse>(
      `${ENDPOINT}${buildQueryString(params)}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo cargar el catálogo" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo cargar el catálogo",
      }
    }
    return { success: false, message: "No se pudo cargar el catálogo" }
  }
}
