import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Handshake, Lightbulb, ShieldCheck } from "lucide-react";
import { fetchCompany, fetchTeam, yearsSince } from "@/lib/site-data";
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
    Icon: ShieldCheck,
    title: "Seguridad ante todo",
    text: "Cada instalación cumple la normativa y se prueba a fondo antes de entregarse.",
  },
  {
    Icon: Award,
    title: "Calidad certificada",
    text: "Empresa instaladora habilitada, con materiales de primeras marcas y trabajo documentado.",
  },
  {
    Icon: Handshake,
    title: "Compromiso con el cliente",
    text: "Plazos claros, un único interlocutor y respuesta rápida cuando algo surge.",
  },
  {
    Icon: Lightbulb,
    title: "Innovación constante",
    text: "Nos formamos continuamente en domótica, autoconsumo y movilidad eléctrica.",
  },
];

export const Route = createFileRoute("/sobre-nosotros")({
  loader: async () => {
    const [company, team] = await Promise.all([fetchCompany(), fetchTeam()]);
    return { company, team };
  },
  head: () => ({
    meta: [
      { title: "Sobre Nosotros | EEIVA" },
      {
        name: "description",
        content:
          "Empresa de instalaciones eléctricas fundada en Paterna en 1998. Conoce al equipo.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: SobreNosotros,
});

function SobreNosotros() {
  const { company, team } = Route.useLoaderData();
  const years = yearsSince(company.founded_year);
  const founded = company.founded_year ?? 1998;

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Sobre Nosotros" }]} />
        }
        kicker="// sobre nosotros"
        title={`${years} años conectando Valencia`}
        subtitle={company.slogan}
      />

      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <SectionHeading kicker="// historia" title="Nuestra historia" />
          </Reveal>
          <Reveal
            delay={100}
            className="max-w-[68ch] space-y-6 text-lg leading-relaxed text-text-muted"
          >
            <p>
              EEIVA nació en {founded} en Paterna, en un pequeño local junto al polígono Fuente del
              Jarro, con un objetivo muy sencillo: hacer instalaciones eléctricas bien hechas, con
              seriedad y trato cercano. Los primeros años trabajamos sobre todo para comercios y
              pequeñas industrias de la zona, y el boca a boca hizo el resto.
            </p>
            <p>
              Con el tiempo el equipo creció y nuestro trabajo se extendió a toda la provincia de
              Valencia, desde viviendas y comunidades de propietarios hasta naves logísticas y
              centros comerciales. En paralelo nos fuimos especializando en los campos que están
              transformando el sector: la domótica, el autoconsumo con energía solar y la movilidad
              eléctrica. Hoy combinamos esa experiencia con la tecnología más actual para ofrecer
              instalaciones seguras, eficientes y preparadas para el futuro.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// valores" title="Nuestros valores" />
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
            <SectionHeading kicker="// equipo" title="Nuestro equipo" />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
          <div className="mt-12">
            <Link to="/contacto" className="btn-primary px-7 py-3.5">
              Hablemos de tu proyecto
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip foundedYear={company.founded_year} />
    </PageShell>
  );
}
