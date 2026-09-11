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
