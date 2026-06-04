import axios from "axios"
import type { IPatchCityResponse, TPatchCityBody } from "@/features/masters/interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiPatchCityAction(
  cityId: number,
  body: TPatchCityBody
): Promise<IPatchCityResponse> {
  try {
    const res = await apiClient.patch<IPatchCityResponse>(
      `/api/masters/cities/${cityId}`,
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo actualizar la ciudad" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo actualizar la ciudad",
      }
    }
    return { success: false, message: "No se pudo actualizar la ciudad" }
  }
}
