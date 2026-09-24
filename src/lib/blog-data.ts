import { notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type BlogPost = Tables<"blog_posts">;

function fail(error: { message: string }): never {
  throw new Error(`No se pudieron cargar los artículos: ${error.message}`);
}

/** Artículos publicados, del más reciente al más antiguo. */
export async function fetchPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) fail(error);
  return data ?? [];
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) fail(error);
  if (!data) throw notFound();
  return data;
}
