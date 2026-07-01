import { getPool } from './db';

export interface VerifyResult {
  disponible: boolean | null;
  estado: string | null;
  direccion: string | null;
  circulo: string | null;
  cached: boolean;
  mocked?: boolean;
  error?: string;
}

const CACHE_HOURS = Number(process.env.VERIFY_CACHE_HOURS || 24);
const N8N_VERIFY_URL = process.env.N8N_VERIFY_URL ?? '';
const SECRET = process.env.N8N_WEBHOOK_SECRET ?? '';

// Rate limit en memoria por IP (ponytail: in-memory, basta para 1 instancia; subir a Redis si escala).
// Protege la cuenta SNR de abuso. La validación además está acotada al checkout (no es pública).
const hits = new Map<string, number[]>();
const RL_MAX = Number(process.env.VERIFY_RL_MAX || 12);
const RL_WINDOW_MS = Number(process.env.VERIFY_RL_WINDOW_MIN || 60) * 60_000;
export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RL_WINDOW_MS);
  if (arr.length >= RL_MAX) { hits.set(ip, arr); return true; }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

async function getCached(oficina: string, matricula: string): Promise<VerifyResult | null> {
  if (!process.env.DATABASE_URL) return null;
  const { rows } = await getPool().query(
    `SELECT disponible, estado, direccion, circulo FROM verificaciones
     WHERE oficina = $1 AND matricula = $2 AND checked_at > now() - ($3 || ' hours')::interval`,
    [oficina, matricula, String(CACHE_HOURS)],
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return { disponible: r.disponible, estado: r.estado, direccion: r.direccion, circulo: r.circulo, cached: true };
}

async function setCached(oficina: string, matricula: string, r: VerifyResult): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  await getPool().query(
    `INSERT INTO verificaciones (oficina, matricula, disponible, estado, direccion, circulo, checked_at)
     VALUES ($1,$2,$3,$4,$5,$6, now())
     ON CONFLICT (oficina, matricula) DO UPDATE SET
       disponible = EXCLUDED.disponible, estado = EXCLUDED.estado, direccion = EXCLUDED.direccion,
       circulo = EXCLUDED.circulo, checked_at = now()`,
    [oficina, matricula, r.disponible, r.estado, r.direccion, r.circulo],
  );
}

// La consulta al SNR CORRE EN EL VPS (robot /verificar vía puente), NO en Vercel. Correrla dentro de Vercel
// (EE.UU.) contra el portal del SNR (Colombia) se cuelga 20s+; en el VPS son ~800ms. Puente en el web de
// EasyPanel: certificados.fourgsolutions.com/api/verificar → certificados_robot:3000/verificar.
const VERIFY_BRIDGE = 'https://certificados.fourgsolutions.com/api/verificar';

// Caché primero; si no, consulta al VPS (rápido) y cachea el resultado conclusivo.
export async function verificar(oficina: string, matricula: string): Promise<VerifyResult> {
  const cached = await getCached(oficina, matricula);
  if (cached) return cached;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(VERIFY_BRIDGE, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET },
      body: JSON.stringify({ oficina, matricula }),
      signal: ctrl.signal,
    });
    if (!res.ok) return { disponible: null, estado: null, direccion: null, circulo: null, cached: false, error: 'verificar ' + res.status };
    const info = await res.json();
    const fresh: VerifyResult = {
      disponible: !!info.disponible,
      estado: info.estado ?? null,
      direccion: info.direccion ?? null,
      circulo: info.circulo ?? null,
      cached: false,
    };
    if (fresh.estado && fresh.disponible) await setCached(oficina, matricula, fresh).catch(() => {});
    return fresh;
  } catch (e) {
    return { disponible: null, estado: null, direccion: null, circulo: null, cached: false, error: String(e).slice(0, 120) };
  } finally {
    clearTimeout(t);
  }
}
