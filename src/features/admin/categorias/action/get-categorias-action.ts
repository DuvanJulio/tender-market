import axios from "axios"
import type {
  IGetCategoriasResponse,
  TFetchCategoriasParams,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_CATEGORIAS_ENDPOINT = "/api/catalogo/categorias"

function buildQueryString(params: TFetchCategoriasParams) {
  const search = new URLSearchParams()
  search.set("page", String(params.page))
  search.set("pageSize", String(params.pageSize))
  if (params.search?.trim()) search.set("search", params.search.trim())
  return search.toString()
}

export async function apiGetCategoriasAction(
  params: TFetchCategoriasParams
): Promise<IGetCategoriasResponse> {
  try {
    const res = await apiClient.get<IGetCategoriasResponse>(
      `${GET_CATEGORIAS_ENDPOINT}?${buildQueryString(params)}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar las categorías" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar las categorías",
      }
    }
    return { success: false, message: "No se pudieron cargar las categorías" }
  }
}
