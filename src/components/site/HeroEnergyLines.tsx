/**
 * Variante de EnergyLines exclusiva del hero de portada: las mismas pistas de
 * circuito con pulsos de energía, pero trazadas formando la palabra "EEIVA".
 * Contraste del trazo base más alto que en EnergyLines (que es puramente
 * abstracto) para que la palabra se lea como marca de agua tras el titular.
 *
 * La palabra se sitúa en la mitad DERECHA del viewBox (x 760-1150), fuera de la
 * columna donde cae el texto del hero (título + subtítulo + botones, que ocupan
 * la mitad izquierda): si se centra en medio del viewBox, el texto la tapa casi
 * por completo y solo se ven fragmentos sueltos, que es lo que pasaba antes.
 *
 * No se toca EnergyLines.tsx: esa se sigue usando tal cual en el resto de páginas.
 */
const WORD_TRACES = [
  // conector de entrada, a modo de "pista" que llega de fuera de plano hasta la E
  "M-20,400 H760",
  // conector de salida, tras la A
  "M1150,400 H1220",
  // E
  "M760,240 L760,560 M760,240 L815,240 M760,400 L806,400 M760,560 L815,560",
  // E
  "M848,240 L848,560 M848,240 L903,240 M848,400 L894,400 M848,560 L903,560",
  // I
  "M945,240 L945,560 M936,240 L954,240 M936,560 L954,560",
  // V
  "M987,240 L1020,560 L1052,240",
  // A
  "M1085,560 L1118,240 L1150,560 M1098,430 L1137,430",
];

const WORD_NODES: Array<[number, number]> = [
  [760, 240],
  [760, 560],
  [848, 240],
  [848, 560],
  [945, 240],
  [945, 560],
  [987, 240],
  [1052, 240],
  [1020, 560],
  [1118, 240],
  [1137, 430],
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
