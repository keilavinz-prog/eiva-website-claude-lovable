import { useEffect, useState } from "react";

/**
 * Variante de EnergyLines exclusiva del hero de portada: dos capas.
 *
 * 1) Fondo (BG_TRACES/BG_NODES): el MISMO patrón de circuito que usa
 *    EnergyLines.tsx en el resto del sitio, sin recortar — cubre toda la
 *    pantalla, con sus pulsos de energía animados, y NUNCA desaparece.
 *    No se toca EnergyLines.tsx.
 *
 * 2) Cinco pistas adicionales (LETTER_MORPHS) que SÍ son parte del mismo
 *    circuito (misma pinta, mismo pulso) pero que, en bucle, viajan desde una
 *    posición dispersa por la pantalla ("circuit") hasta trazar cada letra de
 *    "EEIVA" ("letter"), en la mitad derecha del viewBox — fuera de la columna
 *    del texto del hero. Mientras están formadas (5 s), se ilumina encima un
 *    trazo fijo más grueso con los colores reales del logo (mismas variables
 *    que usa Logo.tsx); después se apaga y la pista original vuelve a viajar
 *    a su posición de circuito disperso. Ciclo de 12 s, en bucle continuo.
 *    Con prefers-reduced-motion, las pistas se quedan fijas en su posición de
 *    circuito y nunca llegan a formar letras (sin movimiento llamativo).
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

type LetterMorph = {
  /** Forma dispersa, indistinguible de una pista de circuito cualquiera. */
  circuit: string;
  /** Forma final, trazando la letra. */
  letter: string;
  /** Color fijo del logo para esta letra (mismas variables que Logo.tsx). */
  color: string;
  /** Nodos (esquinas) de la letra, solo visibles mientras está formada. */
  nodes: Array<[number, number]>;
};

const LETTER_MORPHS: LetterMorph[] = [
  {
    // E
    circuit: "M50,150 L50,260 M420,40 L500,40 M90,600 L160,600 M1130,140 L1130,230",
    letter: "M760,300 L760,500 M760,300 L815,300 M760,400 L806,400 M760,500 L815,500",
    color: "var(--eeiva-logo-purple)",
    nodes: [
      [760, 300],
      [760, 500],
    ],
  },
  {
    // E
    circuit: "M20,420 L20,500 M300,700 L380,700 M620,700 L620,760 M1170,480 L1170,560",
    letter: "M848,300 L848,500 M848,300 L903,300 M848,400 L894,400 M848,500 L903,500",
    color: "var(--eeiva-logo-gray)",
    nodes: [
      [848, 300],
      [848, 500],
    ],
  },
  {
    // I
    circuit: "M250,250 L250,330 M680,60 L700,60 M1180,380 L1180,420",
    letter: "M945,300 L945,500 M936,300 L954,300 M936,500 L954,500",
    color: "var(--color-brand-yellow)",
    nodes: [
      [945, 300],
      [945, 500],
    ],
  },
  {
    // V
    circuit: "M70,480 L150,540 L230,470",
    letter: "M987,300 L1020,500 L1052,300",
    color: "var(--eeiva-logo-gray)",
    nodes: [
      [987, 300],
      [1052, 300],
      [1020, 500],
    ],
  },
  {
    // A
    circuit: "M880,70 L950,130 L1020,70 M40,720 L120,720",
    letter: "M1085,500 L1118,300 L1150,500 M1098,420 L1137,420",
    color: "var(--eeiva-logo-purple)",
    nodes: [
      [1118, 300],
      [1098, 420],
      [1137, 420],
    ],
  },
];

// Ciclo de 12 s: 0-4 s disperso · 4-5,5 s viaja a la letra · 5,5-10,5 s formada (5 s) · 10,5-12 s vuelve a dispersarse.
const CYCLE_DUR = "12s";
const CYCLE_KEYTIMES = "0;0.333;0.458;0.875;1";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function HeroEnergyLines({ fade = true }: { fade?: boolean }) {
  const reducedMotion = usePrefersReducedMotion();

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

        {/* Pistas que viajan: son circuito disperso casi siempre, y a ratos forman "EEIVA" */}
        {LETTER_MORPHS.map((m, i) => {
          const pulseColor = i % 2 === 0 ? "var(--eeiva-pulse)" : "var(--eeiva-pulse-alt)";
          const dValues = `${m.circuit};${m.circuit};${m.letter};${m.letter};${m.circuit}`;
          return (
            <g key={`morph-${i}`}>
              {/* Layer A: el propio hilo del circuito, viajando (o fijo, si hay movimiento reducido) */}
              <path
                d={m.circuit}
                stroke={pulseColor}
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1000}
                className="energy-pulse"
                style={{
                  animationDelay: `${i * -1.3}s`,
                  filter: `drop-shadow(0 0 6px ${pulseColor})`,
                }}
              >
                {!reducedMotion ? (
                  <animate
                    attributeName="d"
                    values={dValues}
                    keyTimes={CYCLE_KEYTIMES}
                    dur={CYCLE_DUR}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                ) : null}
              </path>

              {/* Layer B: iluminado fijo en el color de marca de esta letra, solo visible al formarse */}
              <path
                d={m.letter}
                stroke={m.color}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0"
                style={{ filter: `drop-shadow(0 0 8px ${m.color})` }}
              >
                {!reducedMotion ? (
                  <animate
                    attributeName="opacity"
                    values="0;0;1;1;0"
                    keyTimes={CYCLE_KEYTIMES}
                    dur={CYCLE_DUR}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                ) : null}
              </path>
              {m.nodes.map(([nx, ny], ni) => (
                <circle
                  key={`mn-${i}-${ni}`}
                  cx={nx}
                  cy={ny}
                  r="4.25"
                  fill="var(--eeiva-bg)"
                  stroke={m.color}
                  strokeWidth="2"
                  opacity="0"
                >
                  {!reducedMotion ? (
                    <animate
                      attributeName="opacity"
                      values="0;0;1;1;0"
                      keyTimes={CYCLE_KEYTIMES}
                      dur={CYCLE_DUR}
                      repeatCount="indefinite"
                      calcMode="linear"
                    />
                  ) : null}
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      {fade ? (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
      ) : null}
    </div>
  );
}
