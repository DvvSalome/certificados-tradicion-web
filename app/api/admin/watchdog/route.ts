import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getRobotHealth, SALDO_THRESHOLD_CENTS } from '@/lib/admin';
import { sendAlert } from '@/lib/alerts';

export const runtime = 'nodejs';

// VIGILANTE EXTERNO. El reaper lo llama el propio robot, así que si el robot muere deja de llamarlo
// y nadie se entera: un sistema no puede reportar su propia muerte. Este endpoint corre en Vercel
// (cron), FUERA del robot, y vigila justamente eso: latido perdido, pedidos atascados y saldo bajo.
//
// Lo dispara el cron de Vercel (Authorization: Bearer CRON_SECRET) o el secreto interno del stack.
function authed(req: Request): boolean {
  const cron = process.env.CRON_SECRET;
  if (cron && req.headers.get('authorization') === `Bearer ${cron}`) return true;
  const secret = process.env.N8N_WEBHOOK_SECRET;
  return !!secret && req.headers.get('x-webhook-secret') === secret;
}

// Anti-spam: una misma incidencia no vuelve a alertar hasta pasado este tiempo.
const COOLDOWN_MIN = Number(process.env.WATCHDOG_COOLDOWN_MIN || 60);

async function shouldAlert(pool: ReturnType<typeof getPool>, key: string): Promise<boolean> {
  await pool.query(`CREATE TABLE IF NOT EXISTS watchdog_alerts (
    key TEXT PRIMARY KEY, last_sent TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const { rows } = await pool.query(
    `INSERT INTO watchdog_alerts (key) VALUES ($1)
     ON CONFLICT (key) DO UPDATE SET last_sent = now()
     WHERE watchdog_alerts.last_sent < now() - ($2 || ' minutes')::interval
     RETURNING key`,
    [key, String(COOLDOWN_MIN)],
  );
  return rows.length > 0; // sólo hubo fila si se insertó o pasó el cooldown
}

export async function GET(req: Request) { return run(req); }
export async function POST(req: Request) { return run(req); }

async function run(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: true, skipped: 'sin db' });

  const pool = getPool();
  const h = await getRobotHealth();
  const problems: string[] = [];
  const panel = `${process.env.APP_BASE_URL || 'https://certitradicion.com'}/admin`;

  // 1. Latido perdido: el robot no reporta hace demasiado → probablemente caído.
  if (h.state === 'offline' || h.state === 'degraded') {
    problems.push(`robot ${h.state} (último latido hace ${h.ageMin} min)`);
    if (await shouldAlert(pool, `robot_${h.state}`)) {
      await sendAlert({
        kind: 'generacion_fallida',
        title: h.state === 'offline' ? '🔴 Robot CAÍDO' : '🟠 Robot sin reportar',
        message:
          `El robot no reporta hace ${h.ageMin} min (debería hacerlo cada 10).\n` +
          `Los pedidos que entren NO se van a generar.\n\n` +
          `🔧 Revisar el contenedor en el VPS (EasyPanel) y el panel: ${panel}`,
        data: { estado: h.state, minutos_sin_latido: h.ageMin, cuenta_activa: h.activa },
      });
    }
  }

  // 2. Pedidos pagados atascados: alguien pagó y su certificado no avanza.
  if (h.stuckOrders > 0) {
    problems.push(`${h.stuckOrders} pedido(s) atascado(s)`);
    if (await shouldAlert(pool, 'stuck_orders')) {
      await sendAlert({
        kind: 'generacion_fallida',
        title: `🔴 ${h.stuckOrders} pedido(s) pagado(s) sin completar`,
        message:
          `Hay ${h.stuckOrders} pedido(s) con más de 15 min en PAID/GENERATING.\n` +
          `El cliente YA PAGÓ y no ha recibido nada.\n\n🔧 Panel: ${panel}`,
        data: { atascados: h.stuckOrders },
      });
    }
  }

  // 3. Saldo bajo: sin saldo SNR no se puede generar nada, aunque todo lo demás funcione.
  if (h.saldoCents !== null && h.saldoCents < SALDO_THRESHOLD_CENTS) {
    problems.push('saldo SNR bajo');
    if (await shouldAlert(pool, 'saldo_bajo')) {
      await sendAlert({
        kind: 'saldo_bajo',
        title: '⚠ Saldo SNR bajo',
        message:
          `El saldo prepago del SNR va en $${(h.saldoCents / 100).toLocaleString('es-CO')}.\n` +
          `Recárgalo para no interrumpir la generación de certificados.`,
        data: { saldo_cop: h.saldoCents / 100 },
      });
    }
  }

  return NextResponse.json({
    ok: true,
    healthy: problems.length === 0,
    robot: h.state,
    heartbeatAgeMin: h.ageMin,
    stuckOrders: h.stuckOrders,
    saldoCents: h.saldoCents,
    problems,
  });
}
