export function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
              active
                ? "border-transparent bg-brand text-white shadow-glow"
                : "border-line bg-canvas text-text-muted hover:border-electric hover:text-text"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
