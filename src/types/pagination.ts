export type TPaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type TPaginatedList<T> = {
  items: T[]
  pagination: TPaginationMeta
}

export const DEFAULT_PAGE_SIZE = 10
