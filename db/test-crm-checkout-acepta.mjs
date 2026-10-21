// node db/test-crm-checkout-acepta.mjs — la compra por chat del CRM (/api/crm/checkout) con el payload que manda el CRM
// (datos.acepta = título del botón, ultima_respuesta). Ruta, lib/checkout, lib/config y lib/oficinas REALES; la firma,
// el SNR (verificar), las órdenes, Wompi y el CRM son dobles en memoria. Sin red, sin compras, sin mensajes.
// Caso real 20/10/2026: el botón nativo «Sí, acepto» llegaba como no aceptado (HTTP 400 de términos) y el chat volvía
// a pedir la matrícula. Aquí: solo una afirmación explícita acepta; lo ambiguo o negativo se rechaza ANTES del SNR/orden.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';

const eventos = [];
const dobles = {
  'next/server': { NextResponse: { json: (body, opts) => ({ body, status: opts?.status ?? 200 }) }, after: () => {} },
  '@/lib/crm': { verificarFirmaDelCrm: (req) => req.headers.get('x-test-firma') === 'valida', enviarLeadAlCrm: async () => ({ ok: true }), pedidoAlCrm: async () => ({ ok: true }) },
  '@/lib/verify': { verificar: async () => { eventos.push('verificar'); return { disponible: true }; } },
  '@/lib/orders': { orders: { create: async (o) => { eventos.push('orden'); return o; } } },
  '@/lib/wompi': { checkoutUrl: () => 'https://pago.invalid/demo' },
  '@/lib/download-token': { signDownload: () => 'firma-demo' },
};
const cache = new Map();
function cargar(archivo) {
  if (cache.has(archivo)) return cache.get(archivo);
  const exports = {};
  cache.set(archivo, exports);
  const js = ts.transpileModule(readFileSync(archivo, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(js, { exports, console, URL, Date, Buffer, process: { env: {} }, require(nombre) {
    if (nombre in dobles) return dobles[nombre];
    if (nombre === 'crypto') return crypto;
    if (nombre.startsWith('@/lib/')) return cargar(nombre.slice(2) + '.ts');
    throw Error(`módulo no previsto en la prueba: ${nombre}`);
  } });
  return exports;
}
const { POST } = cargar('app/api/crm/checkout/route.ts');

// El cuerpo tal cual lo arma el flow-engine del CRM (enlace-sitio): atributos del contacto + última respuesta.
const pedir = (acepta, { firma = 'valida', ultima = acepta } = {}) => POST(new Request('https://certitradicion.invalid/api/crm/checkout', {
  method: 'POST', headers: { 'x-test-firma': firma },
  body: JSON.stringify({ contacto: { nombre: 'Cliente Demo', telefono: '+573000000000', correo: 'demo@example.invalid' },
    datos: { plan_elegido: 'Básico', matricula: '001-1234567', oficina: 'Bogotá Zona Norte', correo: 'demo@example.invalid', acepta }, ultima_respuesta: ultima }),
}));
const TERMINOS = 'Debes aceptar los términos y la política de tratamiento de datos para continuar.';

const SI = ['Sí, acepto', 'Sí', 'si', 'Si, acepto', 'SÍ, ACEPTO', 'Sí, acepto'.normalize('NFD'), '  sí ,  acepto. ', 'Sí acepto', 'Acepto', 'acepto los términos', 'ok', 'Dale', 'de una', 'Claro', 'Claro que sí', '1'];
for (const v of SI) {
  eventos.length = 0;
  const r = await pedir(v);
  assert.equal(r.status, 200, `«${JSON.stringify(v)}» debía aceptar: ${JSON.stringify(r.body)}`);
  assert.deepEqual(eventos, ['verificar', 'orden'], `«${v}»: verifica en el SNR y crea la orden`);
}

const NO = ['No', 'No acepto', 'no, gracias', 'Sí, pero no acepto', 'acepto no', 'Sin aceptar', 'sino', 'Siempre no', 'quizá', 'Quizás sí', 'tal vez', '¿sí?', 'okupa', 'aceptable', 'Dale no', '10', '', '   ', 'true', null, 0, true, { title: 'Sí, acepto' }, ['Sí, acepto']];
for (const v of NO) {
  eventos.length = 0;
  const r = await pedir(v);
  assert.equal(r.status, 400, `«${JSON.stringify(v)}» no debía aceptar`);
  assert.equal(r.body.error, TERMINOS);
  assert.deepEqual(eventos, [], `«${JSON.stringify(v)}»: rechazado antes del SNR y de crear la orden`);
}

// El consentimiento sale de datos.acepta, no de la última respuesta del chat.
eventos.length = 0;
assert.equal((await pedir('No acepto', { ultima: 'Sí, acepto' })).status, 400);
assert.deepEqual(eventos, []);
// Sin firma válida no se mira nada.
eventos.length = 0;
assert.equal((await pedir('Sí, acepto', { firma: 'otra' })).status, 401);
assert.deepEqual(eventos, []);

console.log(`PASS: «Sí, acepto» y ${SI.length - 1} afirmaciones aceptan; ${NO.length} negativas/ambiguas/no-texto se rechazan antes del SNR y la orden`);
