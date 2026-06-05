"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInDecorativePanel } from "@/features/auth/sign-in/components/signInDecorativePanel"
import { ResetPasswordForm } from "../components/resetPasswordForm"
import { resetPasswordSchema, type TResetPasswordFormData } from "../const"
import { resetPasswordAction } from "../actions/recovery-actions"
import type { TRecoveryTokens } from "../interfaces"
import { parseRecoveryTokensFromUrl } from "../utils/parse-auth-url"

export function ResetPasswordTemplate() {
  const [tokens, setTokens] = useState<TRecoveryTokens | null>(null)
  const [tokenReady, setTokenReady] = useState(false)
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<TResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    const parsed = parseRecoveryTokensFromUrl()
    setTokens(parsed)
    setTokenReady(Boolean(parsed))
  }, [])

  const onSubmit = form.handleSubmit(async (data) => {
    if (!tokens) return

    setServerMessage(null)
    setIsSuccess(false)

    const result = await resetPasswordAction({
      password: data.password,
      ...tokens,
    })

    setServerMessage(result.message)
    setIsSuccess(result.success)
  })

  return (
    <div className="flex min-h-screen">
      <ResetPasswordForm
        form={form}
        serverMessage={serverMessage}
        isSuccess={isSuccess}
        tokenReady={tokenReady}
        onSubmit={onSubmit}
      />
      <SignInDecorativePanel />
    </div>
  )
}

export default ResetPasswordTemplate
