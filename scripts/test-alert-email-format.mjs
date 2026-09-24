import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('./alert-email-format.js', import.meta.url), 'utf8');
function render(payload, wrapped = true) {
  const context = vm.createContext({ $input: { first: () => ({ json: wrapped ? { body: payload } : payload }) } });
  const output = vm.runInContext(`(function () { ${source}\n})()`, context);
  assert.equal(output.length, 1);
  return output[0].json;
}
const amount = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(38900);
const sale = { kind: 'venta_confirmada', title: `💰 Venta confirmada: ${amount}`, message: 'Pago aprobado. Matrícula de demostración en Bogotá.\nEl certificado se está generando.', phone: '570000000000', data: { referencia: 'CTL-DEMO-001', matricula: '000-00000', oficina: 'BOGOTÁ', monto: amount }, at: '2026-09-24T19:44:49.523Z' };
const current = render(sale);
const legacy = render({ ...sale, data: { ...sale.data, monto: 3890000 } }, false);
assert.equal(current.html, legacy.html);
assert.equal(current.text, legacy.text);
assert.equal(current.to, 'four4gsolutions@gmail.com');
assert.equal(current.subject, '[CTL] ' + sale.title);
assert.equal(current.phone, sale.phone);
assert.match(current.text.replace(/\s/g, ''), /Monto:\$38\.900/);
assert.doesNotMatch(current.html, /<pre\b|3890000/);
assert.match(current.html, /Matrícula/);
assert.match(current.html, /BOGOTÁ/);
assert.match(current.html, /<br>El certificado/);
assert.match(current.html, /24 de septiembre de 2026/);
assert.match(current.html, /2:44/);
assert.match(current.html, /hora de Colombia/);

const zero = render({ ...sale, data: { monto: 0 } });
assert.match(zero.text.replace(/\s/g, ''), /Monto:\$0/);
assert.match(render({ ...sale, data: { monto: '3890000' } }).text, /Monto: 3890000/); // Strings already have their own contract.
const refund = render({ ...sale, kind: 'pago_fallido', data: { monto: amount } });
assert.match(refund.text, /Monto: \$/);
assert.match(render({ ...sale, kind: 'saldo_bajo', data: { monto: 3890000 } }).text, /Monto: 3890000/); // Never infer units in other alerts.

const attack = `<img src=x onerror="alert('x')">&`;
const escaped = '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;';
const malicious = render({ title: attack, message: attack, data: { [attack]: attack }, at: attack });
assert.equal(malicious.html.split(escaped).length - 1, 4); // title, message, label and value.
assert.doesNotMatch(malicious.html, /<img|<script/);
assert.match(malicious.html, /Fecha no disponible/);
assert.equal(malicious.phone, '');
for (const at of [undefined, null, '', 'not-a-date']) {
  const generic = render({ kind: 'generacion_fallida', message: 'Revisar generación', data: { error: null, oficina: '', intentos: 0 }, at });
  assert.equal(generic.subject, '[CTL] Alerta');
  assert.match(generic.text, /intentos: 0/);
  assert.match(generic.text, /Fecha no disponible/);
  assert.doesNotMatch(generic.html, /Invalid Date|undefined/);
}
assert.doesNotMatch(render({ message: 'Sin contexto' }).html, /scope="row"/);
console.log('PASS: monto COP nuevo/legacy, cero, strings y otras alertas, contrato n8n, escape HTML, acentos y fecha de Colombia.');

if (process.argv.includes('--preview')) {
  const directory = new URL('../docs/evidence/alertas-20260924/', import.meta.url);
  mkdirSync(directory, { recursive: true });
  writeFileSync(new URL('preview.html', directory), current.html + '\n');
  console.log('Preview sintético: docs/evidence/alertas-20260924/preview.html');
}
