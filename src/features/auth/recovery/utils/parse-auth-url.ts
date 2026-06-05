import type { TRecoveryTokens } from "../interfaces"

function parseHashParams(hash: string): Record<string, string> {
  const params = new URLSearchParams(hash.replace(/^#/, ""))
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}

export function parseRecoveryTokensFromUrl(): TRecoveryTokens | null {
  if (typeof window === "undefined") return null

  const searchParams = new URLSearchParams(window.location.search)
  const tokenHash = searchParams.get("token_hash") ?? undefined

  if (tokenHash) {
    return { token_hash: tokenHash }
  }

  const hashParams = parseHashParams(window.location.hash)
  const accessToken = hashParams.access_token
  const refreshToken = hashParams.refresh_token

  if (accessToken && refreshToken) {
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  return null
}

export function parseEmailVerificationFromUrl(): "success" | "invalid" | "pending" {
  if (typeof window === "undefined") return "pending"

  const searchParams = new URLSearchParams(window.location.search)
  const hashParams = parseHashParams(window.location.hash)
  const type = searchParams.get("type") ?? hashParams.type

  if (type === "signup" || type === "email") {
    const hasTokens = Boolean(
      hashParams.access_token ||
        searchParams.get("token_hash") ||
        searchParams.get("code")
    )
    return hasTokens ? "success" : "invalid"
  }

  if (hashParams.access_token || searchParams.get("token_hash")) {
    return "success"
  }

  return "pending"
}
