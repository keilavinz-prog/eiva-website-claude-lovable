import { Reveal } from "@/components/site/Reveal";

export function DashboardWelcome({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <Reveal>
      <p className="font-mono text-xs text-electric">// panel</p>
      <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
        Hola, {name} <span aria-hidden="true">👋</span>
      </h1>
      <p className="mt-3 text-lg text-text-muted">{subtitle}</p>
    </Reveal>
  );
}
