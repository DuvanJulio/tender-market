import axios from "axios"
import type { IPostCityResponse, TPostCityBody } from "@/features/masters/interfaces"
import { apiClient } from "@/lib/api-client"

const POST_CITY_ENDPOINT = "/api/masters/cities"

export async function apiPostCityAction(
  body: TPostCityBody
): Promise<IPostCityResponse> {
  try {
    const res = await apiClient.post<IPostCityResponse>(
      POST_CITY_ENDPOINT,
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo crear la ciudad" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message ?? "No se pudo crear la ciudad",
      }
    }
    return { success: false, message: "No se pudo crear la ciudad" }
  }
}
