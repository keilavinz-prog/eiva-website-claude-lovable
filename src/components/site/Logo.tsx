/** Logotipo textual: EEIVA con la V en cian eléctrico. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-xl font-bold tracking-tight text-text ${className}`}
      aria-label="EEIVA"
    >
      EEI<span className="text-electric [text-shadow:0_0_14px_rgb(0_217_255/0.55)]">V</span>A
    </span>
  );
}
