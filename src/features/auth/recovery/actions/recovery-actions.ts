import axios from "axios"
import { apiClient } from "@/lib/api-client"
import type {
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
} from "../interfaces"

export async function forgotPasswordAction(
  payload: IForgotPasswordRequest
): Promise<IForgotPasswordResponse> {
  try {
    const res = await apiClient.post<IForgotPasswordResponse>(
      "/api/auth/forgot-password",
      payload
    )
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo enviar el correo de recuperación",
      }
    }

    return {
      success: false,
      message: "Error de conexión. Intenta de nuevo.",
    }
  }
}

export async function resetPasswordAction(
  payload: IResetPasswordRequest
): Promise<IResetPasswordResponse> {
  try {
    const res = await apiClient.post<IResetPasswordResponse>(
      "/api/auth/reset-password",
      payload
    )
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo actualizar la contraseña",
      }
    }

    return {
      success: false,
      message: "Error de conexión. Intenta de nuevo.",
    }
  }
}
