"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store"
import { setAuthToken } from "@/lib/api-client"
import {
  clearSignInError,
  selectSignInView,
  signInUser,
  toggleShowPassword,
} from "@/store/auth/sign-in-slice"
import { SignInDecorativePanel, SignInFormPanel } from "../components"
import {
  DEFAULT_POST_SIGN_IN_ROUTE,
  ROLE_REDIRECT_ROUTES,
  signInSchema,
  type TSignInFormData,
} from "../const"
import type { TUserRole } from "../interfaces"

const SIGN_IN_DEFAULT_VALUES: TSignInFormData = {
  email: "",
  password: "",
  rememberMe: false,
}

function getRedirectPathByRole(rol?: string): string {
  if (rol && rol in ROLE_REDIRECT_ROUTES) {
    return ROLE_REDIRECT_ROUTES[rol as TUserRole]
  }
  return DEFAULT_POST_SIGN_IN_ROUTE
}

export function SignInTemplate() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const signInView = useAppSelector(selectSignInView)

  const form = useForm<TSignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: SIGN_IN_DEFAULT_VALUES,
  })

  const serverError = signInView.message ?? null

  const onSubmit = form.handleSubmit(async (data) => {
    dispatch(clearSignInError())
    const result = await dispatch(
      signInUser({ email: data.email, password: data.password })
    )

    if (signInUser.rejected.match(result)) return

    const payload = result.payload
    if (!payload?.success) return

    if (payload.data?.token) {
      setAuthToken(payload.data.token)
    }

    router.push(getRedirectPathByRole(payload.data?.rol))
  })

  return (
    <div className="flex min-h-screen">
      <SignInFormPanel
        form={form}
        showPassword={signInView.showPassword}
        serverError={serverError}
        onTogglePassword={() => dispatch(toggleShowPassword())}
        onSubmit={onSubmit}
      />
      <SignInDecorativePanel />
    </div>
  )
}

export default SignInTemplate
