import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { fetchCompany, fetchServices } from "@/lib/site-data";
import { useSessionProfile } from "@/hooks/use-session-profile";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageSkeleton } from "@/components/site/Skeletons";
import { BookingForm } from "@/components/booking/BookingForm";

export const Route = createFileRoute("/reservar")({
  validateSearch: (search: Record<string, unknown>): { servicio?: string } => {
    const servicio = search["servicio"];
    return typeof servicio === "string" && servicio ? { servicio } : {};
  },
  loader: async () => {
    const [company, services] = await Promise.all([fetchCompany(), fetchServices()]);
    return { company, services };
  },
  head: () => ({
    meta: [
      { title: "Reservar cita | EEIVA" },
      {
        name: "description",
        content: "Reserva una cita presencial o por videollamada con el equipo técnico de EEIVA.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="detail" />,
  pendingMs: 150,
  component: ReservarPage,
});

function ReservarPage() {
  const { company, services } = Route.useLoaderData();
  const { servicio } = Route.useSearch();
  const session = useSessionProfile();
  const initialServiceId = services.find((s) => s.slug === servicio)?.id;
  const back = servicio ? `/reservar?servicio=${encodeURIComponent(servicio)}` : "/reservar";

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Reservar cita" }]} />
        }
        kicker="// reservas"
        title="Reserva tu cita"
        subtitle="Elige servicio, día y franja horaria. Te confirmaremos la cita por email."
      />
      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="card-tech p-6 sm:p-8">
            {session.status === "loading" ? (
              <div className="space-y-4" aria-busy="true" aria-label="Cargando">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded bg-surface-elevated" />
                ))}
              </div>
            ) : session.status === "anon" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface-elevated text-electric">
                  <CalendarCheck className="h-7 w-7" aria-hidden="true" />
                </span>
                <p className="mt-5 text-lg font-semibold text-text">
                  Inicia sesión o regístrate para reservar tu cita
                </p>
                <p className="mt-2 text-text-muted">
                  Así podrás ver y gestionar tus citas desde tu área de cliente.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to="/login" search={{ redirect: back }} className="btn-primary px-6 py-3">
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    search={{ redirect: back }}
                    className="btn-secondary px-6 py-3"
                  >
                    Crear cuenta
                  </Link>
                </div>
              </div>
            ) : (
              <BookingForm
                profile={session.profile}
                services={services}
                initialServiceId={initialServiceId}
              />
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
