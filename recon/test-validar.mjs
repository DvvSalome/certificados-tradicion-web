const url = 'https://certitradicion.com/api/validar';
const body = JSON.stringify({ oficina: 'BARRANQUILLA', matricula: '95200' });
fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
