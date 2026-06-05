import axios from "axios"
import { apiClient } from "@/lib/api-client"
import type { ICheckEmailResponse } from "../interfaces/check-email"

const CHECK_EMAIL_ENDPOINT = "/api/auth/check-email"

export async function checkEmailAction(
  email: string
): Promise<ICheckEmailResponse> {
  try {
    const res = await apiClient.post<ICheckEmailResponse>(CHECK_EMAIL_ENDPOINT, {
      email,
    })
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo verificar el correo",
      }
    }

    return {
      success: false,
      message: "Error de conexión. Intenta de nuevo.",
    }
  }
}
