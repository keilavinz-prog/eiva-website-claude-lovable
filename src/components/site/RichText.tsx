import { Check } from "lucide-react";

/**
 * Renderiza texto largo guardado en BD con un formato mínimo:
 * párrafos separados por línea en blanco, "## " para subtítulos y "- " para listas.
 */
export function RichText({ text, lead = false }: { text: string; lead?: boolean }) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 text-lg leading-relaxed text-text-muted">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          const [heading, ...rest] = block.split("\n");
          return (
            <div key={i} className="pt-2">
              <h3 className="text-xl font-semibold text-text">{heading?.slice(3)}</h3>
              {rest.length > 0 ? <List lines={rest} /> : null}
            </div>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return <List key={i} lines={lines} />;
        }
        return (
          <p key={i} className={lead && i === 0 ? "text-xl text-text" : undefined}>
            {block.replace(/\n/g, " ")}
          </p>
        );
      })}
    </div>
  );
}

function List({ lines }: { lines: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {lines
        .map((l) => l.trim().replace(/^- /, ""))
        .filter(Boolean)
        .map((item) => (
          <li key={item} className="flex gap-3 text-base text-text">
            <Check className="mt-1 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
    </ul>
  );
}
