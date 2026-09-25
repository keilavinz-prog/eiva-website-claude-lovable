import { useQuery } from "@tanstack/react-query";
import { Building2, Mail } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DashboardWelcome } from "./DashboardWelcome";
import { linkAndGetMyProvider } from "@/lib/role-areas";
import { fetchCompany } from "@/lib/site-data";
import type { SessionProfile } from "@/lib/auth";

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="font-mono text-xs text-text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-text">{value || "—"}</dd>
    </div>
  );
}

export function ProviderHome({ profile }: { profile: SessionProfile }) {
  // Al montar: vincula la cuenta con su ficha (por email) y la lee
  const provider = useQuery({
    queryKey: ["me", profile.id, "provider"],
    queryFn: () => linkAndGetMyProvider(profile.id),
  });
  const company = useQuery({ queryKey: ["company"], queryFn: fetchCompany });

  return (
    <div>
      <DashboardWelcome
        name={profile.full_name}
        subtitle="Tu información como proveedor homologado"
      />

      <section className="card-tech mt-10 max-w-3xl p-6 sm:p-8" aria-labelledby="mis-datos">
        {provider.isLoading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Cargando">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-surface-elevated" />
            ))}
          </div>
        ) : provider.error ? (
          <p role="alert" className="text-sm text-danger">
            {provider.error.message}
          </p>
        ) : provider.data ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="mis-datos"
                className="flex items-center gap-3 text-lg font-semibold text-text"
              >
                <Building2 className="h-5 w-5 text-electric" aria-hidden="true" />
                Mis datos
              </h2>
              <StatusBadge status={provider.data.status} />
            </div>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <Row label="Empresa" value={provider.data.company_name} />
              <Row label="Persona de contacto" value={provider.data.contact_name} />
              <Row label="Categoría de servicio" value={provider.data.service_category} />
              <Row label="Teléfono" value={provider.data.phone} />
              <Row label="Email" value={provider.data.email} />
            </dl>
            <p className="mt-6 text-xs text-text-muted">
              Para modificar estos datos, contacta con administración.
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 id="mis-datos" className="text-lg font-semibold text-text">
              Cuenta sin vincular
            </h2>
            <p className="mt-3 text-text-muted">
              Tu cuenta aún no está vinculada a una ficha de proveedor. Contacta con administración.
            </p>
            {company.data?.email ? (
              <a
                href={`mailto:${company.data.email}`}
                className="btn-secondary mt-6 inline-flex px-5 py-2.5 text-sm"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {company.data.email}
              </a>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
