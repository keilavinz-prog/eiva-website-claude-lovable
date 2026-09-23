import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { SafeImage } from "./SafeImage";

/** Galería reutilizable: imagen principal con flechas, miniaturas y visor a pantalla completa. */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + total) % total), [total]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  const current = images[index] ?? images[0] ?? "";

  const arrows = (size: string) =>
    total > 1 ? (
      <>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Imagen anterior"
          className={`absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-ink/60 text-white backdrop-blur transition hover:bg-brand ${size}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Imagen siguiente"
          className={`absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-ink/60 text-white backdrop-blur transition hover:bg-brand ${size}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </>
    ) : null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-line bg-surface-elevated">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block aspect-[16/10] w-full"
          aria-label={`Ampliar imagen ${index + 1} de ${total}`}
        >
          <SafeImage
            key={current}
            src={current}
            alt={`${title} — imagen ${index + 1} de ${total}`}
            loading="eager"
            className="h-full w-full animate-in object-cover duration-500 fade-in"
          />
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 font-mono text-xs text-white backdrop-blur">
            <Expand className="h-3.5 w-3.5" aria-hidden="true" />
            {index + 1} / {total}
          </span>
        </button>
        {arrows("p-2.5")}
      </div>

      {total > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === index}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-20 sm:w-28 ${
                i === index ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <SafeImage src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería: ${title}`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <SafeImage
              key={`lb-${current}`}
              src={current}
              alt={`${title} — imagen ${index + 1} de ${total}`}
              loading="eager"
              className="max-h-[80vh] w-full animate-in rounded-lg object-contain duration-300 fade-in"
            />
            {arrows("p-3")}
            <p className="mt-4 text-center font-mono text-xs text-white/70">
              {index + 1} / {total}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
