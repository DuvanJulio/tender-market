import axios from "axios"
import type {
  IPatchUsuarioResponse,
  TPatchUsuarioBody,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiPatchUsuarioAction(
  usuarioId: string,
  body: TPatchUsuarioBody
): Promise<IPatchUsuarioResponse> {
  try {
    const res = await apiClient.patch<IPatchUsuarioResponse>(
      `/api/admin/usuarios/${usuarioId}`,
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo actualizar el usuario" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo actualizar el usuario",
      }
    }
    return { success: false, message: "No se pudo actualizar el usuario" }
  }
}
