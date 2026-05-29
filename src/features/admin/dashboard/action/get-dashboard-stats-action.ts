import axios from "axios"
import type { IGetStatsResponse } from "@/features/landing/interfaces/get-stats-reponse"
import { apiClient } from "@/lib/api-client"

const GET_STATS_ENDPOINT = "/api/stats"

export async function apiGetDashboardStatsAction(): Promise<IGetStatsResponse> {
  try {
    const res = await apiClient.get<IGetStatsResponse>(GET_STATS_ENDPOINT)

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar las estadísticas" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar las estadísticas",
      }
    }
    return { success: false, message: "No se pudieron cargar las estadísticas" }
  }
}
