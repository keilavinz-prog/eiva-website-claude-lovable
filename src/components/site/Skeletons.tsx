function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-elevated ${className}`} />;
}

/** Esqueleto de página mientras llegan los datos (sin spinner bloqueante). */
export function PageSkeleton({ variant = "grid" }: { variant?: "grid" | "detail" | "form" }) {
  return (
    <div className="min-h-screen bg-canvas" aria-busy="true" aria-label="Cargando">
      <div className="theme-space bg-canvas pt-16">
        <div className="mx-auto max-w-7xl px-5 pt-20 pb-24 sm:px-8">
          <Bar className="h-3 w-40" />
          <Bar className="mt-6 h-12 w-3/4 max-w-2xl" />
          <Bar className="mt-4 h-5 w-1/2 max-w-xl" />
        </div>
      </div>
      <div className="theme-light bg-canvas py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {variant === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="card-tech p-6">
                  <Bar className="h-40 w-full" />
                  <Bar className="mt-5 h-5 w-2/3" />
                  <Bar className="mt-3 h-4 w-full" />
                  <Bar className="mt-2 h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : variant === "detail" ? (
            <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
              <div>
                <Bar className="aspect-[16/10] w-full" />
                <Bar className="mt-6 h-4 w-full" />
                <Bar className="mt-3 h-4 w-11/12" />
                <Bar className="mt-3 h-4 w-4/5" />
              </div>
              <Bar className="h-72 w-full" />
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
              <div className="space-y-5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Bar key={i} className="h-12 w-full" />
                ))}
              </div>
              <Bar className="h-80 w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
