import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { ServiceIcon } from "@/components/site/icons";
import { Field, inputClass } from "@/components/auth/fields";
import { AdminPage } from "../AdminPage";
import { DataTable, type Column } from "../DataTable";
import { ConfirmDelete } from "../ConfirmDelete";
import { FormCard, FormSkeleton } from "../FormCard";
import { RowActions, editLinkClass, EditIcon } from "../RowActions";
import { useAdminList } from "../use-admin-list";
import { servicesApi } from "@/lib/admin/api";
import {
  SERVICE_CATEGORIES,
  SERVICE_ICONS,
  SLUG_RE,
  mergeOptions,
  slugify,
} from "@/lib/admin/constants";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

export function ServicesList() {
  const { query, remove, toggleFeatured } = useAdminList("services", servicesApi);

  const columns: Column<Service>[] = [
    {
      key: "title",
      header: "Título",
      cell: (s) => (
        <span className="flex items-center gap-3 font-medium">
          <ServiceIcon name={s.icon} className="h-4 w-4 shrink-0 text-electric" />
          {s.title}
        </span>
      ),
    },
    { key: "category", header: "Categoría", cell: (s) => s.category ?? "—" },
    {
      key: "featured",
      header: "Destacado",
      cell: (s) => (
        <Switch
          checked={s.featured}
          aria-label={`Destacar ${s.title}`}
          onCheckedChange={(v) => toggleFeatured.mutate({ id: s.id, featured: v })}
        />
      ),
    },
    {
      key: "order",
      header: "Orden",
      cell: (s) => <span className="font-mono">{s.order_index}</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (s) => (
        <RowActions>
          <Link to="/admin/servicios/$id/editar" params={{ id: s.id }} className={editLinkClass}>
            <EditIcon />
            Editar
          </Link>
          <ConfirmDelete
            entity="el servicio"
            name={s.title}
            onConfirm={() => remove.mutateAsync(s.id).then(() => undefined)}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <AdminPage
      kicker="// contenido"
      title="Servicios"
      description="Servicios que se muestran en la web pública."
      action={
        <Link to="/admin/servicios/nuevo" className="btn-primary px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo servicio
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rows={query.data}
        isLoading={query.isLoading}
        error={query.error?.message ?? null}
        empty="Aún no hay servicios — crea el primero."
      />
    </AdminPage>
  );
}

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Escribe al menos 3 caracteres.")
    .max(120, "Máximo 120 caracteres."),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio.")
    .regex(SLUG_RE, "Solo minúsculas, números y guiones (ej: instalaciones-electricas)."),
  short_description: z
    .string()
    .trim()
    .min(1, "La descripción corta es obligatoria.")
    .max(160, "Máximo 160 caracteres."),
  full_description: z.string().trim().min(1, "La descripción completa es obligatoria."),
  icon: z.string().min(1, "Elige un icono."),
  category: z.string().min(1, "Elige una categoría."),
  featured: z.boolean(),
  order_index: z.coerce.number().int("Debe ser un número entero.").min(0, "Mínimo 0."),
});
type Values = z.infer<typeof schema>;

export function ServiceForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const editing = Boolean(id);
  const current = useQuery({
    queryKey: ["admin", "services", id],
    queryFn: () => servicesApi.get(id!),
    enabled: editing,
  });
  const all = useQuery({ queryKey: ["admin", "services"], queryFn: servicesApi.list });

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      icon: "zap",
      category: "",
      featured: false,
      order_index: 0,
    },
  });
  const { register, handleSubmit, reset, watch, setValue, setError, control, formState } = form;
  const { errors, dirtyFields } = formState;

  useEffect(() => {
    const s = current.data;
    if (s) {
      reset({
        title: s.title,
        slug: s.slug,
        short_description: s.short_description,
        full_description: s.full_description ?? "",
        icon: s.icon,
        category: s.category ?? "",
        featured: s.featured,
        order_index: s.order_index,
      });
    }
  }, [current.data, reset]);

  // Slug automático desde el título mientras no se edite a mano (solo al crear)
  const title = watch("title");
  useEffect(() => {
    if (!editing && !dirtyFields.slug) setValue("slug", slugify(title));
  }, [title, editing, dirtyFields.slug, setValue]);

  const save = useMutation({
    mutationFn: async (v: Values) => {
      if (await servicesApi.slugTaken(v.slug, id)) {
        setError("slug", { message: "Ya existe otro servicio con este slug." });
        throw new Error("slug");
      }
      return editing ? servicesApi.update(id!, v) : servicesApi.insert(v);
    },
    onSuccess: () => {
      toast.success(editing ? "Servicio actualizado" : "Servicio creado");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void navigate({ to: "/admin/servicios" });
    },
    onError: (e: Error) => {
      if (e.message !== "slug") toast.error(e.message);
    },
  });

  const icon = watch("icon");
  const shortLen = watch("short_description")?.length ?? 0;
  const categories = mergeOptions(
    SERVICE_CATEGORIES,
    ...(all.data?.map((s) => s.category) ?? []),
    current.data?.category,
  );
  const icons = mergeOptions(SERVICE_ICONS, current.data?.icon);

  return (
    <AdminPage kicker="// servicios" title={editing ? "Editar servicio" : "Nuevo servicio"}>
      {editing && current.isLoading ? (
        <FormSkeleton />
      ) : editing && !current.data ? (
        <p className="text-text-muted">No se ha encontrado este servicio.</p>
      ) : (
        <FormCard
          onSubmit={handleSubmit((v) => save.mutate(v))}
          saving={save.isPending}
          cancelTo="/admin/servicios"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="title" label="Título *" error={errors.title?.message}>
              <input id="title" className={inputClass} {...register("title")} />
            </Field>
            <Field id="slug" label="Slug (URL) *" error={errors.slug?.message}>
              <input id="slug" className={`${inputClass} font-mono`} {...register("slug")} />
            </Field>
          </div>
          <Field
            id="short_description"
            label={`Descripción corta * (${shortLen}/160)`}
            error={errors.short_description?.message}
          >
            <textarea
              id="short_description"
              rows={2}
              maxLength={160}
              className={inputClass}
              {...register("short_description")}
            />
          </Field>
          <Field
            id="full_description"
            label="Descripción completa *"
            error={errors.full_description?.message}
          >
            <textarea
              id="full_description"
              rows={10}
              className={inputClass}
              {...register("full_description")}
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Separa párrafos con una línea en blanco. Usa «## » para subtítulos y «- » para listas.
            </p>
          </Field>
          <div className="grid gap-6 sm:grid-cols-3">
            <Field id="icon" label="Icono *" error={errors.icon?.message}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface-elevated text-electric">
                  <ServiceIcon name={icon} className="h-5 w-5" />
                </span>
                <select id="icon" className={inputClass} {...register("icon")}>
                  {icons.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
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
            <Field id="order_index" label="Orden" error={errors.order_index?.message}>
              <input
                id="order_index"
                type="number"
                min={0}
                className={inputClass}
                {...register("order_index")}
              />
            </Field>
          </div>
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
