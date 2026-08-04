// Republica el workflow "Verificar Matrícula" con el Code node desde recon/verify-codenode.js.
import crypto from 'crypto';
import fs from 'fs';

const N8N = 'https://n8n.fourgsolutions.com';
const KEY = '***REDACTED***';
const WF_ID = 'MK6MD7LNLs1soAy2';
const id = () => crypto.randomUUID();
const jsCode = fs.readFileSync('recon/verify-codenode.js', 'utf8');

const nodes = [
  { id: id(), name: 'Webhook · verificar', type: 'n8n-nodes-base.webhook', typeVersion: 2, position: [240, 300],
    parameters: { httpMethod: 'POST', path: 'verificar-matricula', responseMode: 'responseNode', options: {} } },
  { id: id(), name: 'Consultar (Browserless)', type: 'n8n-nodes-base.code', typeVersion: 2, position: [500, 300],
    parameters: { jsCode } },
  { id: id(), name: 'Responder', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.4, position: [760, 300],
    parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify($json) }}', options: {} } },
];
const connections = {
  'Webhook · verificar': { main: [[{ node: 'Consultar (Browserless)', type: 'main', index: 0 }]] },
  'Consultar (Browserless)': { main: [[{ node: 'Responder', type: 'main', index: 0 }]] },
};
const wf = { name: 'Verificar Matrícula', nodes, connections, settings: { executionOrder: 'v1' } };

const r = await fetch(`${N8N}/api/v1/workflows/${WF_ID}`, { method: 'PUT', headers: { 'X-N8N-API-KEY': KEY, 'content-type': 'application/json' }, body: JSON.stringify(wf) });
const j = await r.json();
console.log('PUT update:', r.status, j.id ? 'OK' : JSON.stringify(j).slice(0, 300));
const act = await fetch(`${N8N}/api/v1/workflows/${WF_ID}/activate`, { method: 'POST', headers: { 'X-N8N-API-KEY': KEY } });
console.log('activar:', act.status, (await act.json().catch(() => ({}))).active === true ? 'ACTIVO' : '?');
