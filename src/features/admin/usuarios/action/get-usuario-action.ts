import axios from "axios"
import type { IGetUsuarioDetalleResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiGetUsuarioDetalleAction(
  usuarioId: string
): Promise<IGetUsuarioDetalleResponse> {
  try {
    const res = await apiClient.get<IGetUsuarioDetalleResponse>(
      `/api/admin/usuarios/${usuarioId}`
    )

    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudo cargar el detalle del usuario",
      }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo cargar el detalle del usuario",
      }
    }
    return {
      success: false,
      message: "No se pudo cargar el detalle del usuario",
    }
  }
}
