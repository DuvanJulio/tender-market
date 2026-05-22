"use client"

import { SignInDecorativePanel, SignInFormPanel } from "../components"
import { useSignInForm } from "../hooks"

export function SignInTemplate() {
  const { form, showPassword, serverError, toggleShowPassword, onSubmit } =
    useSignInForm()

  return (
    <div className="flex min-h-screen">
      <SignInFormPanel
        form={form}
        showPassword={showPassword}
        serverError={serverError}
        onTogglePassword={toggleShowPassword}
        onSubmit={onSubmit}
      />
      <SignInDecorativePanel />
    </div>
  )
}

export default SignInTemplate
