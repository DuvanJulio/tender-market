import type { ReactNode } from "react"

interface AdminModalProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  children: ReactNode
  size?: "default" | "lg"
}

export function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  size = "default",
}: AdminModalProps) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        className={`fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg ${
          size === "lg" ? "max-h-[90vh] max-w-lg overflow-y-auto" : "max-w-md"
        }`}
      >
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {children}
      </div>
    </>
  )
}
