// ⚠ NO ESTÁ DESPLEGADO. Verificado el 2026-08-03: el contenedor `certificados_robot` solo corre
// `node server.mjs` y este archivo ni siquiera existe en /app. Tampoco está versionado (el repo
// arranca en web/, esta carpeta queda afuera).
//
// En producción el rescate de una orden colgada en GENERATING es: /api/admin/watchdog alerta a los
// 15 min → un humano aprieta Reintentar → /api/admin/order/[ref]/retry re-dispara con el payload
// completo. Ese camino sí conserva el plan.
//
// Si algún día se revive este worker, el payload de abajo ya quedó alineado con /generar.
import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) { 
  console.error('[order-worker] No DATABASE_URL configurado'); 
  process.exit(1); 
}
const pool = new Pool({ 
  connectionString, 
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined 
});

const SECRET = process.env.N8N_WEBHOOK_SECRET || '';
const active = new Set();
const PLANES = ['basico', 'express', 'avanzado'];

async function run() {
  console.log('[order-worker] Polling orders con status GENERATING cada 10s...');
  while (true) {
    try {
      const { rows } = await pool.query(`SELECT * FROM orders WHERE status = 'GENERATING'`);
      for (const row of rows) {
        if (active.has(row.reference)) continue;
        active.add(row.reference);
        console.log('[order-worker] Encontrado order en GENERATING:', row.reference);
        
        // El payload tiene que ser el MISMO que arma el webhook de Wompi, porque /generar espera
        // { reference, matricula, oficina, email, phone, plan }.
        //   - plan: antes era `row.plan === 'express' ? 'express' : 'basico'`, así que 'avanzado'
        //     caía al else y un pedido de $99.900 se degradaba a básico en silencio.
        //   - phone: faltaba, y sin él la entrega por WhatsApp no sale.
        //   - transactionId: faltaba; marca el origen del pedido.
        const job = {
          reference: row.reference,
          matricula: row.matricula,
          oficina: row.oficina,
          email: row.email,
          phone: row.phone ?? null,
          transactionId: row.transaction_id ?? '',
          plan: PLANES.includes(row.plan) ? row.plan : 'basico'
        };
        
        fetch('http://localhost:3000/generar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-webhook-secret': SECRET },
          body: JSON.stringify(job)
        }).then(r => console.log(`[order-worker] Disparado ${row.reference}: ${r.status}`))
          .catch(e => console.error('[order-worker] Fetch error:', e.message));
        
        // Timeout para que si falla o se atasca, lo reintente en 2 minutos.
        setTimeout(() => active.delete(row.reference), 120000);
      }
    } catch(e) { 
      console.error('[order-worker] Query error:', e.message); 
    }
    await new Promise(r => setTimeout(r, 10000));
  }
}
run();
