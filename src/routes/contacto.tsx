import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { fetchCompany, fetchServices } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { PageSkeleton } from "@/components/site/Skeletons";

type ContactSearch = { service_id?: string | undefined };

export const Route = createFileRoute("/contacto")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    service_id: typeof search["service_id"] === "string" ? search["service_id"] : undefined,
  }),
  loader: async () => {
    const [company, services] = await Promise.all([fetchCompany(), fetchServices()]);
    return { company, services };
  },
  head: () => ({
    meta: [
      { title: "Contacto | EEIVA" },
      {
        name: "description",
        content:
          "Contacta con los expertos en ingeniería eléctrica de EEIVA. Teléfono activo 24 h, 365 días del año.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="form" />,
  pendingMs: 150,
  component: ContactoPage,
});

function ContactoPage() {
  const { company, services } = Route.useLoaderData();
  const { service_id } = Route.useSearch();
  const tel = company.phone ? `tel:${company.phone.replace(/\s+/g, "")}` : undefined;
  const mapSrc = company.address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(company.address)}&z=15&output=embed`
    : null;

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Contacto" }]} />}
        kicker="// contacto"
        title="¿Tienes preguntas? ¡Háblanos!"
        subtitle={
          <span className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-base">
            {company.phone ? (
              <a href={tel} className="hover:text-text">
                {company.phone}
              </a>
            ) : null}
            {company.email ? (
              <a href={`mailto:${company.email}`} className="hover:text-text">
                {company.email}
              </a>
            ) : null}
            {company.schedule ? <span>{company.schedule}</span> : null}
          </span>
        }
      />

      <section className="theme-light bg-surface py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <ContactForm services={services} defaultServiceId={service_id} />

          <aside className="space-y-5">
            <div className="card-tech bg-canvas p-6">
              <ul className="space-y-5 text-sm">
                {company.address ? (
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
                    <span className="text-text">{company.address}</span>
                  </li>
                ) : null}
                {company.phone ? (
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
                    <a href={tel} className="font-medium text-text hover:text-electric">
                      {company.phone}
                    </a>
                  </li>
                ) : null}
                {company.email ? (
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
                    <a
                      href={`mailto:${company.email}`}
                      className="font-medium text-text hover:text-electric"
                    >
                      {company.email}
                    </a>
                  </li>
                ) : null}
                {company.schedule ? (
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
                    <span className="text-text">{company.schedule}</span>
                  </li>
                ) : null}
              </ul>
            </div>
            {mapSrc ? (
              <div className="card-tech overflow-hidden">
                <iframe
                  title="Ubicación de EEIVA en el mapa"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full border-0"
                />
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
