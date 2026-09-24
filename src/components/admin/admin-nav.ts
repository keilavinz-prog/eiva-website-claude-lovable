import {
  CalendarDays,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import type { ShellNavItem } from "@/components/dashboard/DashboardShell";

export const ADMIN_NAV: ShellNavItem[] = [
  { label: "Panel", to: "/admin/dashboard", Icon: LayoutDashboard, exact: true },
  { label: "Servicios", to: "/admin/servicios", Icon: Zap },
  { label: "Proyectos", to: "/admin/proyectos", Icon: FolderKanban },
  { label: "Testimonios", to: "/admin/testimonios", Icon: MessageSquareQuote },
  { label: "Equipo", to: "/admin/equipo", Icon: Users },
  { label: "Proveedores", to: "/admin/proveedores", Icon: Truck },
  { label: "Solicitudes", to: "/admin/solicitudes", Icon: Inbox },
  { label: "Citas", to: "/admin/citas", Icon: CalendarDays },
];
