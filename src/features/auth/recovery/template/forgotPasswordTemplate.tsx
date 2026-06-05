"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInDecorativePanel } from "@/features/auth/sign-in/components/signInDecorativePanel"
import { ForgotPasswordForm } from "../components/forgotPasswordForm"
import { forgotPasswordSchema, type TForgotPasswordFormData } from "../const"
import { forgotPasswordAction } from "../actions/recovery-actions"

export function ForgotPasswordTemplate() {
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<TForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    setServerMessage(null)
    setIsSuccess(false)

    const result = await forgotPasswordAction({ email: data.email })

    setServerMessage(result.message)
    setIsSuccess(result.success)
  })

  return (
    <div className="flex min-h-screen">
      <ForgotPasswordForm
        form={form}
        serverMessage={serverMessage}
        isSuccess={isSuccess}
        onSubmit={onSubmit}
      />
      <SignInDecorativePanel />
    </div>
  )
}

export default ForgotPasswordTemplate
