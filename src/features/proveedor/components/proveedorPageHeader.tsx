import type { ReactNode } from "react"

interface ProveedorPageHeaderProps {
  title: string
  description: string
  actions?: ReactNode
}

export function ProveedorPageHeader({
  title,
  description,
  actions,
}: ProveedorPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  )
}
