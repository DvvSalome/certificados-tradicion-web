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

// @ts-ignore
import { consultaHttp } from '../robot-service/snr-consulta-http.mjs';

// Caché primero; si no, consulta directa por HTTP.
export async function verificar(oficina: string, matricula: string): Promise<VerifyResult> {
  const cached = await getCached(oficina, matricula);
  if (cached) return cached;
  
  try {
    const info = await consultaHttp(oficina, matricula);
    const fresh: VerifyResult = {
      disponible: !!info.disponible,
      estado: info.estado ?? null,
      direccion: info.direccion ?? null,
      circulo: info.circulo ?? null,
      cached: false
    };
    if (fresh.estado && fresh.disponible) await setCached(oficina, matricula, fresh).catch(() => {});
    return fresh;
  } catch (e) {
    return { disponible: null, estado: null, direccion: null, circulo: null, cached: false, error: String(e).slice(0, 120) };
  }
}
