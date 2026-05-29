import axios from "axios"
import type { IGetUsuariosAdminResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_USUARIOS_ENDPOINT = "/api/admin/usuarios"

export async function apiGetUsuariosAction(): Promise<IGetUsuariosAdminResponse> {
  try {
    const res = await apiClient.get<IGetUsuariosAdminResponse>(
      GET_USUARIOS_ENDPOINT
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
