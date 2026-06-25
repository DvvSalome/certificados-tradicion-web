import { NextResponse } from 'next/server';
import { login, COOKIE, type Role } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { role, password } = (await req.json().catch(() => ({}))) as { role?: Role; password?: string };
  if (role !== 'cliente' && role !== 'superadmin') return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });

  const token = login(role, password ?? '');
  if (!token) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });

  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 h
  });
  return res;
}
