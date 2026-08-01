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

// El Postgres también vive en el VPS (Colombia) y estas funciones corren en Vercel (EE.UU.): una conexión
// fría tarda segundos. La caché es una OPTIMIZACIÓN, no puede volverse el cuello de botella → se acota, y si
// no contesta a tiempo se consulta al robot directo (~800ms, más rápido que esperar la caché).
const CACHE_READ_MS = Number(process.env.VERIFY_CACHE_READ_MS || 1500);

function conLimite<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]);
}

// PRESUPUESTO DE TIEMPO. Las funciones de Vercel en plan Hobby mueren a los 10s por defecto, así que un
// timeout de 15s nunca llegaba a cumplirse: Vercel cortaba antes y el visitante veía un error. Las rutas que
// llaman aquí declaran maxDuration; aun así el gasto total (caché + 2 intentos) se mantiene por debajo para
// que el usuario tenga una respuesta, no una pantalla colgada: 1.5s + 12s + 14s ≈ 27.5s en el peor caso,
// bajo el maxDuration de 30s que declaran las rutas.
//
// Los 6s+8s de antes NO alcanzaban: medido contra el robot real el 2026-08-01, una consulta
// tarda ~4.5s con el navegador caliente pero ~21s cuando arranca en frio. El checkout mostraba
// "el SNR esta caido" con el SNR perfectamente vivo, y no dejaba pagar.
const PUENTE_MS_1 = Number(process.env.VERIFY_BRIDGE_MS_1 || 12000);
const PUENTE_MS_2 = Number(process.env.VERIFY_BRIDGE_MS_2 || 14000);

async function consultarPuente(oficina: string, matricula: string, ms: number): Promise<VerifyResult> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(VERIFY_BRIDGE, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-webhook-secret': SECRET },
      body: JSON.stringify({ oficina, matricula }),
      signal: ctrl.signal,
    });
    if (!res.ok) return { disponible: null, estado: null, direccion: null, circulo: null, cached: false, error: 'verificar ' + res.status };
    const info = await res.json();
    return {
      disponible: !!info.disponible,
      estado: info.estado ?? null,
      direccion: info.direccion ?? null,
      circulo: info.circulo ?? null,
      cached: false,
    };
  } catch (e) {
    return { disponible: null, estado: null, direccion: null, circulo: null, cached: false, error: String(e).slice(0, 120) };
  } finally {
    clearTimeout(t);
  }
}

// Caché primero; si no, consulta al VPS (rápido) y cachea el resultado conclusivo.
export async function verificar(oficina: string, matricula: string): Promise<VerifyResult> {
  // Un fallo de la caché NUNCA debe tumbar la validación: si tarda o revienta, seguimos al robot.
  const cached = await conLimite(getCached(oficina, matricula).catch(() => null), CACHE_READ_MS);
  if (cached) return cached;

  // Un solo intento dejaba ~1 de cada 5 validaciones sin respuesta (medido en producción el 2026-07-28), y
  // como el checkout es fail-closed cada fallo es una venta perdida. Con un reintento el fallo compuesto
  // baja de ~20% a ~4%. Solo se reintenta lo NO concluyente (error/timeout): un "no existe" es definitivo.
  let r = await consultarPuente(oficina, matricula, PUENTE_MS_1);
  if (r.error) r = await consultarPuente(oficina, matricula, PUENTE_MS_2);

  // Escritura best-effort y SIN await: esperar el INSERT contra el Postgres remoto le sumaba segundos a la
  // respuesta que el usuario está esperando, justo en el paso previo al pago.
  if (r.estado && r.disponible) void setCached(oficina, matricula, r).catch(() => {});
  return r;
}
