import { useEffect, useRef } from "react";
import type { BackgroundVideo } from "@/lib/media";

/** Vídeo de fondo en bucle que solo se carga y reproduce cuando entra en pantalla. */
export function VideoBackground({
  video,
  overlay = "bg-canvas/75",
}: {
  video: BackgroundVideo;
  overlay?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.preload = "auto";
          void el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster={video.poster}
      >
        {video.sources.map((src) => (
          <source key={src} src={src} type="video/mp4" />
        ))}
      </video>
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
}
