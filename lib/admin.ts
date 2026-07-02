import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { getPool } from './db';

// ── Auth: cookie firmada con HMAC, 2 roles. Sin DB de usuarios (YAGNI): contraseña por rol vía env. ──
export type Role = 'cliente' | 'superadmin';
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
  cliente: process.env.ADMIN_PASS_CLIENTE,
  superadmin: process.env.ADMIN_PASS_SUPERADMIN,
};

function sign(role: Role): string {
  const mac = createHmac('sha256', SECRET).update(role).digest('hex');
  return `${role}.${mac}`;
}

export function verify(token: string | undefined): Role | null {
  if (secretInseguro()) return null;
  if (!token) return null;
  const [role, mac] = token.split('.');
  if ((role !== 'cliente' && role !== 'superadmin') || !mac) return null;
  const expected = createHmac('sha256', SECRET).update(role).digest('hex');
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
