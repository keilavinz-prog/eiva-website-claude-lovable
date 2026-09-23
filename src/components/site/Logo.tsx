/** Logotipo textual EEIVA con los colores del logo oficial (se adapta a fondo claro/oscuro). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-xl font-bold tracking-tight ${className}`}
      aria-label="EEIVA"
    >
      <span className="text-logo-purple">E</span>
      <span className="text-logo-gray">E</span>
      <span className="text-brand-yellow">I</span>
      <span className="text-logo-gray">V</span>
      <span className="text-logo-purple">A</span>
    </span>
  );
}
