import { Pool } from 'pg';

let pool: any = null;

// Pool de Postgres. Solo se usa si DATABASE_URL está configurado (producción).
export function getPool(): { query: <T = any>(text: string, params?: any[]) => Promise<{rows: T[], rowCount: number | null}>, connect: () => Promise<any> } {
  if (!pool) {
    if (process.env.VERCEL) {
      console.log('Running on Vercel, using HTTP proxy for DB');
      pool = {
        query: async (text: string, params?: any[]) => {
          const PROXY_URL = 'https://certificados.fourgsolutions.com/api/orders';
          const res = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET || ''
            },
            body: JSON.stringify({ action: 'raw_sql', payload: { text, params } })
          });
          if (!res.ok) {
            const txt = await res.text().catch(() => '');
            throw new Error(`DB Proxy error ${res.status}: ${txt}`);
          }
          const json = await res.json();
          if (json.error) throw new Error(json.error);
          return json.result; // Devuelve { rows, rowCount }
        },
        connect: async () => ({
          query: async (text: string, params?: any[]) => pool.query(text, params),
          release: () => {}
        })
      };
    } else {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) throw new Error('DATABASE_URL no configurado');
      pool = new Pool({
        connectionString,
        max: 5,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      });
    }
  }
  return pool;
}
