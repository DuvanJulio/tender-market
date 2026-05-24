import type { ISignInRequest, ISignInResponse } from "../interfaces";
import type { TSignInFormData } from "../const";
import axios from "axios";

const SIGN_IN_ENDPOINT = "/api/auth/sign-in";

export async function signInAction(
  data: Pick<TSignInFormData, "email" | "password">,
): Promise<ISignInResponse> {
  const payload: ISignInRequest = {
    email: data.email,
    password: data.password,
  };

  try {
    const res = await axios.post(SIGN_IN_ENDPOINT, payload);

    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.data.message);
    }

    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "Error al iniciar sesión",
      };
    }
    throw error;
  }
}
