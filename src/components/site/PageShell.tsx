import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { CompanyInfo } from "@/lib/site-data";

/** Estructura común de las páginas públicas: cabecera + contenido + pie. */
export function PageShell({ company, children }: { company: CompanyInfo; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-text">
      <Header />
      <main>{children}</main>
      <Footer company={company} />
    </div>
  );
}
