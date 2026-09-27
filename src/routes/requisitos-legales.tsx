import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileCheck,
  HardHat,
  Landmark,
  ScrollText,
  ShieldCheck,
  Stamp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { fetchCompany } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { PageSkeleton } from "@/components/site/Skeletons";
import { breadcrumbLd, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/requisitos-legales")({
  loader: () => fetchCompany(),
  head: () => {
    const title = "Requisitos legales | EEIVA";
    const description =
      "EEIVA opera dentro del marco normativo de las instalaciones eléctricas en España: habilitación en baja y alta tensión, altas administrativas y homologación como empresa instaladora.";
    const crumbs = [{ label: "Inicio", to: "/" }, { label: "Requisitos legales" }];
    const og = pageMeta({ title, description, path: "/requisitos-legales" });
    return {
      meta: [{ title }, { name: "description", content: description }, ...og.meta],
      links: og.links,
      scripts: [ldScript(breadcrumbLd(crumbs))],
    };
  },
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: RequisitosLegalesPage,
});

type Item = { Icon: LucideIcon; title: string; text: string };

const BAJA_TENSION: Item[] = [
  {
    Icon: BadgeCheck,
    title: "Certificado de Cualificación Individual",
    text: "Contamos en plantilla con personal que posee este certificado personal, que acredita la capacidad técnica para firmar boletines y legalizar instalaciones.",
  },
  {
    Icon: Landmark,
    title: "Inscripción en el Registro y en el IAE",
    text: "Estamos dados de alta en el Registro de Empresas Instaladoras Eléctricas de la Comunitat Valenciana y en el Impuesto de Actividades Económicas correspondiente a nuestra actividad.",
  },
  {
    Icon: ShieldCheck,
    title: "Medios técnicos y seguro de responsabilidad civil",
    text: "Disponemos de las herramientas y equipos de medida exigidos por la ITC-BT-03, junto con un seguro de responsabilidad civil que cubre cada instalación que ejecutamos.",
  },
];

const ALTA_TENSION: Item[] = [
  {
    Icon: FileCheck,
    title: "Autorizaciones administrativas",
    text: "Para instalaciones de alta tensión, presentamos ante la administración competente la documentación técnica, legal y económica que exige cada proyecto.",
  },
  {
    Icon: Stamp,
    title: "Certificados de puesta en servicio",
    text: "Emitimos los certificados oficiales de instalación eléctrica firmados por técnico titulado competente, con la inspección inicial de un Organismo de Control cuando es preceptiva.",
  },
  {
    Icon: HardHat,
    title: "Instalaciones temporales de obra",
    text: "Las instalaciones provisionales para casetas de obra cumplen la ITC-BT-33, con las protecciones frente a contactos que exige la normativa.",
  },
];

const ALTAS_ADMINISTRATIVAS: Item[] = [
  {
    Icon: Users,
    title: "Alta en Seguridad Social",
    text: "Cada profesional de nuestro equipo está dado de alta según su relación laboral, considerando las condiciones particulares de cada puesto.",
  },
  {
    Icon: ClipboardList,
    title: "Alta en obligaciones tributarias",
    text: "Nuestra actividad está dada de alta en el epígrafe correspondiente a instalaciones eléctricas, con el régimen de tributación que le corresponde.",
  },
];

const OBRA: Item[] = [
  {
    Icon: Building2,
    title: "Registro de Empresas Acreditadas (REA)",
    text: "Exigido por la Ley 32/2006 a toda empresa que actúa como contratista o subcontratista en obras de construcción: acredita solvencia, medios propios y formación en PRL de la plantilla.",
  },
  {
    Icon: ClipboardCheck,
    title: "Coordinación de Actividades Empresariales (CAE)",
    text: "Antes de acceder a obra, acreditamos ante la constructora el alta en el REA, estar al corriente con Hacienda y Seguridad Social, el plan de seguridad, el seguro de responsabilidad civil y, por cada trabajador, contrato, alta, formación preventiva y reconocimiento médico vigente.",
  },
  {
    Icon: Award,
    title: "Tarjeta Profesional de la Construcción (TPC)",
    text: "El personal que accede a obra dispone de esta tarjeta, emitida por la Fundación Laboral de la Construcción, que acredita formación PRL específica del sector y reconocimiento médico vigente.",
  },
  {
    Icon: ScrollText,
    title: "Evaluación de riesgos y PRL propia",
    text: "Mantenemos nuestra propia evaluación de riesgos y plan de prevención (Ley 31/1995), base de la documentación que se presenta en cada obra.",
  },
];

function Block({ Icon, title, text }: Item) {
  return (
    <div className="card-tech card-tech-interactive h-full p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand text-white">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{text}</p>
    </div>
  );
}

function Grid({ items }: { items: Item[] }) {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 80}>
          <Block {...item} />
        </Reveal>
      ))}
    </div>
  );
}

function RequisitosLegalesPage() {
  const company = Route.useLoaderData();

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Requisitos legales" }]} />
        }
        kicker="// marco normativo"
        title="Contamos con los requisitos para realizar tu instalación eléctrica"
        subtitle="Operamos dentro del marco legal completo del sector: habilitación técnica, altas administrativas y, en obra, homologación como subcontratistas."
      />

      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// baja tensión" title="Requisitos para baja tensión">
              Lo exigido por el Reglamento Electrotécnico de Baja Tensión para poder legalizar y
              firmar instalaciones.
            </SectionHeading>
          </Reveal>
          <Grid items={BAJA_TENSION} />
        </div>
      </section>

      <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              kicker="// alta tensión"
              title="Requisitos para alta tensión y proyectos específicos"
            >
              Documentación y certificados adicionales que exigen las instalaciones de mayor
              envergadura.
            </SectionHeading>
          </Reveal>
          <Grid items={ALTA_TENSION} />
        </div>
      </section>

      <section className="theme-light border-t border-line bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading kicker="// altas administrativas" title="Altas administrativas">
              La base legal que sustenta nuestra actividad como empresa.
            </SectionHeading>
          </Reveal>
          <Grid items={ALTAS_ADMINISTRATIVAS} />
        </div>
      </section>

      <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              kicker="// trabajo en obra"
              title="Homologación como subcontratistas de obra"
            >
              Cuando trabajamos para constructoras, además de lo anterior acreditamos esta
              documentación específica de acceso a obra.
            </SectionHeading>
          </Reveal>
          <Grid items={OBRA} />
        </div>
      </section>

      <CtaBand title="¿Tienes un proyecto que requiera esta homologación?">
        <Link to="/contacto" className="btn-accent px-8 py-4 text-base">
          Solicitar consulta
        </Link>
      </CtaBand>
    </PageShell>
  );
}
