import type { TPaginatedList, TPaginationMeta } from "@/types/pagination"

export function paginateList<T>(
  items: T[],
  page: number,
  pageSize: number
): TPaginatedList<T> {
  const total = items.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize)
  const safePage = totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pagination: TPaginationMeta = {
    page: safePage,
    pageSize,
    total,
    totalPages,
  }

  return {
    items: items.slice(start, start + pageSize),
    pagination,
  }
}
