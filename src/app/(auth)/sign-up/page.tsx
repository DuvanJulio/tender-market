import { Suspense } from "react"
import { SignUpTemplate } from "@/features/auth/sign-up"

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpTemplate />
    </Suspense>
  )
}
