import type { ReactNode } from "react";
import { EnergyLines } from "@/components/site/EnergyLines";
import { Header } from "@/components/site/Header";
import { Logo } from "@/components/site/Logo";

/** Página de acceso: fondo espacial con la tarjeta del formulario centrada. */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas text-text">
      <Header />
      <main className="theme-space relative isolate flex min-h-screen items-center overflow-hidden bg-canvas px-5 pt-24 pb-16 sm:px-8">
        <EnergyLines fade={false} />
        <div className="relative mx-auto w-full max-w-md">
          <div className="text-center">
            <Logo className="text-3xl" />
            <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">{title}</h1>
            <p className="mt-3 text-text-muted">{subtitle}</p>
          </div>
          <div className="theme-light card-tech mt-8 bg-canvas p-6 sm:p-8">{children}</div>
          <div className="mt-6 text-center text-sm text-text-muted">{footer}</div>
        </div>
      </main>
    </div>
  );
}
