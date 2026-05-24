"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store"
import { setAuthToken } from "@/lib/api-client"
import {
  clearRegisterError,
  registerUser,
  selectSignUpRegister,
  selectSignUpWizard,
  setStep,
  toggleShowConfirmPassword,
  toggleShowPassword,
} from "@/store/auth/sign-up-slice"
import { fetchCities, selectCities } from "@/store/masters/masters-slice"
import { SignUpDecorativePanel, SignUpFormPanel } from "../components"
import {
  getRedirectPathByRole,
  parseInitialRole,
  SIGN_UP_DEFAULT_VALUES,
  SIGN_UP_PERSONAL_FIELDS,
  signUpSchema,
  type TSignUpFormData,
} from "../const"
import type { TSignUpRole } from "../interfaces"

export function SignUpTemplate() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  const wizard = useAppSelector(selectSignUpWizard)
  const register = useAppSelector(selectSignUpRegister)
  const ciudadesState = useAppSelector(selectCities)

  const form = useForm<TSignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: SIGN_UP_DEFAULT_VALUES,
  })

  const selectedRole = form.watch("rol")
  const serverError = register.message ?? null
  const ciudadesLoading = ciudadesState.status === "loading"

  useEffect(() => {
    const initialRole = parseInitialRole(searchParams.get("role"))
    if (initialRole) {
      form.setValue("rol", initialRole)
      dispatch(setStep(2))
    }
    dispatch(fetchCities())
  }, [dispatch, form, searchParams])

  const handleSelectRole = (rol: TSignUpRole) => {
    form.setValue("rol", rol)
    dispatch(clearRegisterError())
    dispatch(setStep(2))
  }

  const handleGoToStep = (targetStep: 1 | 2 | 3) => {
    dispatch(clearRegisterError())
    dispatch(setStep(targetStep))
  }

  const onPersonalStepSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    dispatch(clearRegisterError())
    const isValid = await form.trigger([...SIGN_UP_PERSONAL_FIELDS])
    if (isValid) dispatch(setStep(3))
  }

  const onRegisterSubmit = form.handleSubmit(async (data) => {
    dispatch(clearRegisterError())
    const result = await dispatch(registerUser(data))

    if (registerUser.rejected.match(result)) return

    const payload = result.payload
    if (!payload?.success) return

    if (payload.data?.token) {
      setAuthToken(payload.data.token)
      router.push(getRedirectPathByRole(payload.data.rol))
      return
    }

    router.push("/sign-in?registered=1")
  })

  return (
    <div className="flex min-h-screen">
      <SignUpFormPanel
        form={form}
        step={wizard.step}
        selectedRole={selectedRole}
        showPassword={wizard.showPassword}
        showConfirmPassword={wizard.showConfirmPassword}
        serverError={serverError}
        ciudades={ciudadesState.items}
        ciudadesLoading={ciudadesLoading}
        onSelectRole={handleSelectRole}
        onGoToStep={handleGoToStep}
        onTogglePassword={() => dispatch(toggleShowPassword())}
        onToggleConfirmPassword={() => dispatch(toggleShowConfirmPassword())}
        onPersonalStepSubmit={onPersonalStepSubmit}
        onRegisterSubmit={onRegisterSubmit}
      />
      <SignUpDecorativePanel role={selectedRole} />
    </div>
  )
}

export default SignUpTemplate
