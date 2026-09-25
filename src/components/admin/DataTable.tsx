import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

/** Tabla del panel con esqueleto de carga y estado vacío. */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  isLoading,
  error,
  empty,
  onRowClick,
  rowClassName,
}: {
  columns: Column<T>[];
  rows: T[] | undefined;
  isLoading: boolean;
  error?: string | null;
  empty: ReactNode;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string | undefined;
}) {
  if (error) {
    return (
      <div role="alert" className="card-tech border-danger/40 p-6 text-sm text-text">
        {error}
      </div>
    );
  }

  if (!isLoading && rows && rows.length === 0) {
    return (
      <div className="card-tech flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Inbox className="h-8 w-8 text-electric" aria-hidden="true" />
        <div className="text-text-muted">{empty}</div>
      </div>
    );
  }

  return (
    <div className="card-tech overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-wider text-text-muted uppercase ${c.className ?? ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading || !rows
            ? Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="border-b border-line last:border-b-0">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-surface-elevated" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-line transition-colors last:border-b-0 hover:bg-surface-elevated/60 ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${rowClassName?.(row) ?? ""}`}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 align-middle text-text ${c.className ?? ""}`}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
