import { Star } from "lucide-react";

export function StarsDisplay({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-4 w-4 ${i < value ? "fill-amber text-amber" : "text-line"}`}
        />
      ))}
    </span>
  );
}

export function StarsInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Valoración" className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
            onClick={() => onChange(n)}
            className="rounded p-1 transition-transform hover:scale-110"
          >
            <Star className={`h-7 w-7 ${n <= value ? "fill-amber text-amber" : "text-line"}`} />
          </button>
        );
      })}
    </div>
  );
}
