interface SignInServerErrorProps {
  message: string
}

export function SignInServerError({ message }: SignInServerErrorProps) {
  return (
    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
      {message}
    </div>
  )
}
