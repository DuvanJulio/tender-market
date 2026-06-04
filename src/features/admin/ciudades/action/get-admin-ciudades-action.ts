import axios from "axios"
import type { IGetCitiesResponse } from "@/features/masters/interfaces"
import type { IGetStatsResponse } from "@/features/landing/interfaces"
import { apiClient } from "@/lib/api-client"
import type { TAdminCiudad, TAdminCiudadesSummary } from "../interfaces"

const GET_ADMIN_CITIES_ENDPOINT = "/api/masters/cities?scope=admin"
const GET_STATS_ENDPOINT = "/api/stats"

export type TGetAdminCiudadesResult = {
  success: boolean
  message: string
  data?: {
    ciudades: TAdminCiudad[]
    summary: TAdminCiudadesSummary
  }
}

function mergeCiudades(
  cities: NonNullable<IGetCitiesResponse["data"]>,
  statsData?: NonNullable<IGetStatsResponse["data"]>
): { ciudades: TAdminCiudad[]; summary: TAdminCiudadesSummary } {
  const statsByCity = new Map(
    (statsData?.por_ciudad ?? []).map((item) => [item.ciudad_id, item])
  )

  const ciudades: TAdminCiudad[] = cities.map((city) => {
    const cityStats = statsByCity.get(city.id)
    return {
      id: city.id,
      nombre: city.nombre,
      departamento_id: city.departamento_id ?? null,
      departamento: city.departamento ?? null,
      estado: city.estado ?? true,
      tenderos: cityStats?.tenderos ?? 0,
      proveedores: cityStats?.proveedores ?? 0,
    }
  })

  const summary: TAdminCiudadesSummary = {
    ciudadesActivas: ciudades.filter((c) => c.estado).length,
    tenderosActivos: statsData?.tenderos_activos ?? 0,
    proveedoresActivos: statsData?.proveedores_activos ?? 0,
  }

  return { ciudades, summary }
}

export async function apiGetAdminCiudadesAction(): Promise<TGetAdminCiudadesResult> {
  try {
    const citiesRes = await apiClient.get<IGetCitiesResponse>(
      GET_ADMIN_CITIES_ENDPOINT
    )

    if (citiesRes.status < 200 || citiesRes.status >= 300) {
      return { success: false, message: "No se pudieron cargar las ciudades" }
    }

    if (!citiesRes.data.success) {
      return {
        success: false,
        message: citiesRes.data.message ?? "No se pudieron cargar las ciudades",
      }
    }

    const cities = citiesRes.data.data ?? []

    if (cities.length === 0) {
      return {
        success: true,
        message: "No hay ciudades registradas",
        data: mergeCiudades([]),
      }
    }

    let statsData: IGetStatsResponse["data"]

    try {
      const statsRes = await apiClient.get<IGetStatsResponse>(GET_STATS_ENDPOINT)

      if (
        statsRes.status >= 200 &&
        statsRes.status < 300 &&
        statsRes.data.success &&
        statsRes.data.data
      ) {
        statsData = statsRes.data.data
      }
    } catch (statsError) {
      console.warn("Estadísticas no disponibles para ciudades:", statsError)
    }

    return {
      success: true,
      message: "Ciudades cargadas",
      data: mergeCiudades(cities, statsData),
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar las ciudades",
      }
    }
    return { success: false, message: "No se pudieron cargar las ciudades" }
  }
}
