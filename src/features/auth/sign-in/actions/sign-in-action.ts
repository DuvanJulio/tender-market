import axios from "axios"
import type { ISignInRequest, ISignInResponse } from "../interfaces"
import type { TSignInFormData } from "../const"
import { apiClient } from "@/lib/api-client"

const SIGN_IN_ENDPOINT = "/api/auth/sign-in"

export async function signInAction(
  data: Pick<TSignInFormData, "email" | "password">,
): Promise<ISignInResponse> {
  const payload: ISignInRequest = {
    email: data.email,
    password: data.password,
  }

  try {
    const res = await apiClient.post<ISignInResponse>(SIGN_IN_ENDPOINT, payload)

    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.data.message)
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "Error al iniciar sesión",
      }
    }
    return { success: false, message: "Error de conexión. Intenta de nuevo." }
  }
}
