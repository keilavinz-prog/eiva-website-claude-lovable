import { useState } from "react";
import { Zap } from "lucide-react";

/** Imagen con alternativa visual (rejilla + icono) si la URL falla. */
export function SafeImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-blueprint flex items-center justify-center ${className}`}
      >
        <Zap className="h-10 w-10 text-electric/60" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
