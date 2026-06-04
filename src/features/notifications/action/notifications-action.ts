import axios from "axios"
import type {
  IGetNotificacionesResponse,
  IPatchNotificacionLeidaResponse,
  TNotificacionesScope,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const ENDPOINTS: Record<TNotificacionesScope, string> = {
  tendero: "/api/tendero/notificaciones",
  proveedor: "/api/proveedor/notificaciones",
  admin: "/api/admin/notificaciones",
}

export async function apiGetNotificacionesAction(
  scope: TNotificacionesScope
): Promise<IGetNotificacionesResponse> {
  try {
    const res = await apiClient.get<IGetNotificacionesResponse>(
      ENDPOINTS[scope]
    )
    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar las notificaciones" }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar las notificaciones",
      }
    }
    return { success: false, message: "No se pudieron cargar las notificaciones" }
  }
}

export async function apiMarkNotificacionLeidaAction(
  scope: TNotificacionesScope,
  id: number
): Promise<IPatchNotificacionLeidaResponse> {
  try {
    const res = await apiClient.patch<IPatchNotificacionLeidaResponse>(
      `${ENDPOINTS[scope]}/${id}/leida`
    )
    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudo marcar la notificación",
      }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo marcar la notificación",
      }
    }
    return { success: false, message: "No se pudo marcar la notificación" }
  }
}

export async function apiMarkAllNotificacionesLeidasAction(
  scope: TNotificacionesScope
): Promise<IPatchNotificacionLeidaResponse> {
  try {
    const res = await apiClient.patch<IPatchNotificacionLeidaResponse>(
      ENDPOINTS[scope]
    )
    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudieron marcar las notificaciones",
      }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron marcar las notificaciones",
      }
    }
    return { success: false, message: "No se pudieron marcar las notificaciones" }
  }
}
