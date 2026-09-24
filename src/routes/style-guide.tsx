import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Logo } from "@/components/site/Logo";

/** Página interna de verificación visual. No enlazada en la navegación pública. */
export const Route = createFileRoute("/style-guide")({
  head: () => ({
    meta: [{ title: "Guía de estilo | EEIVA" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: StyleGuide,
});

const COLORS = [
  { name: "Morado (marca)", token: "--eeiva-purple", hex: "#4430A1" },
  { name: "Gris (marca)", token: "--eeiva-gray", hex: "#5F5F68" },
  { name: "Amarillo (marca)", token: "--eeiva-yellow", hex: "#F2BA02" },
  { name: "Fondo oscuro", token: "--eeiva-bg", hex: "#14122B" },
  { name: "Superficie oscura", token: "--eeiva-surface", hex: "#1C1936" },
  { name: "Borde oscuro", token: "--eeiva-border", hex: "#332E5C" },
  { name: "Texto claro", token: "--eeiva-text", hex: "#F7F6FB" },
  { name: "Texto secundario", token: "--eeiva-text-muted", hex: "#B3AFCB" },
  { name: "Éxito", token: "--eeiva-success", hex: "#00C853" },
  { name: "Peligro", token: "--eeiva-danger", hex: "#FF3B5C" },
];

const RADII = [
  { name: "sm", cls: "rounded-sm", value: "6px" },
  { name: "md", cls: "rounded-md", value: "12px" },
  { name: "lg", cls: "rounded-lg", value: "20px" },
  { name: "full", cls: "rounded-full", value: "999px" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12">
      <h2 className="font-mono text-xs text-electric">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function StyleGuide() {
  return (
    <div className="bg-blueprint min-h-screen text-text">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Logo className="text-3xl" />
        <h1 className="mt-6 text-4xl font-bold">Guía de estilo</h1>
        <p className="mt-3 max-w-xl text-text-muted">
          Verificación visual de los tokens con la paleta del logo EEIVA. Uso interno.
        </p>

        <Block title="Paleta">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {COLORS.map((c) => (
              <div key={c.token} className="card-tech overflow-hidden">
                <div
                  className="h-20 border-b border-line"
                  style={{ background: `var(${c.token})` }}
                />
                <div className="p-3">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="mt-1 font-mono text-xs text-text-muted">{c.hex}</p>
                  <p className="font-mono text-[0.625rem] text-text-muted">{c.token}</p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Tipografía">
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs text-text-muted">Space Grotesk 700 · H1</p>
              <p className="font-display text-5xl font-bold">Energía que conecta</p>
            </div>
            <div>
              <p className="font-mono text-xs text-text-muted">Space Grotesk 600 · H2</p>
              <p className="font-display text-3xl font-semibold">Servicios destacados</p>
            </div>
            <div>
              <p className="font-mono text-xs text-text-muted">Inter 400 / 500 · Body</p>
              <p className="max-w-2xl text-base text-text-muted">
                Proyectos e instalaciones de baja tensión para vivienda, comercio e industria con
                máxima garantía normativa.
              </p>
              <p className="mt-2 text-base font-medium">Texto de cuerpo en peso 500.</p>
            </div>
            <div>
              <p className="font-mono text-xs text-text-muted">JetBrains Mono · Datos</p>
              <p className="font-mono text-2xl text-electric">250 kW · 90 kWp · CIE</p>
            </div>
          </div>
        </Block>

        <Block title="Botones">
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="btn-primary px-7 py-3.5">
              Solicitar consulta
            </button>
            <button type="button" className="btn-secondary px-7 py-3.5">
              Ver Proyectos
            </button>
            <button type="button" className="btn-accent px-7 py-3.5">
              Contactar ahora
            </button>
            <span className="badge-amber">Industrial</span>
          </div>
        </Block>

        <Block title="Tarjetas">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-tech p-6">
              <p className="font-display font-semibold">Tarjeta estática</p>
              <p className="mt-2 text-sm text-text-muted">Superficie + borde + elevación.</p>
            </div>
            <div className="card-tech card-tech-interactive p-6">
              <Zap className="h-6 w-6 text-electric" />
              <p className="mt-3 font-display font-semibold">Tarjeta interactiva</p>
              <p className="mt-2 text-sm text-text-muted">Pasa el ratón: scale + brillo morado.</p>
            </div>
            <div className="rounded-md border border-line bg-surface-elevated p-6 shadow-elevated">
              <p className="font-display font-semibold">Superficie elevada</p>
              <p className="mt-2 text-sm text-text-muted">Para modales y popovers.</p>
            </div>
          </div>
        </Block>

        <Block title="Sección clara (.theme-light)">
          <div className="theme-light rounded-lg bg-canvas p-8">
            <Logo className="text-2xl" />
            <p className="mt-4 font-display text-2xl font-semibold text-text">
              Servicios destacados
            </p>
            <p className="mt-2 text-text-muted">Texto secundario en gris de marca.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button type="button" className="btn-primary px-6 py-3">
                Solicitar consulta
              </button>
              <button type="button" className="btn-secondary px-6 py-3">
                Ver Proyectos
              </button>
            </div>
          </div>
        </Block>

        <Block title="Radios">
          <div className="flex flex-wrap gap-6">
            {RADII.map((r) => (
              <div key={r.name} className="text-center">
                <div className={`h-16 w-16 border border-electric/60 bg-surface ${r.cls}`} />
                <p className="mt-2 font-mono text-xs text-text-muted">
                  {r.name} · {r.value}
                </p>
              </div>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}
