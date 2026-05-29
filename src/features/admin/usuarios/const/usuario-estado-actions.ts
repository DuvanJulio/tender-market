import type { TUsuarioEstado } from "../interfaces"

export type TUsuarioEstadoAccion =
  | "aceptar"
  | "rechazar"
  | "desactivar"
  | "reactivar"

export function getUsuarioEstadoOpciones(
  estado: TUsuarioEstado
): TUsuarioEstadoAccion[] {
  if (estado === "pendiente") return ["aceptar", "rechazar"]
  if (estado === "activo") return ["desactivar"]
  if (estado === "inactivo") return ["reactivar"]
  return []
}

export function estadoAccionEliminaUsuario(
  accion: TUsuarioEstadoAccion
): boolean {
  return accion === "rechazar"
}

export function estadoAccionToTargetEstado(
  accion: Exclude<TUsuarioEstadoAccion, "rechazar">
): Extract<TUsuarioEstado, "activo" | "inactivo"> {
  if (accion === "aceptar" || accion === "reactivar") return "activo"
  return "inactivo"
}

export const USUARIO_ESTADO_ACCION_CONFIG: Record<
  TUsuarioEstadoAccion,
  {
    label: string
    dialogTitle: string
    dialogDescription: (nombre: string) => string
    confirmLabel: string
    itemClassName: string
  }
> = {
  aceptar: {
    label: "Aceptar",
    dialogTitle: "¿Aceptar usuario?",
    dialogDescription: (nombre) =>
      `"${nombre}" pasará a activo y podrá iniciar sesión en la plataforma.`,
    confirmLabel: "Aceptar",
    itemClassName: "text-success focus:text-success",
  },
  rechazar: {
    label: "Rechazar",
    dialogTitle: "¿Rechazar solicitud?",
    dialogDescription: (nombre) =>
      `Se eliminará permanentemente a "${nombre}" y su cuenta de acceso. La solicitud de registro no se conservará.`,
    confirmLabel: "Rechazar y eliminar",
    itemClassName: "text-destructive focus:text-destructive",
  },
  desactivar: {
    label: "Marcar inactivo",
    dialogTitle: "¿Desactivar usuario?",
    dialogDescription: (nombre) =>
      `"${nombre}" quedará inactivo y no podrá acceder hasta que lo reactives.`,
    confirmLabel: "Desactivar",
    itemClassName: "text-warning focus:text-warning",
  },
  reactivar: {
    label: "Reactivar",
    dialogTitle: "¿Reactivar usuario?",
    dialogDescription: (nombre) =>
      `"${nombre}" volverá a activo y podrá usar la plataforma.`,
    confirmLabel: "Reactivar",
    itemClassName: "text-success focus:text-success",
  },
}

export function matchesEstadoFilter(
  userEstado: TUsuarioEstado,
  filter: "all" | TUsuarioEstado
): boolean {
  if (filter === "all") return true
  return userEstado === filter
}
