/**
 * Variante de EnergyLines exclusiva del hero de portada: dos capas.
 *
 * 1) Fondo (BG_TRACES/BG_NODES): el MISMO patrón de circuito que usa
 *    EnergyLines.tsx en el resto del sitio, sin recortar — cubre toda la
 *    pantalla, con sus pulsos de energía animados, y NUNCA desaparece.
 *    No se toca EnergyLines.tsx.
 * 2) Palabra (WORD_TRACES/WORD_NODES): trazos de circuito gruesos (para que
 *    se lean bien) pero de tamaño modesto, formando "EEIVA" en la mitad
 *    DERECHA del viewBox (x 760-1150) — fuera de la columna donde cae el
 *    texto del hero (título + subtítulo + botones, en la mitad izquierda;
 *    si se centra en medio del viewBox, el texto la tapa casi por completo).
 *    Permanece invisible los primeros segundos y luego aparece una sola vez
 *    (clase .hero-word-reveal, en src/styles.css), quedándose visible.
 */
const BG_TRACES = [
  "M-20 140 H260 L320 200 H620 L680 140 H1220",
  "M-20 320 H140 L200 380 H520 L560 340 H900 L960 400 H1220",
  "M-20 560 H300 L360 500 H700 L760 560 H1220",
  "M-20 700 H420 L480 640 H820 L880 700 H1220",
  "M180 -20 V120 L240 180 V520 L180 580 V820",
  "M1000 -20 V240 L940 300 V600 L1000 660 V820",
];

const BG_NODES: Array<[number, number]> = [
  [320, 200],
  [680, 140],
  [200, 380],
  [560, 340],
  [960, 400],
  [360, 500],
  [760, 560],
  [480, 640],
  [880, 700],
  [240, 180],
  [940, 300],
];

const WORD_TRACES = [
  // E
  "M760,300 L760,500 M760,300 L815,300 M760,400 L806,400 M760,500 L815,500",
  // E
  "M848,300 L848,500 M848,300 L903,300 M848,400 L894,400 M848,500 L903,500",
  // I
  "M945,300 L945,500 M936,300 L954,300 M936,500 L954,500",
  // V
  "M987,300 L1020,500 L1052,300",
  // A
  "M1085,500 L1118,300 L1150,500 M1098,420 L1137,420",
];

const WORD_NODES: Array<[number, number]> = [
  [760, 300],
  [760, 500],
  [848, 300],
  [848, 500],
  [945, 300],
  [945, 500],
  [987, 300],
  [1052, 300],
  [1020, 500],
  [1118, 300],
  [1137, 420],
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
        {/* Fondo: circuito completo por toda la pantalla, siempre presente */}
        <g stroke="var(--eeiva-border)" strokeWidth="1.25" opacity="0.8">
          {BG_TRACES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g strokeWidth="2" strokeLinecap="round">
          {BG_TRACES.map((d, i) => {
            const color = i % 2 === 0 ? "var(--eeiva-pulse)" : "var(--eeiva-pulse-alt)";
            return (
              <path
                key={`bp-${d}`}
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
          {BG_NODES.map(([cx, cy], i) => (
            <circle
              key={`bn-${cx}-${cy}`}
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

        {/* Palabra "EEIVA": tamaño modesto, trazo grueso, aparece a los 3 s y se queda */}
        <g className="hero-word-reveal">
          <g stroke="var(--eeiva-text-muted)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
            {WORD_TRACES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g strokeWidth="3" strokeLinecap="round">
            {WORD_TRACES.map((d, i) => {
              const color = i % 2 === 0 ? "var(--eeiva-pulse)" : "var(--eeiva-pulse-alt)";
              return (
                <path
                  key={`wp-${d}`}
                  d={d}
                  pathLength={1000}
                  stroke={color}
                  className="energy-pulse"
                  style={{
                    animationDelay: `${i * -1.3}s`,
                    filter: `drop-shadow(0 0 8px ${color})`,
                  }}
                />
              );
            })}
          </g>
          <g>
            {WORD_NODES.map(([cx, cy], i) => (
              <circle
                key={`wn-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="4.25"
                fill="var(--eeiva-bg)"
                stroke={i % 3 === 0 ? "var(--eeiva-pulse)" : "var(--eeiva-pulse-alt)"}
                strokeWidth="2"
                className="glow-breathe"
                style={{ animationDelay: `${i * -0.7}s` }}
              />
            ))}
          </g>
        </g>
      </svg>
      {fade ? (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
      ) : null}
    </div>
  );
}
