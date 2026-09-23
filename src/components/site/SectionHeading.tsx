import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs text-electric">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold text-text sm:text-4xl">{title}</h2>
      {children ? (
        <p className="mt-4 text-base leading-relaxed text-text-muted">{children}</p>
      ) : null}
    </div>
  );
}
