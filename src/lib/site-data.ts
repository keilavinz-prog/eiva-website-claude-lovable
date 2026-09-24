import { notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type CompanyInfo = Tables<"company_info">;
export type Service = Tables<"services">;
export type Project = Tables<"projects">;
export type TeamMember = Tables<"team_members">;

function fail(error: { message: string }): never {
  throw new Error(`No se pudieron cargar los datos: ${error.message}`);
}

export async function fetchCompany(): Promise<CompanyInfo> {
  const { data, error } = await supabase.from("company_info").select("*").eq("id", 1).single();
  if (error) fail(error);
  return data;
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) fail(error);
  return data ?? [];
}

export async function fetchServiceBySlug(slug: string): Promise<Service> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) fail(error);
  if (!data) throw notFound();
  return data;
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) fail(error);
  return data ?? [];
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) fail(error);
  if (!data) throw notFound();
  return data;
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) fail(error);
  return data ?? [];
}

/** Categorías de proyecto afines a cada categoría de servicio. */
const RELATED_PROJECT_CATEGORIES: Record<string, string[]> = {
  Instalaciones: ["Industrial", "Comercial", "Hostelería"],
  Certificación: ["Residencial", "Hostelería"],
  Automatización: ["Residencial Premium"],
  Movilidad: ["Movilidad Eléctrica"],
  Energía: ["Energía Solar"],
  Climatización: ["Hostelería", "Comercial"],
  Eficiencia: ["Industrial", "Comercial"],
  Telecomunicaciones: ["Comercial"],
};

/** 2-3 proyectos relacionados con un servicio; si no hay coincidencias, proyectos destacados. */
export function pickRelatedProjects(service: Service, projects: Project[]): Project[] {
  const cats = RELATED_PROJECT_CATEGORIES[service.category ?? ""] ?? [];
  const related = projects.filter((p) => cats.includes(p.category));
  const pool = related.length > 0 ? related : projects.filter((p) => p.featured);
  return pool.slice(0, 3);
}

/** Años de experiencia: calculados si hay año de fundación; si no, "+25" (dato de eeiva.es). */
export function experienceLabel(foundedYear: number | null): string {
  return foundedYear ? String(new Date().getFullYear() - foundedYear) : "+25";
}
