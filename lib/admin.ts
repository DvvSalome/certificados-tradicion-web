import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { getPool } from './db';

// ── Auth: cookie firmada con HMAC. Un solo rol (superadmin). Sin DB de usuarios (YAGNI): contraseña vía env. ──
export type Role = 'superadmin';
export const COOKIE = 'ctl_admin';
const DEFAULT_SECRET = 'dev-insecure-change-me';
const SECRET = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;

// En producción, si el secreto no está bien configurado, NEGAMOS todo acceso admin (fail-closed).
// Con el default, la cookie superadmin sería forjable por cualquiera; preferimos bloquear el panel
// (el operador lo nota y configura ADMIN_SESSION_SECRET) antes que exponer ingresos/PII y /api/admin/batch.
function secretInseguro(): boolean {
  if (process.env.NODE_ENV === 'production' && SECRET === DEFAULT_SECRET) {
    console.error('[admin] ⛔ ADMIN_SESSION_SECRET no configurado en producción → acceso admin DENEGADO. Configúralo.');
    return true;
  }
  return false;
}

const PASSWORDS: Record<Role, string | undefined> = {
  superadmin: process.env.ADMIN_PASS_SUPERADMIN,
};

// La sesión caduca a las 12h. `exp` va DENTRO del HMAC → no se puede alterar, y verify() lo rechaza
// vencido. Así un token filtrado no sirve para siempre (antes era estático por rol, sin caducidad).
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function sign(role: Role): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const mac = createHmac('sha256', SECRET).update(`${role}.${exp}`).digest('hex');
  return `${role}.${exp}.${mac}`;
}

export function verify(token: string | undefined): Role | null {
  if (secretInseguro()) return null;
  if (!token) return null;
  const [role, expStr, mac] = token.split('.');
  if (role !== 'superadmin' || !expStr || !mac) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null; // sesión caducada
  const expected = createHmac('sha256', SECRET).update(`${role}.${expStr}`).digest('hex');
  const a = Buffer.from(mac), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return role;
}

// Valida contraseña y devuelve el token de sesión, o null si no coincide.
export function login(role: Role, password: string): string | null {
  if (secretInseguro()) return null;
  const expected = PASSWORDS[role];
  if (!expected || !password) return null;
  const a = Buffer.from(password), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return sign(role);
}

// Lee la sesión actual (server components / route handlers).
export async function getSession(): Promise<Role | null> {
  const jar = await cookies();
  return verify(jar.get(COOKIE)?.value);
}

// ── Datos del dashboard ──
export interface Dashboard {
  hasDb: boolean;
  saldoCents: number | null;
  saldoAt: string | null;
  saldoLow: boolean;
  revenueCents: number;
  costCents: number;
  profitCents: number;
  certCount: number;
  ordersByStatus: Record<string, number>;
  recentGenerations: { matricula: string; oficina: string; status: string; costCents: number | null; error: string | null; at: string }[];
  recentOrders: { reference: string; matricula: string; oficina: string; status: string; amountCents: number; plan: string; hasPdf: boolean; at: string }[];
  robot: { lastRunAt: string | null; lastOkAt: string | null; lastError: string | null; okToday: number; failToday: number };
}

export const SALDO_THRESHOLD_CENTS = Number(process.env.SALDO_ALERT_THRESHOLD_COP || 100000) * 100;

const n = (v: unknown) => Number(v ?? 0);
const iso = (d: unknown) => (d instanceof Date ? d.toISOString() : d ? String(d) : null);

export async function getDashboard(): Promise<Dashboard> {
  if (!process.env.DATABASE_URL) {
    return {
      hasDb: false, saldoCents: null, saldoAt: null, saldoLow: false,
      revenueCents: 0, costCents: 0, profitCents: 0, certCount: 0,
      ordersByStatus: {}, recentGenerations: [], recentOrders: [],
      robot: { lastRunAt: null, lastOkAt: null, lastError: null, okToday: 0, failToday: 0 },
    };
  }
  const pool = getPool();
  const [saldo, totals, statuses, gens, ords, robot] = await Promise.all([
    pool.query('SELECT saldo_cents, created_at FROM saldo_snapshots ORDER BY created_at DESC LIMIT 1'),
    pool.query(`SELECT
        (SELECT COALESCE(SUM(amount_in_cents),0) FROM orders WHERE status='DELIVERED') AS revenue,
        (SELECT COALESCE(SUM(cost_in_cents),0) FROM generations WHERE status='OK') AS cost,
        (SELECT COUNT(*) FROM generations WHERE status='OK') AS certs`),
    pool.query(`SELECT status, COUNT(*) AS c FROM orders GROUP BY status`),
    pool.query(`SELECT matricula, oficina, status, cost_in_cents, error, created_at FROM generations ORDER BY created_at DESC LIMIT 15`),
    pool.query(`SELECT reference, matricula, oficina, status, amount_in_cents, plan, (cert_pdf IS NOT NULL) AS has_pdf, created_at FROM orders ORDER BY created_at DESC LIMIT 15`),
    pool.query(`SELECT
        (SELECT created_at FROM generations ORDER BY created_at DESC LIMIT 1) AS last_run,
        (SELECT created_at FROM generations WHERE status='OK' ORDER BY created_at DESC LIMIT 1) AS last_ok,
        (SELECT error FROM generations WHERE status='FAILED' ORDER BY created_at DESC LIMIT 1) AS last_error,
        (SELECT COUNT(*) FROM generations WHERE status='OK' AND created_at::date = now()::date) AS ok_today,
        (SELECT COUNT(*) FROM generations WHERE status='FAILED' AND created_at::date = now()::date) AS fail_today`),
  ]);

  const revenueCents = n(totals.rows[0]?.revenue);
  const costCents = n(totals.rows[0]?.cost);
  const saldoCents = saldo.rows[0] ? n(saldo.rows[0].saldo_cents) : null;
  const ordersByStatus: Record<string, number> = {};
  for (const r of statuses.rows) ordersByStatus[r.status] = n(r.c);

  return {
    hasDb: true,
    saldoCents,
    saldoAt: iso(saldo.rows[0]?.created_at),
    saldoLow: saldoCents !== null && saldoCents < SALDO_THRESHOLD_CENTS,
    revenueCents,
    costCents,
    profitCents: revenueCents - costCents,
    certCount: n(totals.rows[0]?.certs),
    ordersByStatus,
    recentGenerations: gens.rows.map((r) => ({
      matricula: r.matricula, oficina: r.oficina, status: r.status,
      costCents: r.cost_in_cents === null ? null : n(r.cost_in_cents), error: r.error, at: iso(r.created_at)!,
    })),
    recentOrders: ords.rows.map((r) => ({
      reference: r.reference, matricula: r.matricula, oficina: r.oficina, status: r.status,
      amountCents: n(r.amount_in_cents), plan: r.plan ?? 'basico', hasPdf: !!r.has_pdf, at: iso(r.created_at)!,
    })),
    robot: {
      lastRunAt: iso(robot.rows[0]?.last_run), lastOkAt: iso(robot.rows[0]?.last_ok),
      lastError: robot.rows[0]?.last_error ?? null, okToday: n(robot.rows[0]?.ok_today), failToday: n(robot.rows[0]?.fail_today),
    },
  };
}

// Inserta una generación (la reporta el robot). Devuelve si quedó saldo bajo tras el costo (no recalcula saldo).
export async function recordGeneration(g: { reference?: string; matricula: string; oficina: string; status: 'OK' | 'FAILED'; costCents?: number | null; error?: string | null }) {
  await getPool().query(
    `INSERT INTO generations (reference, matricula, oficina, status, cost_in_cents, error) VALUES ($1,$2,$3,$4,$5,$6)`,
    [g.reference ?? null, g.matricula, g.oficina, g.status, g.costCents ?? null, g.error ?? null],
  );
}

// Inserta un snapshot de saldo. Devuelve {saldoCents, low}.
export async function recordSaldo(saldoCents: number): Promise<{ saldoCents: number; low: boolean }> {
  await getPool().query(`INSERT INTO saldo_snapshots (saldo_cents) VALUES ($1)`, [saldoCents]);
  return { saldoCents, low: saldoCents < SALDO_THRESHOLD_CENTS };
}

// ── Estado del pool de cuentas SNR (lo empuja el robot a /api/admin/snr-status). ──
export interface SnrStatus {
  activa: string | null;
  total: number;
  cuentas: { user: string; disponible: boolean; saldoCents: number | null; cooldownUntil: number | null; reason: string | null }[];
  updatedAt: string | null;
}

export async function getSnrStatus(): Promise<SnrStatus | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { rows } = await getPool().query('SELECT data, updated_at FROM snr_status WHERE id = 1');
    if (!rows[0]) return null;
    const d = rows[0].data as { activa?: string; total?: number; cuentas?: SnrStatus['cuentas'] };
    return { activa: d.activa ?? null, total: d.total ?? 0, cuentas: d.cuentas ?? [], updatedAt: iso(rows[0].updated_at) };
  } catch {
    return null; // la tabla aún no existe (el robot no ha empujado todavía)
  }
}

// ── Salud del robot ─────────────────────────────────────────────────────────
// PUNTO CIEGO QUE ESTO RESUELVE: el robot se vigila a sí mismo (él llama al reaper y él empuja su
// estado). Si el contenedor muere, deja de hacer ambas cosas y NADIE se entera. Aquí derivamos la
// salud desde la ANTIGÜEDAD del último latido: el robot empuja snr-status cada 10 min, así que un
// `updated_at` viejo significa robot caído, aunque no haya pedidos que fallen.
const HEARTBEAT_EVERY_MIN = 10;

// ── Salud de la pasarela: ¿Wompi está reportando? ──────────────────────────────────────
// Un pedido "pendiente de pago" se ve IGUAL si el cliente abandonó el checkout que si pagó
// y el webhook nunca llegó. Esto separa los dos casos mirando la bitácora wompi_events.
export interface WompiHealth {
  lastAt: string | null;        // último evento recibido de Wompi (de cualquier tipo)
  lastResult: string | null;
  lastReference: string | null;
  lastApprovedAt: string | null; // último pago APROBADO procesado
  eventos7d: number;
  firmaInvalida7d: number;       // >0 = revisar el secreto de eventos en el panel de Wompi
  pendientesRecientes: number;   // checkouts sin pagar de las últimas 24 h
}

export async function getWompiHealth(): Promise<WompiHealth> {
  const vacio: WompiHealth = {
    lastAt: null, lastResult: null, lastReference: null, lastApprovedAt: null,
    eventos7d: 0, firmaInvalida7d: 0, pendientesRecientes: 0,
  };
  if (!process.env.DATABASE_URL) return vacio;
  try {
    const pool = getPool();
    await pool.query(`CREATE TABLE IF NOT EXISTS wompi_events (
      id BIGSERIAL PRIMARY KEY,
      at TIMESTAMPTZ NOT NULL DEFAULT now(),
      event TEXT, reference TEXT, tx_status TEXT,
      firma_ok BOOLEAN NOT NULL, resultado TEXT NOT NULL
    )`);
    const [ultimo, aprobado, conteo, pend] = await Promise.all([
      pool.query('SELECT at, resultado, reference FROM wompi_events ORDER BY at DESC LIMIT 1'),
      pool.query("SELECT at FROM wompi_events WHERE resultado = 'aprobado' ORDER BY at DESC LIMIT 1"),
      pool.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE NOT firma_ok) AS malos
                  FROM wompi_events WHERE at > now() - interval '7 days'`),
      pool.query(`SELECT COUNT(*) AS c FROM orders
                  WHERE status = 'PENDING_PAYMENT' AND created_at > now() - interval '24 hours'`),
    ]);
    return {
      lastAt: iso(ultimo.rows[0]?.at),
      lastResult: ultimo.rows[0]?.resultado ?? null,
      lastReference: ultimo.rows[0]?.reference ?? null,
      lastApprovedAt: iso(aprobado.rows[0]?.at),
      eventos7d: n(conteo.rows[0]?.total),
      firmaInvalida7d: n(conteo.rows[0]?.malos),
      pendientesRecientes: n(pend.rows[0]?.c),
    };
  } catch {
    return vacio;
  }
}

// ── Embudo: dónde se cae la gente ──────────────────────────────────────────────────────
// Cuenta VISITANTES ÚNICOS (por sesión), no eventos: 10 recargas de la misma persona es
// 1 visitante. Cada paso incluye a los que llegaron más lejos (un embudo de verdad).
export interface Funnel {
  dias: number;
  visitas: number;
  vieronPlanes: number;
  empezaronForm: number;
  validaron: number;
  validacionFallida: number;
  alPago: number;
  pagaron: number;
  porCampana: { campana: string; visitas: number; alPago: number; pagaron: number }[];
}

export async function getFunnel(dias = 7): Promise<Funnel> {
  const vacio: Funnel = { dias, visitas: 0, vieronPlanes: 0, empezaronForm: 0, validaron: 0, validacionFallida: 0, alPago: 0, pagaron: 0, porCampana: [] };
  if (!process.env.DATABASE_URL) return vacio;
  try {
    const pool = getPool();
    await pool.query(`CREATE TABLE IF NOT EXISTS site_events (
      id BIGSERIAL PRIMARY KEY, at TIMESTAMPTZ NOT NULL DEFAULT now(),
      sid TEXT NOT NULL, event TEXT NOT NULL, path TEXT,
      utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, ref TEXT
    )`);
    const desde = `now() - interval '${Math.max(1, Math.min(90, dias))} days'`;
    const [pasos, camp, pagos] = await Promise.all([
      pool.query(`SELECT event, COUNT(DISTINCT sid) AS n FROM site_events WHERE at > ${desde} GROUP BY event`),
      pool.query(`SELECT COALESCE(NULLIF(utm_campaign,''),'(directo / sin campaña)') AS campana,
                         COUNT(DISTINCT sid) FILTER (WHERE event='view') AS visitas,
                         COUNT(DISTINCT sid) FILTER (WHERE event='checkout') AS al_pago
                  FROM site_events WHERE at > ${desde} GROUP BY 1 ORDER BY visitas DESC LIMIT 8`),
      // Los pagos salen de orders (la verdad del negocio), no de un evento del navegador.
      pool.query(`SELECT COUNT(*) AS n FROM orders
                  WHERE status IN ('PAID','GENERATING','DELIVERED') AND created_at > ${desde}`),
    ]);
    const p = new Map<string, number>(pasos.rows.map((r: { event: string; n: string }) => [r.event, n(r.n)]));
    return {
      dias,
      visitas: p.get('view') ?? 0,
      vieronPlanes: p.get('plan_click') ?? 0,
      // 'plan_click' solo lo disparan las tarjetas del hero, que son opcionales: quien baja directo al
      // formulario no aparecía en ningún paso hasta validar. 'form_start' cierra ese hueco.
      empezaronForm: p.get('form_start') ?? 0,
      validaron: p.get('validate_ok') ?? 0,
      validacionFallida: p.get('validate_fail') ?? 0,
      alPago: p.get('checkout') ?? 0,
      pagaron: n(pagos.rows[0]?.n),
      porCampana: camp.rows.map((r: { campana: string; visitas: string; al_pago: string }) => ({
        campana: r.campana, visitas: n(r.visitas), alPago: n(r.al_pago), pagaron: 0,
      })),
    };
  } catch {
    return vacio;
  }
}

export interface RobotHealth {
  state: 'online' | 'degraded' | 'offline' | 'unknown';
  heartbeatAt: string | null;
  ageMin: number | null;
  activa: string | null;
  cuentas: SnrStatus['cuentas'];
  saldoCents: number | null;   // último snapshot global conocido
  stuckOrders: number;         // pagados que llevan >15 min sin completarse
  failedToday: number;
  lastError: string | null;
  lastErrorAt: string | null; // sin esto el panel mostraba un error de hace semanas como si fuera de ahora
}

export async function getRobotHealth(): Promise<RobotHealth> {
  const empty: RobotHealth = {
    state: 'unknown', heartbeatAt: null, ageMin: null, activa: null, cuentas: [],
    saldoCents: null, stuckOrders: 0, failedToday: 0, lastError: null, lastErrorAt: null,
  };
  if (!process.env.DATABASE_URL) return empty;

  try {
    const pool = getPool();
    const [snr, saldo, stuck, gen] = await Promise.all([
      pool.query('SELECT data, updated_at FROM snr_status WHERE id = 1'),
      pool.query('SELECT saldo_cents FROM saldo_snapshots ORDER BY created_at DESC LIMIT 1'),
      pool.query(`SELECT COUNT(*) AS c FROM orders
                  WHERE status IN ('PAID','GENERATING') AND updated_at < now() - interval '15 minutes'`),
      pool.query(`SELECT
        (SELECT COUNT(*) FROM generations WHERE status='FAILED' AND created_at::date = now()::date) AS fails,
        (SELECT error FROM generations WHERE status='FAILED' ORDER BY created_at DESC LIMIT 1) AS last_error,
        (SELECT created_at FROM generations WHERE status='FAILED' ORDER BY created_at DESC LIMIT 1) AS last_error_at`),
    ]);

    const hb = snr.rows[0]?.updated_at ? new Date(snr.rows[0].updated_at) : null;
    const ageMin = hb ? Math.round((Date.now() - hb.getTime()) / 60000) : null;
    // 2 latidos perdidos = degradado; 6 = caído. Tolera un reinicio corto sin gritar.
    const state: RobotHealth['state'] =
      ageMin === null ? 'unknown'
      : ageMin <= HEARTBEAT_EVERY_MIN * 2 ? 'online'
      : ageMin <= HEARTBEAT_EVERY_MIN * 6 ? 'degraded'
      : 'offline';

    const d = (snr.rows[0]?.data ?? {}) as { activa?: string; cuentas?: SnrStatus['cuentas'] };
    return {
      state,
      heartbeatAt: iso(snr.rows[0]?.updated_at),
      ageMin,
      activa: d.activa ?? null,
      cuentas: d.cuentas ?? [],
      saldoCents: saldo.rows[0] ? n(saldo.rows[0].saldo_cents) : null,
      stuckOrders: n(stuck.rows[0]?.c),
      failedToday: n(gen.rows[0]?.fails),
      lastError: gen.rows[0]?.last_error ?? null,
      lastErrorAt: iso(gen.rows[0]?.last_error_at),
    };
  } catch {
    return empty;
  }
}

// ── Métricas para gráficas: serie diaria de los últimos 14 días + tasa de éxito del robot. ──
export interface Metrics {
  daily: { date: string; revenueCents: number; certs: number; fails: number }[];
  successRate: number | null; // 0-100 sobre las generaciones de los 14 días (null si no hubo)
  totalCerts14: number;
  totalRevenue14: number;
}

export async function getMetrics(): Promise<Metrics> {
  const empty: Metrics = { daily: [], successRate: null, totalCerts14: 0, totalRevenue14: 0 };
  if (!process.env.DATABASE_URL) return empty;
  const { rows } = await getPool().query(`
    WITH days AS (
      SELECT generate_series((now()::date - interval '13 days'), now()::date, interval '1 day')::date AS d
    )
    SELECT to_char(days.d, 'YYYY-MM-DD') AS date,
      COALESCE((SELECT SUM(amount_in_cents) FROM orders o WHERE o.status='DELIVERED' AND o.created_at::date = days.d), 0) AS revenue,
      COALESCE((SELECT COUNT(*) FROM generations g WHERE g.status='OK' AND g.created_at::date = days.d), 0) AS certs,
      COALESCE((SELECT COUNT(*) FROM generations g WHERE g.status='FAILED' AND g.created_at::date = days.d), 0) AS fails
    FROM days ORDER BY days.d`);
  const daily = rows.map((r) => ({ date: r.date, revenueCents: n(r.revenue), certs: n(r.certs), fails: n(r.fails) }));
  const ok = daily.reduce((s, d) => s + d.certs, 0);
  const fail = daily.reduce((s, d) => s + d.fails, 0);
  return {
    daily,
    successRate: ok + fail > 0 ? Math.round((ok / (ok + fail)) * 100) : null,
    totalCerts14: ok,
    totalRevenue14: daily.reduce((s, d) => s + d.revenueCents, 0),
  };
}
