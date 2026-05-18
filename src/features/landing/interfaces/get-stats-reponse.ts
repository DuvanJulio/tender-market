import { TBaseResponse } from "@/types"

export interface IGetStatsResponse extends TBaseResponse<IGetStatsResponseData> {
}

export interface IGetStatsResponseData {
  tenderos_activos: number
  proveedores_activos: number
}

