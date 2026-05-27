export type TAdminCiudad = {
  id: number
  nombre: string
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
