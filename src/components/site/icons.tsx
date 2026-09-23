import {
  BatteryCharging,
  FileCheck,
  House,
  Lightbulb,
  Sun,
  Wifi,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Traduce el nombre de icono guardado en BD (kebab-case lucide) a su componente. */
const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  "file-check": FileCheck,
  home: House,
  house: House,
  "battery-charging": BatteryCharging,
  sun: Sun,
  wind: Wind,
  lightbulb: Lightbulb,
  wifi: Wifi,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Zap;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
