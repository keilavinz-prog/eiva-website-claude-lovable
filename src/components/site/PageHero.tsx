import type { ReactNode } from "react";
import { EnergyLines } from "./EnergyLines";

/** Cabecera de sección interior con el estilo espacial (rejilla + líneas de energía). */
export function PageHero({
  kicker,
  title,
  subtitle,
  breadcrumb,
  children,
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="theme-space relative isolate overflow-hidden bg-canvas pt-16">
      <EnergyLines />
      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        {breadcrumb}
        {kicker ? <p className="mt-6 font-mono text-xs text-electric">{kicker}</p> : null}
        <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-bold text-text sm:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
