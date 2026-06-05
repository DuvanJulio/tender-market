interface SignInInfoBannerProps {
  message: string
}

export function SignInInfoBanner({ message }: SignInInfoBannerProps) {
  return (
    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
      {message}
    </div>
  )
}
