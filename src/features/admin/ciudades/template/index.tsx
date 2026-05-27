"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store"
import { fetchCiudades } from "@/store/admin/ciudades-slice"
import { CiudadesView } from "../components"

export function CiudadesTemplate() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCiudades())
  }, [dispatch])

  return <CiudadesView />
}

export default CiudadesTemplate
