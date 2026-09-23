import { SearchX } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card-tech flex flex-col items-center gap-3 px-6 py-16 text-center">
      <SearchX className="h-8 w-8 text-electric" aria-hidden="true" />
      <p className="text-text-muted">{message}</p>
    </div>
  );
}
