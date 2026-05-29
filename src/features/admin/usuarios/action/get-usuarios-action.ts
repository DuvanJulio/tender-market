import axios from "axios"
import type {
  IGetUsuariosAdminResponse,
  TFetchUsuariosParams,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_USUARIOS_ENDPOINT = "/api/admin/usuarios"

function buildQueryString(params: TFetchUsuariosParams) {
  const search = new URLSearchParams()
  search.set("page", String(params.page))
  search.set("pageSize", String(params.pageSize))
  if (params.search?.trim()) search.set("search", params.search.trim())
  if (params.rol) search.set("rol", params.rol)
  if (params.estado) search.set("estado", params.estado)
  return search.toString()
}

export async function apiGetUsuariosAction(
  params: TFetchUsuariosParams
): Promise<IGetUsuariosAdminResponse> {
  try {
    const res = await apiClient.get<IGetUsuariosAdminResponse>(
      `${GET_USUARIOS_ENDPOINT}?${buildQueryString(params)}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar los usuarios" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar los usuarios",
      }
    }
    return { success: false, message: "No se pudieron cargar los usuarios" }
  }
}
