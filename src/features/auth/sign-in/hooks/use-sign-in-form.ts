"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInAction } from "../action"
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

export function useSignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<TSignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: SIGN_IN_DEFAULT_VALUES,
  })

  const toggleShowPassword = () => setShowPassword((prev) => !prev)

  const onSubmit = async (data: TSignInFormData) => {
    setServerError(null)

    try {
      const response = await signInAction(data)

      if (!response.success) {
        setServerError(response.message)
        return
      }

      router.push(getRedirectPathByRole(response.data?.rol))
    } catch {
      setServerError("Error de conexión. Intenta de nuevo.")
    }
  }

  return {
    form,
    showPassword,
    serverError,
    toggleShowPassword,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
