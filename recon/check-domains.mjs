const TOKEN = '***REDACTED***';
const names = ['certitradicion', 'folioreal', 'tradicionexpress', 'cedulapredial', 'ceduladelpredio', 'predia', 'trazo', 'tradito', 'verifika', 'catastrico', 'constata', 'raizlegal', 'certifica', 'avalua', 'aldiapredial'];
for (const n of names) {
  try {
    const r = await fetch('https://developers.hostinger.com/api/domains/v1/availability', {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ domain: n, tlds: ['com', 'co', 'com.co'] }),
    });
    const arr = await r.json();
    const out = Array.isArray(arr)
      ? arr.map((d) => `${d.domain.split('.').slice(1).join('.')}=${d.is_available ? '✅LIBRE' : '❌tomado'}`).join('  ')
      : `?? ${JSON.stringify(arr).slice(0, 100)}`;
    console.log(n.padEnd(18), out);
  } catch (e) {
    console.log(n.padEnd(18), 'ERR', e.message);
  }
  await new Promise((res) => setTimeout(res, 1100));
}
