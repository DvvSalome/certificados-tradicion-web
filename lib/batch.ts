import { getPool } from './db';
import { recordGeneration } from './admin';

export interface BatchItemInput { matricula: string; oficina: string }

const n = (v: unknown) => Number(v ?? 0);
const iso = (d: unknown) => (d instanceof Date ? d.toISOString() : d ? String(d) : null);

// Crea un lote + sus ítems PENDING. Devuelve {batchId, total}.
export async function createBatch(createdBy: string, items: BatchItemInput[]): Promise<{ batchId: number; total: number }> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('INSERT INTO batches (created_by, total) VALUES ($1, $2) RETURNING id', [createdBy, items.length]);
    const batchId = Number(rows[0].id);
    for (const it of items) {
      await client.query('INSERT INTO batch_items (batch_id, matricula, oficina) VALUES ($1, $2, $3)', [batchId, it.matricula, it.oficina]);
    }
    await client.query('COMMIT');
    return { batchId, total: items.length };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// El robot pide el SIGUIENTE ítem pendiente (loop secuencial). Claim atómico: SKIP LOCKED evita
// que dos workers tomen el mismo. Marca el batch RUNNING. Devuelve null si no quedan pendientes.
export async function claimNextItem(): Promise<{ itemId: number; batchId: number; matricula: string; oficina: string } | null> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT id, batch_id, matricula, oficina FROM batch_items
       WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED`,
    );
    if (!rows[0]) { await client.query('COMMIT'); return null; }
    const it = rows[0];
    await client.query(`UPDATE batch_items SET status = 'RUNNING' WHERE id = $1`, [it.id]);
    await client.query(`UPDATE batches SET status = 'RUNNING' WHERE id = $1 AND status = 'QUEUED'`, [it.batch_id]);
    await client.query('COMMIT');
    return { itemId: Number(it.id), batchId: Number(it.batch_id), matricula: it.matricula, oficina: it.oficina };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// El robot reporta el resultado de un ítem. Registra la generación y cierra el batch si ya no quedan pendientes.
export async function reportItem(itemId: number, result: { status: 'OK' | 'FAILED'; costCents?: number | null; error?: string | null }): Promise<void> {
  const pool = getPool();
  // Claim atómico: solo el PRIMER reporte (item aún RUNNING) cuenta. Un reporte repetido (reintento del
  // robot tras respuesta perdida, o replay) no retorna fila → no duplica recordGeneration ni alerta.
  const { rows } = await pool.query(
    `UPDATE batch_items SET status = $2, cost_cents = $3, error = $4, processed_at = now() WHERE id = $1 AND status = 'RUNNING' RETURNING batch_id, matricula, oficina`,
    [itemId, result.status, result.costCents ?? null, result.error ?? null],
  );
  const item = rows[0];
  if (!item) return; // ya reportado (o id inexistente) → no-op idempotente
  await recordGeneration({ matricula: item.matricula, oficina: item.oficina, status: result.status, costCents: result.costCents ?? null, error: result.error ?? null });
  // ¿quedan pendientes/corriendo en este batch? si no, DONE.
  const { rows: left } = await pool.query(`SELECT COUNT(*) AS c FROM batch_items WHERE batch_id = $1 AND status IN ('PENDING','RUNNING')`, [item.batch_id]);
  if (n(left[0].c) === 0) await pool.query(`UPDATE batches SET status = 'DONE' WHERE id = $1`, [item.batch_id]);
}

export interface BatchView {
  id: number; status: string; total: number; createdBy: string; createdAt: string;
  counts: { pending: number; running: number; ok: number; failed: number };
  items: { matricula: string; oficina: string; status: string; costCents: number | null; error: string | null }[];
}

export async function getBatch(id: number): Promise<BatchView | null> {
  const pool = getPool();
  const [b, items] = await Promise.all([
    pool.query('SELECT * FROM batches WHERE id = $1', [id]),
    pool.query('SELECT matricula, oficina, status, cost_cents, error FROM batch_items WHERE batch_id = $1 ORDER BY created_at ASC', [id]),
  ]);
  if (!b.rows[0]) return null;
  return view(b.rows[0], items.rows);
}

export async function listBatches(limit = 10): Promise<BatchView[]> {
  const pool = getPool();
  const { rows } = await pool.query('SELECT * FROM batches ORDER BY created_at DESC LIMIT $1', [limit]);
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const { rows: items } = await pool.query('SELECT batch_id, matricula, oficina, status, cost_cents, error FROM batch_items WHERE batch_id = ANY($1) ORDER BY created_at ASC', [ids]);
  return rows.map((b) => view(b, items.filter((i) => String(i.batch_id) === String(b.id))));
}

function view(b: Record<string, unknown>, items: Record<string, unknown>[]): BatchView {
  const counts = { pending: 0, running: 0, ok: 0, failed: 0 };
  for (const i of items) {
    if (i.status === 'PENDING') counts.pending++;
    else if (i.status === 'RUNNING') counts.running++;
    else if (i.status === 'OK') counts.ok++;
    else if (i.status === 'FAILED') counts.failed++;
  }
  return {
    id: n(b.id), status: String(b.status), total: n(b.total), createdBy: String(b.created_by), createdAt: iso(b.created_at)!,
    counts,
    items: items.map((i) => ({ matricula: String(i.matricula), oficina: String(i.oficina), status: String(i.status), costCents: i.cost_cents === null || i.cost_cents === undefined ? null : n(i.cost_cents), error: (i.error as string) ?? null })),
  };
}
