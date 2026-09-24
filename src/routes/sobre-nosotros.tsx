import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Check, Headset, Layers, Users } from "lucide-react";
import { experienceLabel, fetchCompany, fetchTeam } from "@/lib/site-data";
import { teamPhoto } from "@/lib/images";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { SafeImage } from "@/components/site/SafeImage";
import { TrustStrip } from "@/components/site/TrustStrip";
import { PageSkeleton } from "@/components/site/Skeletons";

const VALUES = [
  {
    Icon: Users,
    title: "Personal experimentado",
    text: "Un equipo especializado con más de 25 años de experiencia en el sector, que trabaja de forma profesional.",
  },
  {
    Icon: Award,
    title: "Calidad asegurada",
    text: "Profesionales formados y especializados, y marcas que aportan garantía de calidad a cada instalación.",
  },
  {
    Icon: Layers,
    title: "Diversidad en áreas",
    text: "Somos polivalentes: abarcamos numerosos campos del sector con un servicio profesional en todos ellos.",
  },
  {
    Icon: Headset,
    title: "Asistencia 24 h",
    text: "Servicio de asistencia en averías disponible las 24 horas, los 365 días del año.",
  },
];

const ASSISTANCE = [
  "Instalaciones eléctricas de baja tensión",
  "Instalaciones eléctricas de media y alta tensión",
  "Mantenimientos industriales",
  "Fotovoltaicas aisladas y conectadas a red",
  "Instalaciones de telecomunicaciones",
  "Automatización y control: inmótica y domótica",
  "Detección de incendios, seguridad y alarma",
  "Alumbrado público e industrial",
  "Estudios e instalaciones de ahorro energético",
  "Instalaciones térmicas y de climatización",
  "Proyectos y legalizaciones eléctricas",
  "Estudios y proyectos fotovoltaicos",
  "Revisión de locales de pública concurrencia",
  "Revisión y mantenimiento de centros de transformación",
  "Certificaciones de telecomunicaciones",
  "Asesoramiento en iluminación",
  "Tramitaciones con la compañía suministradora",
  "Tramitaciones con Industria y Energía",
];

export const Route = createFileRoute("/sobre-nosotros")({
  loader: async () => {
    const [company, team] = await Promise.all([fetchCompany(), fetchTeam()]);
    return { company, team };
  },
  head: () => ({
    meta: [
      { title: "Equipo EEIVA | Electrotecnia e Ingeniería Valencia" },
      {
        name: "description",
        content:
          "Equipo de profesionales de la ingeniería eléctrica con más de 25 años de experiencia, a nivel provincial, nacional e internacional.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: SobreNosotros,
});

function SobreNosotros() {
  const { company, team } = Route.useLoaderData();
  const years = experienceLabel(company.founded_year);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Equipo EEIVA" }]} />
        }
        kicker="// trabajo y compromiso"
        title={
          years.startsWith("+")
            ? "Más de 25 años de experiencia en ingeniería eléctrica"
            : `${years} años de experiencia en ingeniería eléctrica`
        }
        subtitle={company.slogan}
      />

      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <SectionHeading kicker="// equipo" title="Trabajamos por tu tranquilidad" />
          </Reveal>
          <Reveal
            delay={100}
            className="max-w-[68ch] space-y-6 text-lg leading-relaxed text-text-muted"
          >
            <p>
              {company.name} cuenta con un equipo humano altamente cualificado y con el
              equipamiento necesario para realizar trabajos a nivel provincial, nacional e
              internacional. Nuestros profesionales se mantienen en un proceso continuo de
              formación y actualización especializada en el sector, lo que nos ha permitido
              crecer, realizar múltiples trabajos y convertirnos en una empresa eléctrica de
              referencia.
            </p>
            <p>
              Nuestra filosofía aporta a cada proyecto un valor añadido: alta calidad y fiabilidad.
              Trabajamos con marcas que ofrecen garantía y con personal que propone soluciones
              innovadoras y rentables, para asegurar el buen funcionamiento de cada instalación,
              reducir los posibles fallos y aumentar su vida útil y su rendimiento. Somos una
              empresa innovadora, con amplia experiencia y capacidad para adaptarnos a cualquier
              reto que nos proponga el cliente.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// valores" title="Calidad y fiabilidad" />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="card-tech h-full bg-canvas p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-text">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              kicker="// asistencia 365 días"
              title="Servicio de asistencia en averías los 365 días del año"
            />
          </Reveal>
          <Reveal delay={100}>
            <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {ASSISTANCE.map((item) => (
                <li key={item} className="flex gap-3 text-text">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {team.length > 0 ? (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={i * 80}>
                  <article className="card-tech h-full overflow-hidden">
                    <div className="aspect-[4/5] overflow-hidden bg-surface-elevated">
                      <SafeImage
                        src={teamPhoto(m, i)}
                        alt={`Retrato de ${m.full_name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-text">{m.full_name}</h3>
                      <p className="mt-1 font-mono text-xs text-electric">{m.role_title}</p>
                      {m.bio ? (
                        <p className="mt-3 text-sm leading-relaxed text-text-muted">{m.bio}</p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}

          <div className="mt-12">
            <Link to="/contacto" className="btn-primary px-7 py-3.5">
              Solicitar consulta
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip foundedYear={company.founded_year} />
    </PageShell>
  );
}
