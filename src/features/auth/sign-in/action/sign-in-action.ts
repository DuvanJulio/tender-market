import type { ISignInRequest, ISignInResponse } from "../interfaces"
import type { TSignInFormData } from "../const"

const SIGN_IN_ENDPOINT = "/api/auth/sign-in"

export async function signInAction(
  data: Pick<TSignInFormData, "email" | "password">
): Promise<ISignInResponse> {
  const payload: ISignInRequest = {
    email: data.email,
    password: data.password,
  }

  const res = await fetch(SIGN_IN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const json: ISignInResponse = await res.json()
  return json
}
