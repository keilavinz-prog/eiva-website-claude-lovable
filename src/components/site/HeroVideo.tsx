import { useEffect, useRef, useState } from "react";
import type { BackgroundVideo } from "@/lib/media";

const SLIDE_MS = 7000;

/** Fondo de vídeo a pantalla completa que rota entre clips con fundido. */
export function HeroVideo({ videos }: { videos: BackgroundVideo[] }) {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  // Rotación automática
  useEffect(() => {
    if (reduced || videos.length < 2) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % videos.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [active, reduced, videos.length]);

  // Reproduce solo el clip activo y precarga el siguiente
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      const next = (active + 1) % videos.length;
      if (i === active) {
        v.preload = "auto";
        if (!reduced) void v.play().catch(() => undefined);
      } else {
        v.preload = i === next ? "auto" : "none";
        v.pause();
      }
    });
  }, [active, reduced, videos.length]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-canvas">
      {videos.map((video, i) => (
        <video
          key={video.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
          autoPlay={i === 0 && !reduced}
          preload={i === 0 ? "auto" : "none"}
          poster={video.poster}
        >
          {video.sources.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
      ))}
      {/* Capas para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/90 via-canvas/55 to-canvas/20" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-canvas" />

      {/* Indicador de clips */}
      <div className="pointer-events-auto absolute right-5 bottom-8 left-5 mx-auto flex max-w-7xl gap-3 sm:right-8 sm:left-8">
        {videos.map((video, i) => (
          <button
            key={video.id}
            type="button"
            tabIndex={-1}
            onClick={() => setActive(i)}
            className="group flex-1 text-left"
          >
            <span className="block h-0.5 overflow-hidden rounded-full bg-text/20">
              <span
                className={`block h-full bg-electric ${
                  i === active
                    ? reduced
                      ? "w-full"
                      : "animate-[hero-progress_7s_linear_forwards]"
                    : i < active
                      ? "w-full"
                      : "w-0"
                }`}
              />
            </span>
            <span
              className={`mt-2 hidden font-mono text-[0.6875rem] transition-colors sm:block ${
                i === active ? "text-text" : "text-text-muted group-hover:text-text"
              }`}
            >
              {video.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
