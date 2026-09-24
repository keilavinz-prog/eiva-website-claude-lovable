import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/auth/fields";
import { AdminPage } from "../AdminPage";
import { DataTable, type Column } from "../DataTable";
import { ConfirmDelete } from "../ConfirmDelete";
import { FormCard, FormSkeleton } from "../FormCard";
import { RowActions, editLinkClass, EditIcon } from "../RowActions";
import { useAdminList } from "../use-admin-list";
import { teamApi } from "@/lib/admin/api";
import { isUrl } from "@/lib/admin/constants";
import type { Tables } from "@/integrations/supabase/types";

type Member = Tables<"team_members">;

export function TeamList() {
  const { query, remove } = useAdminList("team_members", teamApi);

  const columns: Column<Member>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (m) => <span className="font-medium">{m.full_name}</span>,
    },
    { key: "role", header: "Cargo", cell: (m) => m.role_title },
    {
      key: "order",
      header: "Orden",
      cell: (m) => <span className="font-mono">{m.order_index}</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (m) => (
        <RowActions>
          <Link to="/admin/equipo/$id/editar" params={{ id: m.id }} className={editLinkClass}>
            <EditIcon />
            Editar
          </Link>
          <ConfirmDelete
            entity="a"
            name={m.full_name}
            onConfirm={() => remove.mutateAsync(m.id).then(() => undefined)}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <AdminPage
      kicker="// contenido"
      title="Equipo"
      description="Personas que aparecen en la página del equipo."
      action={
        <Link to="/admin/equipo/nuevo" className="btn-primary px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo miembro
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rows={query.data}
        isLoading={query.isLoading}
        error={query.error?.message ?? null}
        empty="Aún no hay miembros del equipo — añade el primero."
      />
    </AdminPage>
  );
}

const schema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "Escribe al menos 3 caracteres.")
    .max(120, "Máximo 120 caracteres."),
  role_title: z
    .string()
    .trim()
    .min(2, "El cargo es obligatorio.")
    .max(120, "Máximo 120 caracteres."),
  bio: z.string().trim().max(600, "Máximo 600 caracteres (2-3 frases)."),
  photo_url: z
    .string()
    .trim()
    .refine((v) => v === "" || isUrl(v), "Introduce una URL válida (https://...)."),
  order_index: z.coerce.number().int("Debe ser un número entero.").min(0, "Mínimo 0."),
});
type Values = z.infer<typeof schema>;

export function TeamForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const editing = Boolean(id);
  const current = useQuery({
    queryKey: ["admin", "team_members", id],
    queryFn: () => teamApi.get(id!),
    enabled: editing,
  });

  const { register, handleSubmit, reset, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", role_title: "", bio: "", photo_url: "", order_index: 0 },
  });
  const { errors } = formState;

  useEffect(() => {
    const m = current.data;
    if (m) {
      reset({
        full_name: m.full_name,
        role_title: m.role_title,
        bio: m.bio ?? "",
        photo_url: m.photo_url ?? "",
        order_index: m.order_index,
      });
    }
  }, [current.data, reset]);

  const save = useMutation({
    mutationFn: (v: Values) => {
      const payload = {
        full_name: v.full_name,
        role_title: v.role_title,
        bio: v.bio || null,
        photo_url: v.photo_url || null,
        order_index: v.order_index,
      };
      return editing ? teamApi.update(id!, payload) : teamApi.insert(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Miembro actualizado" : "Miembro añadido");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void navigate({ to: "/admin/equipo" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminPage kicker="// equipo" title={editing ? "Editar miembro" : "Nuevo miembro"}>
      {editing && current.isLoading ? (
        <FormSkeleton />
      ) : editing && !current.data ? (
        <p className="text-text-muted">No se ha encontrado este miembro.</p>
      ) : (
        <FormCard
          onSubmit={handleSubmit((v) => save.mutate(v))}
          saving={save.isPending}
          cancelTo="/admin/equipo"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="full_name" label="Nombre completo *" error={errors.full_name?.message}>
              <input id="full_name" className={inputClass} {...register("full_name")} />
            </Field>
            <Field id="role_title" label="Cargo *" error={errors.role_title?.message}>
              <input id="role_title" className={inputClass} {...register("role_title")} />
            </Field>
          </div>
          <Field id="bio" label="Bio (2-3 frases)" error={errors.bio?.message}>
            <textarea id="bio" rows={4} className={inputClass} {...register("bio")} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="photo_url" label="URL foto (opcional)" error={errors.photo_url?.message}>
              <input
                id="photo_url"
                type="url"
                placeholder="https://..."
                className={inputClass}
                {...register("photo_url")}
              />
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
        </FormCard>
      )}
    </AdminPage>
  );
}
