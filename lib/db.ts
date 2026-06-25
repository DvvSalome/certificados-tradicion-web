import { Pool } from 'pg';

let pool: Pool | null = null;

// Pool de Postgres. Solo se usa si DATABASE_URL está configurado (producción).
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL no configurado');
    pool = new Pool({
      connectionString,
      max: 5,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}
