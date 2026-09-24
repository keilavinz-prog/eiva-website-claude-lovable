import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Field, inputClass } from "@/components/auth/fields";
import { AdminPage } from "../AdminPage";
import { DataTable, type Column } from "../DataTable";
import { ConfirmDelete } from "../ConfirmDelete";
import { FormCard, FormSkeleton } from "../FormCard";
import { RowActions, editLinkClass, EditIcon } from "../RowActions";
import { StarsDisplay, StarsInput } from "../Stars";
import { useAdminList } from "../use-admin-list";
import { testimonialsApi } from "@/lib/admin/api";
import { isUrl } from "@/lib/admin/constants";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;

export function TestimonialsList() {
  const { query, remove, toggleFeatured } = useAdminList("testimonials", testimonialsApi);

  const columns: Column<Testimonial>[] = [
    {
      key: "author",
      header: "Autor",
      cell: (t) => <span className="font-medium">{t.author_name}</span>,
    },
    { key: "context", header: "Contexto", cell: (t) => t.role_context ?? "—" },
    { key: "rating", header: "Valoración", cell: (t) => <StarsDisplay value={t.rating} /> },
    {
      key: "featured",
      header: "Destacado",
      cell: (t) => (
        <Switch
          checked={t.featured}
          aria-label={`Destacar testimonio de ${t.author_name}`}
          onCheckedChange={(v) => toggleFeatured.mutate({ id: t.id, featured: v })}
        />
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (t) => (
        <RowActions>
          <Link to="/admin/testimonios/$id/editar" params={{ id: t.id }} className={editLinkClass}>
            <EditIcon />
            Editar
          </Link>
          <ConfirmDelete
            entity="el testimonio de"
            name={t.author_name}
            onConfirm={() => remove.mutateAsync(t.id).then(() => undefined)}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <AdminPage
      kicker="// contenido"
      title="Testimonios"
      description="Opiniones de clientes. Los destacados aparecen en la portada."
      action={
        <Link to="/admin/testimonios/nuevo" className="btn-primary px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo testimonio
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rows={query.data}
        isLoading={query.isLoading}
        error={query.error?.message ?? null}
        empty="Aún no hay testimonios — crea el primero."
      />
    </AdminPage>
  );
}

const schema = z.object({
  author_name: z
    .string()
    .trim()
    .min(2, "Escribe el nombre del autor.")
    .max(120, "Máximo 120 caracteres."),
  role_context: z.string().trim().max(160, "Máximo 160 caracteres."),
  content: z.string().trim().min(20, "Mínimo 20 caracteres.").max(500, "Máximo 500 caracteres."),
  rating: z.number().int().min(1, "Elige una valoración.").max(5),
  avatar_url: z
    .string()
    .trim()
    .refine((v) => v === "" || isUrl(v), "Introduce una URL válida (https://...)."),
  featured: z.boolean(),
});
type Values = z.infer<typeof schema>;

export function TestimonialForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const editing = Boolean(id);
  const current = useQuery({
    queryKey: ["admin", "testimonials", id],
    queryFn: () => testimonialsApi.get(id!),
    enabled: editing,
  });

  const { register, handleSubmit, reset, watch, control, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      author_name: "",
      role_context: "",
      content: "",
      rating: 5,
      avatar_url: "",
      featured: false,
    },
  });
  const { errors } = formState;

  useEffect(() => {
    const t = current.data;
    if (t) {
      reset({
        author_name: t.author_name,
        role_context: t.role_context ?? "",
        content: t.content,
        rating: t.rating,
        avatar_url: t.avatar_url ?? "",
        featured: t.featured,
      });
    }
  }, [current.data, reset]);

  const save = useMutation({
    mutationFn: (v: Values) => {
      const payload = {
        author_name: v.author_name,
        role_context: v.role_context || null,
        content: v.content,
        rating: v.rating,
        avatar_url: v.avatar_url || null,
        featured: v.featured,
      };
      return editing ? testimonialsApi.update(id!, payload) : testimonialsApi.insert(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Testimonio actualizado" : "Testimonio creado");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void navigate({ to: "/admin/testimonios" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const contentLen = watch("content")?.length ?? 0;

  return (
    <AdminPage kicker="// testimonios" title={editing ? "Editar testimonio" : "Nuevo testimonio"}>
      {editing && current.isLoading ? (
        <FormSkeleton />
      ) : editing && !current.data ? (
        <p className="text-text-muted">No se ha encontrado este testimonio.</p>
      ) : (
        <FormCard
          onSubmit={handleSubmit((v) => save.mutate(v))}
          saving={save.isPending}
          cancelTo="/admin/testimonios"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="author_name" label="Nombre del autor *" error={errors.author_name?.message}>
              <input id="author_name" className={inputClass} {...register("author_name")} />
            </Field>
            <Field id="role_context" label="Contexto / cargo" error={errors.role_context?.message}>
              <input
                id="role_context"
                placeholder="Ej: Gerente, Nave industrial en Paterna"
                className={inputClass}
                {...register("role_context")}
              />
            </Field>
          </div>
          <Field
            id="content"
            label={`Contenido * (${contentLen}/500)`}
            error={errors.content?.message}
          >
            <textarea
              id="content"
              rows={5}
              maxLength={500}
              className={inputClass}
              {...register("content")}
            />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-medium text-text">Valoración *</p>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => <StarsInput value={field.value} onChange={field.onChange} />}
              />
              {errors.rating?.message ? (
                <p role="alert" className="mt-1.5 text-sm text-danger">
                  {errors.rating.message}
                </p>
              ) : null}
            </div>
            <Field id="avatar_url" label="URL avatar (opcional)" error={errors.avatar_url?.message}>
              <input
                id="avatar_url"
                type="url"
                placeholder="https://..."
                className={inputClass}
                {...register("avatar_url")}
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
