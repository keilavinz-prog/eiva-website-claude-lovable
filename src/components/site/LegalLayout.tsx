import type { ReactNode } from "react";
import type { CompanyInfo } from "@/lib/site-data";
import { PageShell } from "./PageShell";
import { PageHero } from "./PageHero";
import { Breadcrumbs } from "./Breadcrumbs";
import { Reveal } from "./Reveal";

/** Estructura común de las páginas legales. */
export function LegalLayout({
  company,
  title,
  updated,
  children,
}: {
  company: CompanyInfo;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: title }]} />}
        kicker="// legal"
        title={title}
        subtitle={`Última actualización: ${updated}`}
      />
      <section className="theme-light bg-canvas py-16 sm:py-20">
        <div className="legal-prose mx-auto max-w-3xl space-y-10 px-5 text-text sm:px-8">
          {children}
        </div>
      </section>
    </PageShell>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal as="section" fade className="space-y-3 leading-relaxed text-text-muted">
      <h2 className="text-xl font-semibold text-text">{title}</h2>
      {children}
    </Reveal>
  );
}

/** Dato de la empresa; si falta, se muestra como pendiente (visible) en lugar de inventarlo. */
export function CompanyValue({
  value,
  label,
}: {
  value: string | null | undefined;
  label: string;
}) {
  return value ? (
    <>{value}</>
  ) : (
    <span className="rounded bg-amber/15 px-1.5 py-0.5 font-mono text-xs text-amber">
      {label} pendiente de incorporar
    </span>
  );
}
