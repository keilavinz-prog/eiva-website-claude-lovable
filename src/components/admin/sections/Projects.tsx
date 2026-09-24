import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Field, inputClass } from "@/components/auth/fields";
import { AdminPage } from "../AdminPage";
import { DataTable, type Column } from "../DataTable";
import { ConfirmDelete } from "../ConfirmDelete";
import { FormCard, FormSkeleton } from "../FormCard";
import { RowActions, editLinkClass, EditIcon } from "../RowActions";
import { useAdminList } from "../use-admin-list";
import { projectsApi } from "@/lib/admin/api";
import { PROJECT_CATEGORIES, SLUG_RE, isUrl, mergeOptions, slugify } from "@/lib/admin/constants";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
const MAX_GALLERY = 6;

export function ProjectsList() {
  const { query, remove, toggleFeatured } = useAdminList("projects", projectsApi);

  const columns: Column<Project>[] = [
    { key: "title", header: "Título", cell: (p) => <span className="font-medium">{p.title}</span> },
    { key: "category", header: "Categoría", cell: (p) => p.category },
    { key: "location", header: "Ubicación", cell: (p) => p.location ?? "—" },
    {
      key: "featured",
      header: "Destacado",
      cell: (p) => (
        <Switch
          checked={p.featured}
          aria-label={`Destacar ${p.title}`}
          onCheckedChange={(v) => toggleFeatured.mutate({ id: p.id, featured: v })}
        />
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (p) => (
        <RowActions>
          <Link to="/admin/proyectos/$id/editar" params={{ id: p.id }} className={editLinkClass}>
            <EditIcon />
            Editar
          </Link>
          <ConfirmDelete
            entity="el proyecto"
            name={p.title}
            onConfirm={() => remove.mutateAsync(p.id).then(() => undefined)}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <AdminPage
      kicker="// contenido"
      title="Proyectos"
      description="En la web pública se muestran como «Áreas de trabajo»."
      action={
        <Link to="/admin/proyectos/nuevo" className="btn-primary px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo proyecto
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rows={query.data}
        isLoading={query.isLoading}
        error={query.error?.message ?? null}
        empty="Aún no hay proyectos — crea el primero."
      />
    </AdminPage>
  );
}

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || isUrl(v), "Introduce una URL válida (https://...).");

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Escribe al menos 3 caracteres.")
    .max(150, "Máximo 150 caracteres."),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio.")
    .regex(SLUG_RE, "Solo minúsculas, números y guiones."),
  description: z.string().trim(),
  category: z.string().min(1, "Elige una categoría."),
  location: z.string().trim(),
  client_name: z.string().trim(),
  image_url: optionalUrl,
  gallery: z
    .array(z.object({ url: optionalUrl }))
    .max(MAX_GALLERY, `Máximo ${MAX_GALLERY} imágenes.`),
  completion_date: z.string(),
  power_detail: z.string().trim(),
  featured: z.boolean(),
});
type Values = z.infer<typeof schema>;

const empty = (v: string) => (v.trim() === "" ? null : v.trim());

export function ProjectForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const editing = Boolean(id);
  const current = useQuery({
    queryKey: ["admin", "projects", id],
    queryFn: () => projectsApi.get(id!),
    enabled: editing,
  });
  const all = useQuery({ queryKey: ["admin", "projects"], queryFn: projectsApi.list });

  const { register, handleSubmit, reset, watch, setValue, setError, control, formState } =
    useForm<Values>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: "",
        slug: "",
        description: "",
        category: "",
        location: "",
        client_name: "",
        image_url: "",
        gallery: [],
        completion_date: "",
        power_detail: "",
        featured: false,
      },
    });
  const { errors, dirtyFields } = formState;
  const gallery = useFieldArray({ control, name: "gallery" });

  useEffect(() => {
    const p = current.data;
    if (p) {
      reset({
        title: p.title,
        slug: p.slug,
        description: p.description ?? "",
        category: p.category,
        location: p.location ?? "",
        client_name: p.client_name ?? "",
        image_url: p.image_url ?? "",
        gallery: (p.gallery_urls ?? []).slice(0, MAX_GALLERY).map((url) => ({ url })),
        completion_date: p.completion_date ?? "",
        power_detail: p.power_detail ?? "",
        featured: p.featured,
      });
    }
  }, [current.data, reset]);

  const title = watch("title");
  useEffect(() => {
    if (!editing && !dirtyFields.slug) setValue("slug", slugify(title));
  }, [title, editing, dirtyFields.slug, setValue]);

  const save = useMutation({
    mutationFn: async (v: Values) => {
      if (await projectsApi.slugTaken(v.slug, id)) {
        setError("slug", { message: "Ya existe otro proyecto con este slug." });
        throw new Error("slug");
      }
      const urls = v.gallery.map((g) => g.url.trim()).filter(Boolean);
      const payload = {
        title: v.title,
        slug: v.slug,
        description: empty(v.description),
        category: v.category,
        location: empty(v.location),
        client_name: empty(v.client_name),
        image_url: empty(v.image_url),
        gallery_urls: urls.length > 0 ? urls : null,
        completion_date: v.completion_date || null,
        power_detail: empty(v.power_detail),
        featured: v.featured,
      };
      return editing ? projectsApi.update(id!, payload) : projectsApi.insert(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Proyecto actualizado" : "Proyecto creado");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void navigate({ to: "/admin/proyectos" });
    },
    onError: (e: Error) => {
      if (e.message !== "slug") toast.error(e.message);
    },
  });

  const categories = mergeOptions(
    PROJECT_CATEGORIES,
    ...(all.data?.map((p) => p.category) ?? []),
    current.data?.category,
  );

  return (
    <AdminPage kicker="// proyectos" title={editing ? "Editar proyecto" : "Nuevo proyecto"}>
      {editing && current.isLoading ? (
        <FormSkeleton />
      ) : editing && !current.data ? (
        <p className="text-text-muted">No se ha encontrado este proyecto.</p>
      ) : (
        <FormCard
          onSubmit={handleSubmit((v) => save.mutate(v))}
          saving={save.isPending}
          cancelTo="/admin/proyectos"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="title" label="Título *" error={errors.title?.message}>
              <input id="title" className={inputClass} {...register("title")} />
            </Field>
            <Field id="slug" label="Slug (URL) *" error={errors.slug?.message}>
              <input id="slug" className={`${inputClass} font-mono`} {...register("slug")} />
            </Field>
          </div>
          <Field id="description" label="Descripción" error={errors.description?.message}>
            <textarea
              id="description"
              rows={8}
              className={inputClass}
              {...register("description")}
            />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="category" label="Categoría *" error={errors.category?.message}>
              <select id="category" className={inputClass} {...register("category")}>
                <option value="">Elige una categoría</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="location" label="Ubicación" error={errors.location?.message}>
              <input id="location" className={inputClass} {...register("location")} />
            </Field>
            <Field id="client_name" label="Cliente (opcional)" error={errors.client_name?.message}>
              <input id="client_name" className={inputClass} {...register("client_name")} />
            </Field>
            <Field
              id="power_detail"
              label="Detalle de potencia (opcional)"
              error={errors.power_detail?.message}
            >
              <input
                id="power_detail"
                placeholder="Ej: 90 kWp"
                className={inputClass}
                {...register("power_detail")}
              />
            </Field>
            <Field
              id="completion_date"
              label="Fecha de finalización (opcional)"
              error={errors.completion_date?.message}
            >
              <input
                id="completion_date"
                type="date"
                className={inputClass}
                {...register("completion_date")}
              />
            </Field>
            <Field id="image_url" label="URL imagen principal" error={errors.image_url?.message}>
              <input
                id="image_url"
                type="url"
                placeholder="https://..."
                className={inputClass}
                {...register("image_url")}
              />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-text">
              Galería ({gallery.fields.length}/{MAX_GALLERY})
            </legend>
            <div className="space-y-3">
              {gallery.fields.map((f, i) => (
                <div key={f.id}>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      aria-label={`URL de la imagen ${i + 1} de la galería`}
                      className={inputClass}
                      {...register(`gallery.${i}.url` as const)}
                    />
                    <button
                      type="button"
                      onClick={() => gallery.remove(i)}
                      aria-label={`Quitar imagen ${i + 1}`}
                      className="shrink-0 rounded-md border border-line px-3 text-text-muted transition-colors hover:border-danger hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.gallery?.[i]?.url?.message ? (
                    <p role="alert" className="mt-1.5 text-sm text-danger">
                      {errors.gallery[i]?.url?.message}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            {gallery.fields.length < MAX_GALLERY ? (
              <button
                type="button"
                onClick={() => gallery.append({ url: "" })}
                className="btn-secondary mt-3 px-4 py-2 text-sm"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Añadir imagen
              </button>
            ) : null}
          </fieldset>

          <label className="flex items-center gap-3 text-sm text-text">
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Destacado"
                />
              )}
            />
            Destacado (aparece en la portada)
          </label>
        </FormCard>
      )}
    </AdminPage>
  );
}
