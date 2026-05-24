import axios from "axios"
import type { IGetCitiesResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_CITIES_ENDPOINT = "/api/masters/cities"

export async function apiGetCitiesAction(): Promise<IGetCitiesResponse> {
  try {
    const res = await apiClient.get<IGetCitiesResponse>(GET_CITIES_ENDPOINT)

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar las ciudades" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudieron cargar las ciudades",
      }
    }
    return { success: false, message: "No se pudieron cargar las ciudades" }
  }
}
