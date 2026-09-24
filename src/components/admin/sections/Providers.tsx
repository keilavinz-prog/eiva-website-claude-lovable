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
import { StatusBadge } from "../StatusBadge";
import { useAdminList } from "../use-admin-list";
import { providersApi } from "@/lib/admin/api";
import { PROVIDER_STATUSES, STATUS_LABEL } from "@/lib/admin/constants";
import type { Tables } from "@/integrations/supabase/types";

type Provider = Tables<"providers">;

export function ProvidersList() {
  const { query, remove } = useAdminList("providers", providersApi);

  const columns: Column<Provider>[] = [
    {
      key: "company",
      header: "Empresa",
      cell: (p) => <span className="font-medium">{p.company_name}</span>,
    },
    { key: "contact", header: "Contacto", cell: (p) => p.contact_name ?? "—" },
    { key: "category", header: "Categoría", cell: (p) => p.service_category ?? "—" },
    { key: "status", header: "Estado", cell: (p) => <StatusBadge status={p.status} /> },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      cell: (p) => (
        <RowActions>
          <Link to="/admin/proveedores/$id/editar" params={{ id: p.id }} className={editLinkClass}>
            <EditIcon />
            Editar
          </Link>
          <ConfirmDelete
            entity="el proveedor"
            name={p.company_name}
            onConfirm={() => remove.mutateAsync(p.id).then(() => undefined)}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <AdminPage
      kicker="// gestión"
      title="Proveedores"
      description="Proveedores homologados. Solo visible para administradores."
      action={
        <Link to="/admin/proveedores/nuevo" className="btn-primary px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo proveedor
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rows={query.data}
        isLoading={query.isLoading}
        error={query.error?.message ?? null}
        empty="Aún no hay proveedores — añade el primero."
      />
    </AdminPage>
  );
}

const PHONE = /^[+\d][\d\s-]{6,19}$/;

const schema = z.object({
  company_name: z.string().trim().min(2, "El nombre de la empresa es obligatorio.").max(160),
  contact_name: z.string().trim().max(120, "Máximo 120 caracteres."),
  service_category: z.string().trim().max(120, "Máximo 120 caracteres."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || PHONE.test(v), "Introduce un teléfono válido."),
  email: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || z.string().email().safeParse(v).success,
      "Revisa el formato del email.",
    ),
  status: z.enum(PROVIDER_STATUSES),
});
type Values = z.infer<typeof schema>;

export function ProviderForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const editing = Boolean(id);
  const current = useQuery({
    queryKey: ["admin", "providers", id],
    queryFn: () => providersApi.get(id!),
    enabled: editing,
  });

  const { register, handleSubmit, reset, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: "",
      contact_name: "",
      service_category: "",
      phone: "",
      email: "",
      status: "pendiente",
    },
  });
  const { errors } = formState;

  useEffect(() => {
    const p = current.data;
    if (p) {
      reset({
        company_name: p.company_name,
        contact_name: p.contact_name ?? "",
        service_category: p.service_category ?? "",
        phone: p.phone ?? "",
        email: p.email ?? "",
        status: (PROVIDER_STATUSES as readonly string[]).includes(p.status)
          ? (p.status as Values["status"])
          : "pendiente",
      });
    }
  }, [current.data, reset]);

  const save = useMutation({
    mutationFn: (v: Values) => {
      const payload = {
        company_name: v.company_name,
        contact_name: v.contact_name || null,
        service_category: v.service_category || null,
        phone: v.phone || null,
        email: v.email || null,
        status: v.status,
      };
      return editing ? providersApi.update(id!, payload) : providersApi.insert(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Proveedor actualizado" : "Proveedor creado");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void navigate({ to: "/admin/proveedores" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminPage kicker="// proveedores" title={editing ? "Editar proveedor" : "Nuevo proveedor"}>
      {editing && current.isLoading ? (
        <FormSkeleton />
      ) : editing && !current.data ? (
        <p className="text-text-muted">No se ha encontrado este proveedor.</p>
      ) : (
        <FormCard
          onSubmit={handleSubmit((v) => save.mutate(v))}
          saving={save.isPending}
          cancelTo="/admin/proveedores"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id="company_name"
              label="Nombre de la empresa *"
              error={errors.company_name?.message}
            >
              <input id="company_name" className={inputClass} {...register("company_name")} />
            </Field>
            <Field
              id="contact_name"
              label="Nombre de contacto"
              error={errors.contact_name?.message}
            >
              <input id="contact_name" className={inputClass} {...register("contact_name")} />
            </Field>
            <Field
              id="service_category"
              label="Categoría de servicio"
              error={errors.service_category?.message}
            >
              <input
                id="service_category"
                placeholder="Ej: Material eléctrico"
                className={inputClass}
                {...register("service_category")}
              />
            </Field>
            <Field id="status" label="Estado *" error={errors.status?.message}>
              <select id="status" className={inputClass} {...register("status")}>
                {PROVIDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="phone" label="Teléfono" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                placeholder="+34 600 000 000"
                className={inputClass}
                {...register("phone")}
              />
            </Field>
            <Field id="email" label="Email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                placeholder="contacto@empresa.es"
                className={inputClass}
                {...register("email")}
              />
            </Field>
          </div>
        </FormCard>
      )}
    </AdminPage>
  );
}
