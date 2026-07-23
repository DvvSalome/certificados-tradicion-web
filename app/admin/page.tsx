import { redirect } from 'next/navigation';
import { getSession, getDashboard, getMetrics, getSnrStatus, getRobotHealth, SALDO_THRESHOLD_CENTS } from '@/lib/admin';
import { formatCOP } from '@/lib/config';
import LogoutButton from './LogoutButton';
import BatchPanel from './BatchPanel';
import AdminGenerar from './AdminGenerar';
import MetricsCharts from './MetricsCharts';
import OrderActions from './OrderActions';
import SaldoRefresh from './SaldoRefresh';
import SnrAccounts from './SnrAccounts';

export const dynamic = 'force-dynamic';

const fmt = (c: number) => formatCOP(c / 100);
// Lo que el SNR cobra por certificado ($23.000). Estaba repetido a mano en dos sitios.
const SNR_COST_CENTS = 2_300_000;
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
  const [d, metrics, snr, health] = await Promise.all([getDashboard(), getMetrics(), getSnrStatus(), getRobotHealth()]);

  // Estado del robot: sano si hubo OK reciente y no falló después.
  const robotOk = d.robot.lastOkAt && (!d.robot.lastError || (d.robot.lastOkAt >= (d.robot.lastRunAt ?? '')));
  const robotState = d.robot.lastRunAt ? (d.robot.failToday > 0 && !robotOk ? 'fallo' : 'activo') : 'sin datos';

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            {/* Logo REAL de la marca (public/brand/logo-horizontal-oscuro.png: sello + nombre,
                versión para fondos claros), no el escudo genérico de antes. */}
            <img src="/brand/logo-horizontal-oscuro.png" alt="Certitradición" className="h-8 w-auto" />
            <span className="h-6 w-px bg-[var(--border)]" aria-hidden />
            <p className="text-[13px] font-semibold tracking-tight text-[var(--muted)]">Panel de control</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--brand-50)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
              Superadmin
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

        {/* SALUD DEL SISTEMA — lo primero que se ve. El estado sale del LATIDO del robot (empuja cada
            10 min), no de si hubo generaciones: así un robot caído se nota aunque no entren pedidos. */}
        <HealthBanner health={health} />

        {/* KPIs */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Saldo prepago SNR"
            value={d.saldoCents === null ? '—' : fmt(d.saldoCents)}
            // Cuántos certificados más alcanzan: es lo que de verdad se quiere saber del saldo.
            hint={
              d.saldoCents === null
                ? 'sin reportes'
                : `≈ ${Math.floor(d.saldoCents / SNR_COST_CENTS)} certificados · actualizado ${ago(d.saldoAt)}`
            }
            tone={d.saldoLow ? 'danger' : 'brand'}
            alert={d.saldoLow ? `Bajo el umbral (${fmt(SALDO_THRESHOLD_CENTS)})` : undefined}
            action={<SaldoRefresh />}
          />
          {/* En rojo cuando es negativo: es la señal de negocio más importante del panel
              (hasta ahora salía en el mismo color que una ganancia sana). */}
          <Kpi
            label="Ganancias (neto)"
            value={fmt(d.profitCents)}
            hint={`Ingresos ${fmt(d.revenueCents)} − costo ${fmt(d.costCents)}`}
            tone={d.profitCents < 0 ? 'danger' : 'accent'}
            alert={d.profitCents < 0 ? 'Aún en pérdida: el costo del SNR supera lo vendido' : undefined}
          />
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

        {/* Estado del pool de cuentas SNR */}
        {snr && (
          <Card title="Cuentas SNR" hint={snr.updatedAt ? `actualizado ${ago(snr.updatedAt)}` : undefined}>
            <SnrAccounts
              // La activa cae al snapshot global cuando aún no hay saldo por-cuenta (ese ES su saldo).
              cuentas={snr.cuentas.map((c) => ({
                user: c.user,
                disponible: c.disponible,
                reason: c.reason ?? null,
                saldoCents: c.saldoCents ?? (c.user === snr.activa ? d.saldoCents : null),
              }))}
              activa={snr.activa}
              costCents={SNR_COST_CENTS}
            />
          </Card>
        )}

        {/* Métricas · últimos 14 días */}
        <MetricsCharts m={metrics} />

        {/* Despacho manual (superadmin): generar pedidos con plan y entrega, sin Wompi */}
        {role === 'superadmin' && <AdminGenerar />}

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

// Banner de salud: verde si el robot late y no hay pedidos atascados; rojo si está caído o hay
// clientes pagados sin atender. Cada problema dice qué hacer, no solo que algo pasó.
function HealthBanner({ health }: { health: Awaited<ReturnType<typeof getRobotHealth>> }) {
  const problems: { txt: string; fix: string }[] = [];
  if (health.state === 'offline') problems.push({ txt: `Robot CAÍDO · sin reportar hace ${health.ageMin} min`, fix: 'Revisa el contenedor del robot en EasyPanel (VPS). Los pedidos nuevos no se generarán.' });
  else if (health.state === 'degraded') problems.push({ txt: `Robot sin reportar hace ${health.ageMin} min`, fix: 'Puede ser un reinicio. Si sigue así en 20 min, revisa el VPS.' });
  else if (health.state === 'unknown') problems.push({ txt: 'Sin datos del robot', fix: 'El robot aún no ha reportado su estado.' });
  if (health.stuckOrders > 0) problems.push({ txt: `${health.stuckOrders} pedido(s) pagado(s) sin completar`, fix: 'El cliente ya pagó. Revísalos abajo y usa "Reintentar".' });
  if (health.saldoCents !== null && health.saldoCents < SALDO_THRESHOLD_CENTS) problems.push({ txt: `Saldo SNR bajo (${fmt(health.saldoCents)})`, fix: 'Recarga el saldo prepago en el portal del SNR.' });

  const ok = problems.length === 0;
  const critical = health.state === 'offline' || health.stuckOrders > 0;
  const bg = ok ? 'border-[#bbf7d0] bg-[#f0fdf4]' : critical ? 'border-[#f3c2bd] bg-[#fdecec]' : 'border-[#f0d8a8] bg-[#fdf6e8]';
  const dotColor = ok ? '#15803d' : critical ? '#b42318' : '#b45309';

  return (
    <section className={`rounded-2xl border px-5 py-4 ${bg}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="relative flex size-2.5">
          {ok && <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: dotColor }} />}
          <span className="relative inline-flex size-2.5 rounded-full" style={{ background: dotColor }} />
        </span>
        <span className="text-sm font-bold" style={{ color: dotColor }}>
          {ok ? 'Sistema operativo' : critical ? 'Requiere atención' : 'Con advertencias'}
        </span>
        <span className="text-[12px] text-[var(--muted)]">
          {health.heartbeatAt ? `robot reportó ${ago(health.heartbeatAt)}` : 'sin latido'}
          {health.activa && ` · cuenta ${health.activa}`}
          {health.failedToday > 0 && ` · ${health.failedToday} fallo(s) hoy`}
        </span>
      </div>

      {problems.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {problems.map((p, i) => (
            <li key={i} className="text-[13px]">
              <span className="font-semibold text-[var(--foreground)]">{p.txt}</span>
              <span className="block text-[12px] text-[var(--muted)]">{p.fix}</span>
            </li>
          ))}
        </ul>
      )}

      {/* El último error SOLO si es reciente (7 días) y siempre con su fecha: antes se
          arrastraba un fallo de hace semanas junto a "Sistema operativo" y parecía actual. */}
      {health.lastError && health.lastErrorAt && Date.now() - new Date(health.lastErrorAt).getTime() < 7 * 864e5 && (
        <p className="mt-3 border-t border-black/5 pt-2 text-[11.5px] text-[var(--muted)]">
          <span className="font-semibold">Último error ({ago(health.lastErrorAt)}):</span> {health.lastError.slice(0, 160)}
        </p>
      )}
    </section>
  );
}

function Kpi({ label, value, hint, tone = 'default', alert, dot, action }: { label: string; value: string; hint?: string; tone?: 'default' | 'brand' | 'accent' | 'danger' | 'muted'; alert?: string; dot?: boolean; action?: React.ReactNode }) {
  const color = tone === 'danger' ? 'var(--accent)' : tone === 'accent' ? 'var(--accent)' : 'var(--brand)';
  const valColor = tone === 'danger' ? '#b42318' : 'var(--foreground)';
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center gap-2">
        {dot && <span className="size-2 rounded-full" style={{ background: tone === 'danger' ? '#b42318' : tone === 'accent' ? 'var(--accent)' : 'var(--muted-2)' }} />}
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">{label}</p>
      </div>
      <p className="mt-2 text-[26px] font-bold tracking-tight" style={{ color: valColor }}>{value}</p>
      {hint && <p className="mt-1 text-[12px] text-[var(--muted)]">{hint}</p>}
      {alert && <p className="mt-1 text-[12px] font-semibold text-[#b42318]">{alert}</p>}
      {action && <div className="mt-2.5">{action}</div>}
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
