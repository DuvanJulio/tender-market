"use client"

import type { TPaginationMeta } from "@/types/pagination"

interface AdminTablePaginationProps {
  pagination: TPaginationMeta
  itemLabel: string
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function AdminTablePagination({
  pagination,
  itemLabel,
  onPageChange,
  isLoading = false,
}: AdminTablePaginationProps) {
  const { page, pageSize, total, totalPages } = pagination
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const canGoPrev = page > 1 && !isLoading
  const canGoNext = page < totalPages && !isLoading

  return (
    <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total === 0
          ? `No hay ${itemLabel}`
          : `Mostrando ${from}–${to} de ${total} ${itemLabel}`}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="min-w-18 text-center text-sm text-muted-foreground">
          {totalPages === 0 ? "0 / 0" : `${page} / ${totalPages}`}
        </span>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
