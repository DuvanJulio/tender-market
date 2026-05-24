import { CheckCircle } from "lucide-react"
import type { TSignUpStep } from "../interfaces"

interface SignUpProgressStepsProps {
  step: TSignUpStep
}

export function SignUpProgressSteps({ step }: SignUpProgressStepsProps) {
  return (
    <div className="mt-8 flex items-center gap-2">
      {([1, 2, 3] as const).map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              s <= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s < step ? <CheckCircle className="h-5 w-5" /> : s}
          </div>
          {s < 3 && (
            <div
              className={`mx-2 h-0.5 w-8 transition-colors ${
                s < step ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
