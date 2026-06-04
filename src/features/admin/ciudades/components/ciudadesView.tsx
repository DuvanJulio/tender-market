"use client"

import { useMemo, useState } from "react"
import { MapPin, Plus, Search, Store, TruckIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  deleteCity,
  fetchCiudades,
  resetDeleteCity,
  selectCiudadesListView,
  selectDeleteCity,
  selectUpdateCity,
} from "@/store/admin/ciudades-slice"
import { AdminPageHeader } from "@/features/admin/components"
import type { TAdminCiudad } from "../interfaces"
import { CiudadesCreateModal } from "./ciudadesCreateModal"
import { CiudadesEditModal } from "./ciudadesEditModal"
import { DepartamentoCreateModal } from "./departamentoCreateModal"
import { CiudadCard } from "./ciudadCard"
import { CiudadDeleteAlertDialog } from "./ciudadDeleteAlertDialog"

type TStatusFilter = "all" | "active" | "inactive"

export function CiudadesView() {
  const dispatch = useAppDispatch()
  const { status, message, ciudades, summary } = useAppSelector(
    selectCiudadesListView
  )
  const deleteState = useAppSelector(selectDeleteCity)
  const updateState = useAppSelector(selectUpdateCity)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("all")
  const [showAddCityModal, setShowAddCityModal] = useState(false)
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false)
  const [preselectedDepartamentoId, setPreselectedDepartamentoId] = useState<
    number | null
  >(null)
  const [cityToDelete, setCityToDelete] = useState<TAdminCiudad | null>(null)
  const [cityToEdit, setCityToEdit] = useState<TAdminCiudad | null>(null)

  const filteredCities = useMemo(
    () =>
      ciudades.filter((city) => {
        const matchesSearch =
          city.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (city.departamento ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && city.estado) ||
          (statusFilter === "inactive" && !city.estado)
        return matchesSearch && matchesStatus
      }),
    [ciudades, searchQuery, statusFilter]
  )

  const filterButtonClass = (value: TStatusFilter) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      statusFilter === value
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground hover:text-foreground"
    }`

  const isLoading = status === "loading" || status === "idle"
  const isError = status === "error"
  const deleteError =
    deleteState.status === "error" ? deleteState.message : null

  const handleEditRequest = (city: TAdminCiudad) => {
    setCityToEdit(city)
  }

  const handleDeleteRequest = (city: TAdminCiudad) => {
    dispatch(resetDeleteCity())
    setCityToDelete(city)
  }

  const handleConfirmDelete = async () => {
    if (!cityToDelete) return

    const result = await dispatch(deleteCity(cityToDelete.id))

    if (deleteCity.fulfilled.match(result) && result.payload.success) {
      setCityToDelete(null)
      dispatch(fetchCiudades())
      return
    }

    if (deleteCity.fulfilled.match(result) && !result.payload.success) {
      setCityToDelete(null)
    }
  }

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (open || deleteState.status === "loading") return
    setCityToDelete(null)
    dispatch(resetDeleteCity())
  }

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader
        title="Ciudades"
        description="Gestiona las ciudades donde opera TenderMarket"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowAddDepartmentModal(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
              Nuevo Departamento
            </button>
            <button
              type="button"
              onClick={() => setShowAddCityModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Nueva Ciudad
            </button>
          </div>
        }
      />

      {isError && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message ?? "No se pudieron cargar las ciudades"}
        </div>
      )}

      {deleteError && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {deleteError}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {isLoading ? "—" : (summary?.ciudadesActivas ?? 0)}
              </p>
              <p className="text-sm text-muted-foreground">Ciudades activas</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Store className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {isLoading
                  ? "—"
                  : (summary?.tenderosActivos.toLocaleString() ?? "0")}
              </p>
              <p className="text-sm text-muted-foreground">Tenderos activos</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TruckIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {isLoading
                  ? "—"
                  : (summary?.proveedoresActivos.toLocaleString() ?? "0")}
              </p>
              <p className="text-sm text-muted-foreground">
                Proveedores activos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ciudad o departamento..."
            disabled={isLoading}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={filterButtonClass("all")}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={filterButtonClass("active")}
          >
            Activas
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("inactive")}
            className={filterButtonClass("inactive")}
          >
            Inactivas
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando ciudades...</p>
      ) : filteredCities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay ciudades que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCities.map((city) => (
            <CiudadCard
              key={city.id}
              city={city}
              isEditing={
                updateState.status === "loading" &&
                updateState.cityId === city.id
              }
              isDeleting={
                deleteState.status === "loading" &&
                deleteState.cityId === city.id
              }
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <CiudadDeleteAlertDialog
        city={cityToDelete}
        open={!!cityToDelete}
        isDeleting={deleteState.status === "loading"}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={handleConfirmDelete}
      />

      <DepartamentoCreateModal
        open={showAddDepartmentModal}
        onClose={() => setShowAddDepartmentModal(false)}
        onSuccess={(departamentoId) => {
          setPreselectedDepartamentoId(departamentoId)
          setShowAddCityModal(true)
        }}
      />
      <CiudadesCreateModal
        open={showAddCityModal}
        onClose={() => {
          setShowAddCityModal(false)
          setPreselectedDepartamentoId(null)
        }}
        preselectedDepartamentoId={preselectedDepartamentoId}
      />
      <CiudadesEditModal
        open={!!cityToEdit}
        city={cityToEdit}
        onClose={() => setCityToEdit(null)}
      />
    </div>
  )
}
