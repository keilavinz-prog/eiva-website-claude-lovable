import {
  ChartColumn,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderCog,
  History,
  Inbox,
  ListChecks,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/auth";

export type QuickItem = { title: string; phase: string; Icon: LucideIcon };

export const DASHBOARD_CONFIG: Record<
  Role,
  { subtitle: string; items: [QuickItem, QuickItem, QuickItem] }
> = {
  cliente: {
    subtitle: "Aquí verás tus solicitudes y citas",
    items: [
      { title: "Mis Solicitudes", phase: "Fase 5", Icon: ClipboardList },
      { title: "Mis Citas", phase: "Fase 5", Icon: CalendarDays },
      { title: "Mi Perfil", phase: "Fase 5", Icon: UserRound },
    ],
  },
  admin: {
    subtitle: "Panel de control general de EEIVA",
    items: [
      { title: "Gestión de Contenido", phase: "Fase 4", Icon: FolderCog },
      { title: "Solicitudes de Contacto", phase: "Fase 4", Icon: Inbox },
      { title: "Métricas", phase: "Fase 7", Icon: ChartColumn },
    ],
  },
  empleado: {
    subtitle: "Tus tareas y citas asignadas",
    items: [
      { title: "Tareas Asignadas", phase: "Fase 5", Icon: ListChecks },
      { title: "Calendario", phase: "Fase 6", Icon: CalendarDays },
      { title: "Mi Perfil", phase: "Fase 5", Icon: UserRound },
    ],
  },
  proveedor: {
    subtitle: "Tu información como proveedor homologado",
    items: [
      { title: "Mis Datos", phase: "Fase 5", Icon: UserRound },
      { title: "Historial", phase: "Fase 5", Icon: History },
      { title: "Documentos", phase: "Fase 5", Icon: FileText },
    ],
  },
};
