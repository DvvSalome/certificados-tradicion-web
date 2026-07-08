import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/admin';
import { orders } from '@/lib/orders';
import { triggerGenerarCTL } from '@/lib/n8n';
import { planAmountCents, type PlanId } from '@/lib/config';
import { isOficina } from '@/lib/oficinas';

export const runtime = 'nodejs';

const MAX = 50;
const PLANES: PlanId[] = ['basico', 'express', 'avanzado'];

// Despacho ADMIN: el superadmin genera pedidos (basico/express/avanzado) para clientes acumulados SIN Wompi
// — el pago ya lo pone el negocio (saldo del SNR). Crea la orden en estado PAID (autorizada por la sesión,
// no por un pago) y dispara la MISMA generación+entrega que un pedido pagado. Reutiliza todo el pipeline.
export async function POST(req: Request) {
  const role = await getSession();
  if (role !== 'superadmin') return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as { items?: { matricula?: string; oficina?: string; email?: string; phone?: string; plan?: string }[] };
  const items = (body.items ?? []).slice(0, MAX + 1);
  if (!items.length) return NextResponse.json({ error: 'No hay pedidos' }, { status: 400 });
  if (items.length > MAX) return NextResponse.json({ error: `Máximo ${MAX} por tanda` }, { status: 400 });

  const resultados: { matricula: string; email: string; plan: string; reference?: string; ok: boolean; error?: string }[] = [];
  for (const it of items) {
    const matricula = String(it.matricula ?? '').trim();
    const oficina = String(it.oficina ?? '').trim();
    const email = String(it.email ?? '').trim();
    const phone = it.phone ? String(it.phone).replace(/\D/g, '') : null;
    const plan: PlanId = PLANES.includes(it.plan as PlanId) ? (it.plan as PlanId) : 'basico';

    const fail = (error: string) => resultados.push({ matricula, email, plan, ok: false, error });
    if (!/^\d{2,10}$/.test(matricula)) { fail('matrícula inválida'); continue; }
    if (!isOficina(oficina)) { fail('oficina inválida'); continue; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fail('correo inválido'); continue; }

    const reference = 'CTL-' + randomUUID().replace(/-/g, '').slice(0, 20);
    try {
      // Orden en PAID (autorizada por el admin, sin transacción de Wompi). El pipeline la trata como pagada.
      await orders.create({
        reference, matricula, oficina, email, phone,
        amountInCents: planAmountCents(plan), status: 'PAID', plan,
        createdAt: new Date().toISOString(),
        nombres: 'Despacho admin', apellidos: null, tipoId: null, cedula: null,
        consentAt: new Date().toISOString(), // avanzado: el admin declara la autorización del titular
        transactionId: 'ADMIN', // marcador: generado por el admin, no por Wompi (el retry Wompi-gated lo ignora)
      });
      const r = await triggerGenerarCTL({ reference, matricula, oficina, email, phone, transactionId: 'ADMIN', plan });
      if (!r.ok) { fail('no se pudo disparar: ' + (r.error || r.status)); continue; }
      resultados.push({ matricula, email, plan, reference, ok: true });
    } catch (e) {
      fail(e instanceof Error ? e.message : 'error');
    }
  }
  const ok = resultados.filter((r) => r.ok).length;
  return NextResponse.json({ ok: true, disparados: ok, total: resultados.length, resultados });
}
