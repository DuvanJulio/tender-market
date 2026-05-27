"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import type { IDepartmentOption } from "@/features/masters/interfaces"

interface DepartamentoSearchSelectProps {
  departments: IDepartmentOption[]
  value: number | null
  onChange: (departamentoId: number) => void
  disabled?: boolean
  loading?: boolean
  error?: string
}

export function DepartamentoSearchSelect({
  departments,
  value,
  onChange,
  disabled = false,
  loading = false,
  error,
}: DepartamentoSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = departments.find((d) => d.id === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return departments
    return departments.filter((d) => d.nombre.toLowerCase().includes(q))
  }, [departments, query])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    if (selected) {
      setQuery(selected.nombre)
    }
  }, [selected])

  const handleSelect = (department: IDepartmentOption) => {
    onChange(department.id)
    setQuery(department.nombre)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            if (!e.target.value.trim()) {
              onChange(0)
            }
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled || loading}
          placeholder={
            loading ? "Cargando departamentos..." : "Buscar departamento..."
          }
          className={`h-10 w-full rounded-lg border bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 disabled:opacity-50 ${
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive"
              : "border-input focus:border-primary focus:ring-primary"
          }`}
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {open && !disabled && !loading && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border bg-card py-1 shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No se encontraron departamentos
            </p>
          ) : (
            filtered.map((department) => (
              <button
                key={department.id}
                type="button"
                onClick={() => handleSelect(department)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
              >
                <span>{department.nombre}</span>
                {value === department.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
