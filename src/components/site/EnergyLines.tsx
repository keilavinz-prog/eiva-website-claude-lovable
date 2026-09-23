/** Fondo animado del hero: pistas de circuito con pulsos de energía (SVG + CSS, sin librerías). */
const TRACES = [
  "M-20 140 H260 L320 200 H620 L680 140 H1220",
  "M-20 320 H140 L200 380 H520 L560 340 H900 L960 400 H1220",
  "M-20 560 H300 L360 500 H700 L760 560 H1220",
  "M-20 700 H420 L480 640 H820 L880 700 H1220",
  "M180 -20 V120 L240 180 V520 L180 580 V820",
  "M1000 -20 V240 L940 300 V600 L1000 660 V820",
];

const NODES = [
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

export function EnergyLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-blueprint absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="var(--eeiva-border)" strokeWidth="1.25">
          {TRACES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g stroke="var(--eeiva-cyan)" strokeWidth="2" strokeLinecap="round">
          {TRACES.map((d, i) => (
            <path
              key={`p-${d}`}
              d={d}
              pathLength={1000}
              className="energy-pulse"
              style={{
                animationDelay: `${i * -1.3}s`,
                filter: "drop-shadow(0 0 6px rgb(0 217 255 / 0.8))",
              }}
            />
          ))}
        </g>
        <g>
          {NODES.map(([cx, cy], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="var(--eeiva-bg)"
              stroke={i % 4 === 0 ? "var(--eeiva-amber)" : "var(--eeiva-cyan)"}
              strokeWidth="1.5"
              className="glow-breathe"
              style={{ animationDelay: `${i * -0.7}s` }}
            />
          ))}
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base" />
    </div>
  );
}
