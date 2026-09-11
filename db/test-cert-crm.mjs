// node db/test-cert-crm.mjs — sin red, sin documentos reales ni mensajes al cliente.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const events = [], afters = [];
const source = ts.transpileModule(readFileSync('app/api/admin/cert/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(source, { exports, Buffer, console, process: { env: { N8N_WEBHOOK_SECRET: 'test-only' } }, require(name) {
  if (name === 'next/server') return { NextResponse: { json: (body, opts) => ({ body, status: opts?.status ?? 200 }) }, after: cb => afters.push(cb) };
  if (name === '@/lib/db') return { getPool: () => ({ query: async () => { events.push('stored'); return { rowCount: 1 }; } }) };
  if (name === '@/lib/crm') return { pedidoAlCrmPorRef: async ref => { events.push(ref); return { ok: true }; } };
  throw Error(name);
}});
const request = (body, secret = 'test-only') => new Request('https://example.test/api/admin/cert', { method: 'POST', headers: { 'x-webhook-secret': secret }, body: JSON.stringify(body) });
assert.equal((await exports.POST(request({}, 'wrong'))).status, 401);
assert.equal((await exports.POST(request({ reference: 'order', pdfBase64: 'invalid' }))).status, 400);
assert.deepEqual(events, []);
assert.equal(afters.length, 0);
assert.equal((await exports.POST(request({ reference: 'order', pdfBase64: Buffer.from('%PDF-test').toString('base64') }))).status, 200);
assert.deepEqual(events, ['stored']);
await afters[0]();
assert.deepEqual(events, ['stored', 'order']);
console.log('PASS: solo sincroniza después de guardar un PDF autorizado y válido');
const queries = [], synced = [], backfill = {};
vm.runInNewContext(ts.transpileModule(readFileSync('app/api/admin/backfill-crm/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
  exports: backfill, URL, Date, process: { env: { DATABASE_URL: 'test' } }, require(name) {
    if (name === 'next/server') return { NextResponse: { json: (body, opts) => ({ body, status: opts?.status ?? 200 }) } };
    if (name === '@/lib/admin') return { getSession: async () => null };
    if (name === '@/lib/crm') return { verificarFirmaDelCrm: req => req.headers.get('x-test-auth') === 'yes', pedidoAlCrmPorRef: async ref => { synced.push(ref); return { ok: true }; } };
    if (name === '@/lib/db') return { getPool: () => ({ query: async (sql, params) => { queries.push({sql, params: Array.from(params)}); return { rows: [{ reference: params[0], updated_at: '2026-09-11T20:00:00Z' }] }; } }) };
    throw Error(name);
  }
});
assert.equal((await backfill.POST(new Request('https://example.test/api/admin/backfill-crm?reference=one', {method:'POST'}))).status,403);
assert.equal(queries.length,0);
await backfill.POST(new Request('https://example.test/api/admin/backfill-crm?reference=one', {method:'POST',headers:{'x-test-auth':'yes'}}));
assert.ok(queries[0].sql.includes('WHERE reference = $1'));
assert.deepEqual(queries[0].params,['one']);
assert.deepEqual(synced,['one']);
console.log('PASS: refresco firmado y limitado a una referencia, sin replay masivo');
