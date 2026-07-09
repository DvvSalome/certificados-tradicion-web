import { NextResponse } from 'next/server';
import { login, COOKIE } from '@/lib/admin';

export const runtime = 'nodejs';

// Anti-brute-force del login admin (por IP). En memoria: no es perfecto en serverless (varias instancias),
// pero frena de forma significativa un ataque de fuerza bruta contra superadmin (gobierna ingresos, PII y
// generación con costo real). Ventana estricta.
const attempts = new Map<string, number[]>();
const LOGIN_MAX = 8;
const LOGIN_WINDOW_MS = 15 * 60_000;
function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  return (xff ? xff.split(',')[0] : '') || req.headers.get('x-real-ip') || 'anon';
}
function loginRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (attempts.get(ip) || []).filter((t) => now - t < LOGIN_WINDOW_MS);
  arr.push(now);
  attempts.set(ip, arr);
  return arr.length > LOGIN_MAX;
}

export async function POST(req: Request) {
  if (loginRateLimited(clientIp(req))) {
    return NextResponse.json({ error: 'Demasiados intentos. Espera unos minutos.' }, { status: 429 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const token = login('superadmin', password ?? '');
  if (!token) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });

  const res = NextResponse.json({ ok: true, role: 'superadmin' });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 h
  });
  return res;
}
