export type TAdminCiudad = {
  id: number
  nombre: string
  departamento_id: number | null
  departamento: string | null
  estado: boolean
  tenderos: number
  proveedores: number
}

export type TAdminCiudadesSummary = {
  ciudadesActivas: number
  tenderosActivos: number
  proveedoresActivos: number
}
