"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store"
import { fetchCategorias } from "@/store/admin/categorias-slice"
import { CategoriasView } from "../components"

export function CategoriasTemplate() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCategorias())
  }, [dispatch])

  return <CategoriasView />
}

export default CategoriasTemplate
