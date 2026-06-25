// Test de integración Node→pg→Postgres del claim atómico. Requiere DATABASE_URL.
import pg from 'pg';
const url = process.env.DATABASE_URL;
if (!url) { console.log('falta DATABASE_URL'); process.exit(1); }
const pool = new pg.Pool({ connectionString: url });
const ref = 'NODETEST-' + Date.now();
try {
  await pool.query(`INSERT INTO orders (reference,matricula,oficina,amount_in_cents) VALUES ($1,'168410','BARRANQUILLA',3990000)`, [ref]);
  const c1 = await pool.query(`UPDATE orders SET status='GENERATING',transaction_id='t1' WHERE reference=$1 AND status='PENDING_PAYMENT' RETURNING *`, [ref]);
  const c2 = await pool.query(`UPDATE orders SET status='GENERATING',transaction_id='t2' WHERE reference=$1 AND status='PENDING_PAYMENT' RETURNING *`, [ref]);
  console.log('claim#1 rowCount=' + c1.rowCount + '  claim#2 rowCount=' + c2.rowCount);
  console.log('amount_in_cents typeof=' + typeof c1.rows[0].amount_in_cents + ' value=' + c1.rows[0].amount_in_cents);
  await pool.query('DELETE FROM orders WHERE reference=$1', [ref]);
  console.log(c1.rowCount === 1 && c2.rowCount === 0 ? 'PASS: idempotencia atomica OK via Node/pg' : 'FAIL');
} catch (e) {
  console.log('ERROR', e.message);
} finally {
  await pool.end();
}
