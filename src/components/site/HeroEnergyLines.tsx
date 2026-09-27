/**
 * Variante de EnergyLines exclusiva del hero de portada: las mismas pistas de
 * circuito con pulsos de energía, pero trazadas formando la palabra "EEIVA".
 * Contraste del trazo base más alto que en EnergyLines (que es puramente
 * abstracto) para que la palabra se lea como marca de agua tras el titular.
 * No se toca EnergyLines.tsx: esa se sigue usando tal cual en el resto de páginas.
 */
const WORD_TRACES = [
  // conectores de entrada/salida, a modo de "pistas" que llegan de fuera de plano
  "M-20,400 H290",
  "M910,400 H1220",
  // E
  "M290,240 L290,560 M290,240 L380,240 M290,400 L365,400 M290,560 L380,560",
  // E
  "M420,240 L420,560 M420,240 L510,240 M420,400 L495,400 M420,560 L510,560",
  // I
  "M580,240 L580,560 M550,240 L610,240 M550,560 L610,560",
  // V
  "M650,240 L705,560 L760,240",
  // A
  "M800,560 L855,240 L910,560 M822,430 L888,430",
];

const WORD_NODES: Array<[number, number]> = [
  [290, 240],
  [290, 560],
  [420, 240],
  [510, 560],
  [580, 240],
  [580, 560],
  [705, 560],
  [855, 240],
  [822, 430],
  [888, 430],
];

export function HeroEnergyLines({ fade = true }: { fade?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-blueprint absolute inset-0 opacity-50 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="var(--eeiva-text-muted)" strokeWidth="2.25" strokeLinecap="round" opacity="0.5">
          {WORD_TRACES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g strokeWidth="2.25" strokeLinecap="round">
          {WORD_TRACES.map((d, i) => {
            const color = i % 2 === 0 ? "var(--eeiva-pulse)" : "var(--eeiva-pulse-alt)";
            return (
              <path
                key={`p-${d}`}
                d={d}
                pathLength={1000}
                stroke={color}
                className="energy-pulse"
                style={{
                  animationDelay: `${i * -1.3}s`,
                  filter: `drop-shadow(0 0 6px ${color})`,
                }}
              />
            );
          })}
        </g>
        <g>
          {WORD_NODES.map(([cx, cy], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="var(--eeiva-bg)"
              stroke={i % 3 === 0 ? "var(--eeiva-pulse)" : "var(--eeiva-pulse-alt)"}
              strokeWidth="1.5"
              className="glow-breathe"
              style={{ animationDelay: `${i * -0.7}s` }}
            />
          ))}
        </g>
      </svg>
      {fade ? (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
      ) : null}
    </div>
  );
}
