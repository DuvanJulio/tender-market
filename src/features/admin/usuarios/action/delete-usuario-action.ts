import axios from "axios"
import type { IDeleteUsuarioResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiDeleteUsuarioAction(
  usuarioId: string
): Promise<IDeleteUsuarioResponse> {
  try {
    const res = await apiClient.delete<IDeleteUsuarioResponse>(
      `/api/admin/usuarios/${usuarioId}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo eliminar el usuario" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo eliminar el usuario",
      }
    }
    return { success: false, message: "No se pudo eliminar el usuario" }
  }
}
