import axios from "axios"
import type { IPatchUsuarioEstadoResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiPatchUsuarioEstadoAction(
  usuarioId: string,
  estado: "activo" | "inactivo"
): Promise<IPatchUsuarioEstadoResponse> {
  try {
    const res = await apiClient.patch<IPatchUsuarioEstadoResponse>(
      `/api/admin/usuarios/${usuarioId}/estado`,
      { estado }
    )

    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudo actualizar el estado",
      }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo actualizar el estado",
      }
    }
    return { success: false, message: "No se pudo actualizar el estado" }
  }
}
