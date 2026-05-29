"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store"
import { fetchUsuarios } from "@/store/admin/usuarios-slice"
import { UsuariosView } from "../components"

export function UsuariosTemplate() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchUsuarios())
  }, [dispatch])

  return <UsuariosView />
}

export default UsuariosTemplate
