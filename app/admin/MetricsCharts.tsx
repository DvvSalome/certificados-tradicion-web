import type { Metrics } from '@/lib/admin';
import { formatCOP } from '@/lib/config';

// Gráficas de barras (serie única) de los últimos 14 días. Barras CSS finas con punta redondeada, eje base
// discreto, etiqueta directa solo en el máximo, tooltip nativo por barra. Sin librería de charts (dataviz).
const dayLabel = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
};

function BarChart({ data, color, fmt, unit }: { data: { date: string; value: number }[]; color: string; fmt: (v: number) => string; unit: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div>
      <div className="flex h-28 items-end gap-[3px]">
        {data.map((d, i) => {
          const h = d.value > 0 ? Math.max(4, Math.round((d.value / max) * 100)) : 0;
          const isMax = d.value === max && d.value > 0;
          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: '100%' }}>
              {isMax && <span className="mb-0.5 whitespace-nowrap text-[9px] font-bold" style={{ color }}>{fmt(d.value)}</span>}
              <div
                className="w-full rounded-t-[4px] transition-opacity group-hover:opacity-80"
                style={{ height: `${h}%`, minHeight: d.value > 0 ? 4 : 0, background: color }}
                title={`${d.date} · ${fmt(d.value)} ${unit}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-between border-t border-[var(--border)] pt-1.5 text-[10px] text-[var(--muted-2)]">
        <span>{dayLabel(data[0]?.date ?? '')}</span>
        <span>{dayLabel(data[Math.floor(data.length / 2)]?.date ?? '')}</span>
        <span>hoy</span>
      </div>
    </div>
  );
}

export default function MetricsCharts({ m }: { m: Metrics }) {
  if (!m.daily.length) return null;
  const revenue = m.daily.map((d) => ({ date: d.date, value: d.revenueCents }));
  const certs = m.daily.map((d) => ({ date: d.date, value: d.certs }));
  const fmtCop = (c: number) => formatCOP(Math.round(c / 100));

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Ingresos · últimos 14 días</h2>
          <span className="text-[12px] font-semibold text-[var(--brand)]">{fmtCop(m.totalRevenue14)}</span>
        </div>
        <BarChart data={revenue} color="var(--brand)" fmt={fmtCop} unit="entregados" />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Certificados · últimos 14 días</h2>
          <span className="text-[12px] font-semibold text-[var(--accent)]">
            {m.totalCerts14} · {m.successRate === null ? 'sin datos' : `${m.successRate}% éxito`}
          </span>
        </div>
        <BarChart data={certs} color="var(--accent)" fmt={(v) => String(v)} unit="certificados" />
      </div>
    </section>
  );
}
