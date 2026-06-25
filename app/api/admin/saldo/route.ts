import { NextResponse } from 'next/server';
import { recordSaldo, SALDO_THRESHOLD_CENTS } from '@/lib/admin';
import { sendAlert } from '@/lib/alerts';
import { formatCOP } from '@/lib/config';

export const runtime = 'nodejs';

// El robot/n8n postea el saldo prepago del SNR aquí (server-to-server, protegido por secret).
// Si baja del umbral, dispara alerta WhatsApp+Email a Alexis y FourG.
function authed(req: Request): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  return !!secret && req.headers.get('x-webhook-secret') === secret;
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { saldoCents, saldoCOP } = (await req.json().catch(() => ({}))) as { saldoCents?: number; saldoCOP?: number };
  const cents = saldoCents ?? (saldoCOP != null ? Math.round(saldoCOP * 100) : NaN);
  if (!Number.isFinite(cents) || cents < 0) return NextResponse.json({ error: 'saldoCents inválido' }, { status: 400 });

  const { low } = await recordSaldo(cents);
  if (low) {
    await sendAlert({
      kind: 'saldo_bajo',
      title: '⚠️ Saldo prepago SNR bajo',
      message: `El saldo de la cuenta prepago bajó a ${formatCOP(cents / 100)} (umbral ${formatCOP(SALDO_THRESHOLD_CENTS / 100)}). Recarga para no frenar la generación.`,
      data: { saldo: formatCOP(cents / 100) },
    });
  }
  return NextResponse.json({ ok: true, low });
}
