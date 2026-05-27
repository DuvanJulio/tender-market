import axios from "axios"
import type { IGetDepartmentsResponse } from "@/features/masters/interfaces"
import { apiClient } from "@/lib/api-client"

const GET_DEPARTMENTS_ENDPOINT = "/api/masters/departments"

export async function apiGetDepartmentsAction(): Promise<IGetDepartmentsResponse> {
  try {
    const res = await apiClient.get<IGetDepartmentsResponse>(
      GET_DEPARTMENTS_ENDPOINT
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar los departamentos" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar los departamentos",
      }
    }
    return { success: false, message: "No se pudieron cargar los departamentos" }
  }
}
