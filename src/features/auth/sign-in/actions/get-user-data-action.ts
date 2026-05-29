import axios from "axios"
import type { IGetUserDataResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_USER_DATA_ENDPOINT = "/api/auth/get-user-data"

export async function getUserDataAction(): Promise<IGetUserDataResponse> {
  try {
    const res = await apiClient.get<IGetUserDataResponse>(GET_USER_DATA_ENDPOINT)

    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudieron cargar los datos del usuario",
      }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar los datos del usuario",
      }
    }
    return {
      success: false,
      message: "No se pudieron cargar los datos del usuario",
    }
  }
}
