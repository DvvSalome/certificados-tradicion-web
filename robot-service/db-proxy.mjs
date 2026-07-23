import pg from 'pg';
const { Pool } = pg;

let pool = null;
export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('[db-proxy] DATABASE_URL no configurado, peticiones a la DB fallarán');
      return null;
    }
    pool = new Pool({
      connectionString,
      max: 5,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

// IDEMPOTENCIA POR REFERENCIA — el guardia decisivo contra el doble cobro.
// INSERT con PRIMARY KEY + ON CONFLICT DO NOTHING = atómico: solo el PRIMER /generar de una referencia gana.
// Devuelve true SOLO si este proceso reclamó la referencia por primera vez. false = ya reclamada, o sin
// referencia, o sin DB → en todos esos casos NO se debe cobrar (fail-CLOSED: ante la duda, no cobrar).
export async function claimGenerationJob(reference) {
  const p = getPool();
  if (!p || !reference) return false;
  const { rows } = await p.query(
    `INSERT INTO generation_jobs (reference) VALUES ($1) ON CONFLICT (reference) DO NOTHING RETURNING reference`,
    [reference],
  );
  return rows.length > 0;
}

// Convert Row to Order format exactly as Next.js expects
function toOrder(row) {
  if (!row) return null;
  return {
    reference: row.reference,
    matricula: row.matricula,
    oficina: row.oficina,
    email: row.email,
    phone: row.phone,
    amountInCents: Number(row.amount_in_cents),
    status: row.status,
    transactionId: row.transaction_id ?? undefined,
    plan: (['express', 'avanzado'].includes(row.plan) ? row.plan : 'basico'),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

export async function handleDbProxy(req, res, bodyStr) {
  let body;
  try { body = JSON.parse(bodyStr); } catch { res.writeHead(400); return res.end('JSON inválido'); }
  
  const p = getPool();
  if (!p) { res.writeHead(500); return res.end(JSON.stringify({ error: 'DB not configured' })); }

  try {
    const { action, payload } = body;
    let result = null;

    if (action === 'create') {
      const o = payload;
      const { rows } = await p.query(
        `INSERT INTO orders (reference, matricula, oficina, email, phone, amount_in_cents, status, plan, comprador_nombres, comprador_apellidos, comprador_tipo_id, comprador_cedula, consent_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [o.reference, o.matricula, o.oficina, o.email, o.phone, o.amountInCents, o.status, o.plan ?? 'basico', o.nombres ?? null, o.apellidos ?? null, o.tipoId ?? null, o.cedula ?? null, o.consentAt ?? null]
      );
      result = toOrder(rows[0]);
    } else if (action === 'get') {
      const { rows } = await p.query('SELECT * FROM orders WHERE reference = $1', [payload.reference]);
      result = toOrder(rows[0]);
    } else if (action === 'update') {
      const { rows } = await p.query(
        `UPDATE orders SET status = COALESCE($2, status), transaction_id = COALESCE($3, transaction_id), updated_at = now()
         WHERE reference = $1 RETURNING *`,
        [payload.reference, payload.patch?.status ?? null, payload.patch?.transactionId ?? null]
      );
      result = toOrder(rows[0]);
    } else if (action === 'claimForGeneration') {
      const { rows } = await p.query(
        `UPDATE orders SET status = 'GENERATING', transaction_id = $2, updated_at = now()
         WHERE reference = $1 AND status = 'PENDING_PAYMENT' RETURNING *`,
        [payload.reference, payload.transactionId]
      );
      result = toOrder(rows[0]);
    } else if (action === 'transition') {
      const { rows } = await p.query(
        `UPDATE orders SET status = $3, updated_at = now()
         WHERE reference = $1 AND status = ANY($2) RETURNING *`,
        [payload.reference, payload.from, payload.to]
      );
      result = toOrder(rows[0]);
    } else if (action === 'raw_sql') {
      const { text, params } = payload;
      const resQuery = await p.query(text, params);
      result = { rows: resQuery.rows, rowCount: resQuery.rowCount };
    } else {
      res.writeHead(400); return res.end(JSON.stringify({ error: 'Invalid action' }));
    }

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ result }));
  } catch (err) {
    console.error('[db-proxy] error:', err.message);
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
