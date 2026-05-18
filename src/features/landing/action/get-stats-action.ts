'use server'

import { IGetStatsResponse, IGetStatsResponseData } from "@/features/landing";
import axios from "axios";
import { API_URL } from "@/lib/server-api";

export async function apiGetStatsAction(): Promise<{ success: boolean, message: string, data?: IGetStatsResponseData }> {
    const GET_STATS = process.env.GET_STATS
    try {
        const response = await axios.get<IGetStatsResponse>(`${API_URL}${GET_STATS}`)


        if (response.status !== 200) {
            return { success: false, message: "Error al obtener estadísticas" }
        }

        return { success: true, message: "Estadísticas obtenidas exitosamente", data: response.data.data }

    } catch (error) {
        console.error(error)
        return { success: false, message: "Error interno del servidor" }
    }
}
