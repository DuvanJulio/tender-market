import axios from "axios"
import type { IGetProveedorDashboardResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

const ENDPOINT = "/api/proveedor/dashboard"

export async function apiGetProveedorDashboardAction(): Promise<IGetProveedorDashboardResponse> {
  try {
    const res = await apiClient.get<IGetProveedorDashboardResponse>(ENDPOINT)

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo cargar el dashboard" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo cargar el dashboard",
      }
    }
    return { success: false, message: "No se pudo cargar el dashboard" }
  }
}
