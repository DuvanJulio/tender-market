"use client"

import { useEffect, useState } from "react"
import { checkEmailAction } from "../action/check-email-action"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type TEmailAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error"

export function useEmailAvailability(email: string) {
  const [status, setStatus] = useState<TEmailAvailabilityStatus>("idle")
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const normalized = email.trim().toLowerCase()

    if (!normalized || !EMAIL_REGEX.test(normalized)) {
      setStatus("idle")
      setMessage(null)
      return
    }

    setStatus("checking")
    setMessage(null)

    const timeoutId = window.setTimeout(async () => {
      const result = await checkEmailAction(normalized)

      if (!result.success) {
        setStatus("error")
        setMessage(result.message)
        return
      }

      if (result.data?.available) {
        setStatus("available")
        setMessage("Correo disponible")
        return
      }

      setStatus("unavailable")
      setMessage(result.message || "Este correo ya está registrado")
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [email])

  return { status, message }
}
