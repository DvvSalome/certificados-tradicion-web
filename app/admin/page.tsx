import { redirect } from 'next/navigation';
import { getSession, getDashboard, getMetrics, SALDO_THRESHOLD_CENTS } from '@/lib/admin';
import { formatCOP } from '@/lib/config';
import LogoutButton from './LogoutButton';
import BatchPanel from './BatchPanel';
import MetricsCharts from './MetricsCharts';
import OrderActions from './OrderActions';

export const dynamic = 'force-dynamic';

const fmt = (c: number) => formatCOP(c / 100);
const ago = (iso: string | null) => {
  if (!iso) return '—';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'hace segundos';
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
};

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: 'Pendiente pago', PAID: 'Pagado', GENERATING: 'Generando', DELIVERED: 'Entregado', FAILED: 'Fallido',
};

export default async function AdminDashboard() {
  const role = await getSession();
  if (!role) redirect('/admin/login');
  const [d, metrics] = await Promise.all([getDashboard(), getMetrics()]);

  // Estado del robot: sano si hubo OK reciente y no falló después.
  const robotOk = d.robot.lastOkAt && (!d.robot.lastError || (d.robot.lastOkAt >= (d.robot.lastRunAt ?? '')));
  const robotState = d.robot.lastRunAt ? (d.robot.failToday > 0 && !robotOk ? 'fallo' : 'activo') : 'sin datos';

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold tracking-tight">Panel de control</p>
              <p className="text-[11px] font-medium text-[var(--muted-2)]">Certificado de Tradición</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
              {role === 'superadmin' ? 'Superadmin' : 'Cliente · Alexis'}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8">
        {!d.hasDb && (
          <div className="rounded-xl border border-[#f0d8a8] bg-[#fdf6e8] px-4 py-3 text-[13px] font-medium text-[#8a6d3b]">
            Sin base de datos conectada (modo local). Conecta <code>DATABASE_URL</code> en producción para ver datos reales.
          </div>
        )}

        {/* KPIs */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Saldo prepago SNR"
            value={d.saldoCents === null ? '—' : fmt(d.saldoCents)}
            hint={d.saldoAt ? `actualizado ${ago(d.saldoAt)}` : 'sin reportes'}
            tone={d.saldoLow ? 'danger' : 'brand'}
            alert={d.saldoLow ? `Bajo el umbral (${fmt(SALDO_THRESHOLD_CENTS)})` : undefined}
          />
          <Kpi label="Ganancias (neto)" value={fmt(d.profitCents)} hint={`Ingresos ${fmt(d.revenueCents)} − costo ${fmt(d.costCents)}`} tone="accent" />
          <Kpi label="Certificados generados" value={String(d.certCount)} hint={`${d.robot.okToday} hoy`} />
          <Kpi
            label="Estado del robot"
            value={robotState === 'activo' ? 'Activo' : robotState === 'fallo' ? 'Con fallos' : 'Sin datos'}
            hint={d.robot.lastRunAt ? `última corrida ${ago(d.robot.lastRunAt)}` : '—'}
            tone={robotState === 'fallo' ? 'danger' : robotState === 'activo' ? 'accent' : 'muted'}
            dot
          />
        </section>

        {d.robot.lastError && robotState === 'fallo' && (
          <div className="rounded-xl border border-[#f3c2bd] bg-[#fdecec] px-4 py-3 text-[13px] text-[#b42318]">
            <span className="font-semibold">Último error del robot:</span> {d.robot.lastError}
          </div>
        )}

        {/* Métricas · últimos 14 días */}
        <MetricsCharts m={metrics} />

        {/* Generación en lote */}
        <BatchPanel />

        {/* Pedidos recientes con acciones (reenviar, ver PDF, reintentar) */}
        <Card title="Pedidos recientes" hint={Object.entries(d.ordersByStatus).map(([k, v]) => `${STATUS_LABEL[k] ?? k}: ${v}`).join(' · ') || '0'}>
          {d.recentOrders.length === 0 ? (
            <Empty>Sin pedidos todavía.</Empty>
          ) : (
            <Table head={['Ref', 'Matrícula', 'Estado', 'Valor', 'Acciones']}>
              {d.recentOrders.map((o) => (
                <tr key={o.reference} className="border-t border-[var(--border)] align-top">
                  <Td mono>{o.reference.slice(0, 10)}…</Td>
                  <Td mono>{o.matricula}</Td>
                  <Td><Badge ok={o.status === 'DELIVERED'} warn={o.status === 'FAILED'}>{STATUS_LABEL[o.status] ?? o.status}</Badge></Td>
                  <Td>{fmt(o.amountCents)}</Td>
                  <Td><OrderActions reference={o.reference} status={o.status} hasPdf={o.hasPdf} isSuperadmin={role === 'superadmin'} /></Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        {/* Generaciones recientes (bitácora del robot) */}
        <Card title="Generaciones recientes" hint={`${d.recentGenerations.length}`}>
          {d.recentGenerations.length === 0 ? (
            <Empty>Sin generaciones todavía.</Empty>
          ) : (
            <Table head={['Matrícula', 'Oficina', 'Estado', 'Costo']}>
              {d.recentGenerations.map((g, i) => (
                <tr key={i} className="border-t border-[var(--border)]">
                  <Td mono>{g.matricula}</Td>
                  <Td>{g.oficina}</Td>
                  <Td><Badge ok={g.status === 'OK'}>{g.status === 'OK' ? 'OK' : 'Falló'}</Badge></Td>
                  <Td>{g.costCents === null ? '—' : fmt(g.costCents)}</Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <p className="text-center text-xs text-[var(--muted-2)]">Panel interno · acceso restringido · no compartir el enlace</p>
      </main>
    </div>
  );
}

function Kpi({ label, value, hint, tone = 'default', alert, dot }: { label: string; value: string; hint?: string; tone?: 'default' | 'brand' | 'accent' | 'danger' | 'muted'; alert?: string; dot?: boolean }) {
  const color = tone === 'danger' ? 'var(--accent)' : tone === 'accent' ? 'var(--accent)' : 'var(--brand)';
  const valColor = tone === 'danger' ? '#b42318' : 'var(--foreground)';
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center gap-2">
        {dot && <span className="size-2 rounded-full" style={{ background: tone === 'danger' ? '#b42318' : tone === 'accent' ? 'var(--accent)' : 'var(--muted-2)' }} />}
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">{label}</p>
      </div>
      <p className="mt-2 text-[26px] font-bold tracking-tight" style={{ color: valColor }}>{value}</p>
      {alert ? <p className="mt-1 text-[12px] font-semibold text-[#b42318]">{alert}</p> : hint ? <p className="mt-1 text-[12px] text-[var(--muted)]">{hint}</p> : null}
      <span className="sr-only">{color}</span>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
        {hint && <span className="text-[12px] text-[var(--muted-2)]">{hint}</span>}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-left text-[13px]">
      <thead>
        <tr className="text-[11px] uppercase tracking-wide text-[var(--muted-2)]">
          {head.map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`px-3 py-2.5 ${mono ? 'font-mono text-[12px]' : ''} text-[var(--foreground)]`}>{children}</td>;
}
function Badge({ children, ok, warn }: { children: React.ReactNode; ok?: boolean; warn?: boolean }) {
  const cls = ok ? 'bg-[var(--accent-50)] text-[var(--accent)]' : warn ? 'bg-[#fdecec] text-[#b42318]' : 'bg-[var(--brand-50)] text-[var(--brand)]';
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{children}</span>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-3 py-8 text-center text-[13px] text-[var(--muted-2)]">{children}</p>;
}
