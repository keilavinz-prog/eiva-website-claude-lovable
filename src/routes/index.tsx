import { createFileRoute } from "@tanstack/react-router";

const NAV_ITEMS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sección 1", href: "#seccion-1" },
  { label: "Sección 2", href: "#seccion-2" },
  { label: "Contacto", href: "#contacto" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Plantilla web básica | Página de inicio",
      },
      {
        name: "description",
        content:
          "Plantilla web básica de una sola página, en español, con estructura neutra, secciones de relleno y diseño adaptable a cualquier dispositivo.",
      },
      { property: "og:title", content: "Plantilla web básica" },
      {
        property: "og:description",
        content:
          "Estructura de una sola página en español, con textos de relleno y diseño neutro listo para personalizar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Cabecera />
      <main className="flex-1">
        <Inicio />
        <Seccion
          id="seccion-1"
          numero="Sección 1"
          titulo="Título de la Sección 1"
          parrafo="Este es un párrafo de relleno que muestra el espacio que ocupará el contenido definitivo. Sustituye este texto por tu descripción y ajusta la longitud del bloque según lo necesites."
        />
        <Seccion
          id="seccion-2"
          numero="Sección 2"
          titulo="Título de la Sección 2"
          parrafo="Este es un párrafo de relleno que muestra el espacio que ocupará el contenido definitivo. Sustituye este texto por tu descripción y ajusta la longitud del bloque según lo necesites."
        />
        <Contacto />
      </main>
      <Pie />
    </div>
  );
}

function Cabecera() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4">
        <a
          href="#inicio"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Tu logo
        </a>
        <nav aria-label="Navegación principal">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Inicio() {
  return (
    <section id="inicio" className="border-b border-border bg-surface">
      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Sección de inicio
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Título principal
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Este es un párrafo de relleno. Sirve para visualizar el espacio que
          ocupará el mensaje principal de tu web y el contraste tipográfico
          sobre el fondo. Reemplázalo por tu propio texto.
        </p>
        <div className="mt-8">
          <a
            href="#contacto"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Botón de ejemplo
          </a>
        </div>
      </div>
    </section>
  );
}

function Seccion({
  id,
  numero,
  titulo,
  parrafo,
}: {
  id: string;
  numero: string;
  titulo: string;
  parrafo: string;
}) {
  return (
    <section id={id} className="border-b border-border">
      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {numero}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {titulo}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {parrafo}
        </p>
        <div
          aria-hidden="true"
          className="mt-8 min-h-56 rounded-lg border-2 border-dashed border-border bg-placeholder/60 sm:min-h-64"
        />
      </div>
    </section>
  );
}

function Contacto() {
  return (
    <section id="contacto" className="bg-surface">
      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Contacto
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Título de Contacto
        </h2>
        <div
          aria-hidden="true"
          className="mt-8 min-h-64 rounded-lg border border-border bg-background sm:min-h-72"
        />
      </div>
    </section>
  );
}

function Pie() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 text-sm text-muted-foreground">
        © 2026 — Nombre de la empresa
      </div>
    </footer>
  );
}
