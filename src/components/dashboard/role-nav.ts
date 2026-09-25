import {
  CalendarDays,
  CalendarPlus,
  FileText,
  History,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import type { ShellNavItem } from "./DashboardShell";

/** Barra lateral de los paneles de cliente, empleado y proveedor (el de admin está en admin-nav). */
export const CLIENT_NAV: ShellNavItem[] = [
  { label: "Mis citas", to: "/cliente/dashboard", Icon: LayoutDashboard, exact: true },
  { label: "Reservar cita", to: "/reservar", Icon: CalendarPlus },
  { label: "Mi perfil", to: "#perfil", Icon: UserRound, soon: true },
];

export const EMPLOYEE_NAV: ShellNavItem[] = [
  { label: "Mis tareas", to: "/empleado/dashboard", Icon: LayoutDashboard, exact: true },
  { label: "Calendario", to: "#calendario", Icon: CalendarDays, soon: true },
  { label: "Mi perfil", to: "#perfil", Icon: UserRound, soon: true },
];

export const PROVIDER_NAV: ShellNavItem[] = [
  { label: "Mis datos", to: "/proveedor/dashboard", Icon: LayoutDashboard, exact: true },
  { label: "Historial", to: "#historial", Icon: History, soon: true },
  { label: "Documentos", to: "#documentos", Icon: FileText, soon: true },
];
