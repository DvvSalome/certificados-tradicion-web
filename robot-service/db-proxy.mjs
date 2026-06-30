import pg from 'pg';
const { Pool } = pg;

let pool = null;
function getPool() {
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
    plan: (row.plan === 'express' ? 'express' : 'basico'),
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
        `INSERT INTO orders (reference, matricula, oficina, email, phone, amount_in_cents, status, plan)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [o.reference, o.matricula, o.oficina, o.email, o.phone, o.amountInCents, o.status, o.plan ?? 'basico']
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
