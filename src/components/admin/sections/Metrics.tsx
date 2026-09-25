import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartColumn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/admin/api";
import { STATUS_LABEL } from "@/lib/admin/constants";
import {
  byStatus,
  conversionRate,
  requestsByMonth,
  topServices,
  type AppointmentForMetrics,
  type RequestForMetrics,
} from "@/lib/metrics";
import { AdminPage } from "../AdminPage";

/** Mismos colores que los badges de estado (StatusBadge). */
const STATUS_COLOR: Record<string, string> = {
  pendiente: "var(--color-amber)",
  confirmada: "var(--color-success)",
  cancelada: "var(--color-text-muted)",
  completada: "var(--color-logo-purple)",
  nuevo: "var(--color-logo-purple)",
  en_proceso: "var(--color-amber)",
  cerrado: "var(--color-text-muted)",
};
/** Barras: morado de marca (el mismo acento que el badge "nuevo" y el resaltado en vivo). */
const BAR_COLOR = "var(--color-logo-purple)";
const AXIS = { fill: "var(--color-text-muted)", fontSize: 12 };
const tooltipStyle = {
  contentStyle: {
    background: "var(--color-surface-elevated)",
    border: "1px solid var(--color-line)",
    borderRadius: 8,
    color: "var(--color-text)",
  },
  cursor: { fill: "color-mix(in oklab, var(--color-logo-purple) 12%, transparent)" },
};

async function fetchMetricsData() {
  const [req, app] = await Promise.all([
    supabase.from("contact_requests").select("created_at, status, services(title)"),
    supabase.from("appointments").select("status"),
  ]);
  if (req.error) throw new Error(friendlyError(req.error));
  if (app.error) throw new Error(friendlyError(app.error));
  return {
    requests: (req.data ?? []) as RequestForMetrics[],
    appointments: (app.data ?? []) as AppointmentForMetrics[],
  };
}

function ChartCard({
  title,
  loading,
  empty,
  children,
}: {
  title: string;
  loading: boolean;
  empty: string | null;
  children: ReactNode;
}) {
  return (
    <section className="card-tech flex flex-col p-6" aria-label={title}>
      <h2 className="font-semibold text-text">{title}</h2>
      <div className="mt-5 h-72">
        {loading ? (
          <div className="h-full animate-pulse rounded-md bg-surface-elevated" aria-busy="true" />
        ) : empty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line px-6 text-center">
            <ChartColumn className="h-8 w-8 text-electric" aria-hidden="true" />
            <p className="text-sm text-text-muted">{empty}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function Donut({ data }: { data: { status: string; value: number; pct: number }[] }) {
  const visible = data.filter((d) => d.value > 0);
  return (
    <div className="flex h-full flex-col sm:flex-row sm:items-center">
      <div className="h-48 flex-1 sm:h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="status"
              innerRadius="58%"
              outerRadius="85%"
              paddingAngle={visible.length > 1 ? 2 : 0}
              stroke="none"
            >
              {visible.map((d) => (
                <Cell key={d.status} fill={STATUS_COLOR[d.status]} />
              ))}
            </Pie>
            <Tooltip
              {...tooltipStyle}
              formatter={(value: number, name: string) => [value, STATUS_LABEL[name] ?? name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-2 text-sm sm:mt-0 sm:w-48">
        {data.map((d) => (
          <li key={d.status} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: STATUS_COLOR[d.status] }}
              aria-hidden="true"
            />
            <span className="flex-1 text-text">{STATUS_LABEL[d.status] ?? d.status}</span>
            <span className="font-mono text-text-muted">
              {d.value} · {d.pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="card-tech p-5">
      <p className="font-mono text-xs text-text-muted uppercase">{label}</p>
      {value === null ? (
        <div className="mt-3 h-9 w-20 animate-pulse rounded bg-surface-elevated" />
      ) : (
        <p className="mt-2 font-mono text-3xl font-semibold text-text">{value}</p>
      )}
    </div>
  );
}

export function MetricsDashboard() {
  const query = useQuery({ queryKey: ["admin", "metrics"], queryFn: fetchMetricsData });
  const loading = query.isLoading;
  const requests = query.data?.requests ?? [];
  const appointments = query.data?.appointments ?? [];

  const monthly = requestsByMonth(requests);
  const services = topServices(requests);
  const apptStatus = byStatus(appointments, ["pendiente", "confirmada", "cancelada", "completada"]);
  const reqStatus = byStatus(requests, ["nuevo", "en_proceso", "cerrado"]);
  const rate = conversionRate(appointments);

  return (
    <AdminPage
      kicker="// métricas"
      title="Métricas"
      description="Datos reales de solicitudes y citas. Las gráficas aparecen cuando hay datos suficientes."
    >
      {query.error ? (
        <p role="alert" className="card-tech p-6 text-sm text-danger">
          {query.error.message}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-3">
        <Stat
          label="Total solicitudes (histórico)"
          value={loading ? null : String(requests.length)}
        />
        <Stat
          label="Total citas (histórico)"
          value={loading ? null : String(appointments.length)}
        />
        <Stat
          label="Tasa de conversión"
          value={loading ? null : rate === null ? "—" : `${rate.toLocaleString("es-ES")} %`}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Solicitudes por mes"
          loading={loading}
          empty={
            monthly.total === 0
              ? "Todavía no hay suficientes solicitudes en los últimos 6 meses para mostrar esta gráfica."
              : null
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [v, "Solicitudes"]} />
              <Bar dataKey="solicitudes" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Servicios más solicitados"
          loading={loading}
          empty={
            services.length === 0
              ? "Todavía no hay suficientes solicitudes para mostrar esta gráfica."
              : null
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={services}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--color-line)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={AXIS}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="servicio"
                width={150}
                tick={AXIS}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [v, "Solicitudes"]} />
              <Bar dataKey="solicitudes" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Estado de citas"
          loading={loading}
          empty={
            appointments.length === 0
              ? "Todavía no hay suficientes citas para mostrar esta gráfica."
              : null
          }
        >
          <Donut data={apptStatus} />
        </ChartCard>

        <ChartCard
          title="Solicitudes por estado"
          loading={loading}
          empty={
            requests.length === 0
              ? "Todavía no hay suficientes solicitudes para mostrar esta gráfica."
              : null
          }
        >
          <Donut data={reqStatus} />
        </ChartCard>
      </div>
    </AdminPage>
  );
}
