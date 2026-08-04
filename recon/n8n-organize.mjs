// Organiza los workflows de Certitradición en n8n: tag "Certitradición" + nombres con prefijo.
// (Proyectos es Enterprise/no disponible → usamos tags + naming, que es lo nativo gratis.)
const N8N = 'https://n8n.fourgsolutions.com';
const KEY = '***REDACTED***';
const h = { 'X-N8N-API-KEY': KEY, 'content-type': 'application/json' };

const WF = [
  { id: 'BoP63y1fO1nM1NVl', name: 'Certitradición · Alertas (WhatsApp + Email)' },
  { id: 'Wz7Ns8HaYhRDuPGQ', name: 'Certitradición · Errores (notifica fallos)' },
  { id: 'MK6MD7LNLs1soAy2', name: 'Certitradición · Verificar Matrícula' },
  { id: 'LTo2zsNnutgpK7Zf', name: 'Certitradición · ⚠ Generar (OBSOLETO — ahora usa robot-service)' },
];

// 1) tag "Certitradición" (buscar o crear)
let tagId = null;
{
  const r = await fetch(`${N8N}/api/v1/tags?limit=100`, { headers: h });
  const tags = (await r.json()).data || [];
  const found = tags.find((t) => t.name === 'Certitradición');
  if (found) { tagId = found.id; console.log('tag existente:', tagId); }
  else {
    const c = await fetch(`${N8N}/api/v1/tags`, { method: 'POST', headers: h, body: JSON.stringify({ name: 'Certitradición' }) });
    const j = await c.json();
    tagId = j.id; console.log('tag creado:', tagId, c.status);
  }
}

// 2) por cada workflow: renombrar + asignar tag
for (const w of WF) {
  const g = await fetch(`${N8N}/api/v1/workflows/${w.id}`, { headers: h });
  if (!g.ok) { console.log(`  ${w.id}: GET ${g.status} (omitido)`); continue; }
  const wf = await g.json();
  const body = { name: w.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {} };
  const u = await fetch(`${N8N}/api/v1/workflows/${w.id}`, { method: 'PUT', headers: h, body: JSON.stringify(body) });
  const t = tagId ? await fetch(`${N8N}/api/v1/workflows/${w.id}/tags`, { method: 'PUT', headers: h, body: JSON.stringify([{ id: tagId }]) }) : null;
  console.log(`  ${w.id}: rename ${u.status} · tag ${t ? t.status : '-'} · "${w.name}"`);
}
console.log('\n✓ Workflows de Certitradición agrupados (tag "Certitradición" + prefijo en el nombre).');
console.log('  En n8n: filtra por el tag "Certitradición" para verlos juntos.');
