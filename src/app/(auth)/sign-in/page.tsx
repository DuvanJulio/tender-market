import { Suspense } from "react"
import { SignInTemplate } from "@/features/auth/sign-in"

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInTemplate />
    </Suspense>
  )
}
