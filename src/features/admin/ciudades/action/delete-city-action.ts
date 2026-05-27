import axios from "axios"
import type { IDeleteCityResponse } from "@/features/masters/interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiDeleteCityAction(
  cityId: number
): Promise<IDeleteCityResponse> {
  try {
    const res = await apiClient.delete<IDeleteCityResponse>(
      `/api/masters/cities/${cityId}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo eliminar la ciudad" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo eliminar la ciudad",
      }
    }
    return { success: false, message: "No se pudo eliminar la ciudad" }
  }
}
