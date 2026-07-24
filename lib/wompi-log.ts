import { getPool } from '@/lib/db';

// Bitácora de lo que MANDA Wompi. Sin esto no había forma de saber si la pasarela está
// reportando: una orden en "pendiente de pago" se ve igual si el cliente abandonó el
// checkout que si Wompi cobró y su webhook nunca llegó. Se registra TODO lo que toca el
// endpoint, incluidas las llamadas con firma inválida (son las más diagnósticas).
export type ResultadoWompi =
  | 'firma_invalida'
  | 'ignorado'
  | 'sin_referencia'
  | 'referencia_desconocida'
  | 'aprobado'
  | 'ya_procesado'
  | 'verificacion_fallida'
  | 'rechazado';

export async function registrarEventoWompi(e: {
  event?: string | null;
  reference?: string | null;
  txStatus?: string | null;
  firmaOk: boolean;
  resultado: ResultadoWompi;
}): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    const pool = getPool();
    await pool.query(`CREATE TABLE IF NOT EXISTS wompi_events (
      id BIGSERIAL PRIMARY KEY,
      at TIMESTAMPTZ NOT NULL DEFAULT now(),
      event TEXT,
      reference TEXT,
      tx_status TEXT,
      firma_ok BOOLEAN NOT NULL,
      resultado TEXT NOT NULL
    )`);
    await pool.query(
      'INSERT INTO wompi_events (event, reference, tx_status, firma_ok, resultado) VALUES ($1,$2,$3,$4,$5)',
      [e.event ?? null, e.reference ?? null, e.txStatus ?? null, e.firmaOk, e.resultado],
    );
  } catch (err) {
    // La bitácora NUNCA debe tumbar un webhook: si no se puede registrar, el pago sigue su curso.
    console.error('[wompi log] no se pudo registrar el evento:', err instanceof Error ? err.message : err);
  }
}
