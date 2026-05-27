import { TBaseResponse } from "@/types"

export interface IGetStatsResponse extends TBaseResponse<IGetStatsResponseData> {
}

export interface ICityStatsItem {
  ciudad_id: number
  tenderos: number
  proveedores: number
}

export interface IGetStatsResponseData {
  tenderos_activos: number
  proveedores_activos: number
  por_ciudad?: ICityStatsItem[]
}

