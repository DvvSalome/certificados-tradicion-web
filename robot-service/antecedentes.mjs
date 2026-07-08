// Plan AVANZADO: verifica antecedentes judiciales (Policía Nacional) de los propietarios del inmueble,
// usando la API propia que resuelve el captcha. Toma las cédulas que el Estudio ya extrajo del CTL.
// Consulta legítima en el marco de una compraventa; el consentimiento se declara en el checkout.
const API_URL = process.env.ANTECEDENTES_API_URL || 'https://api-antecedentes.zvkdyr.easypanel.host/api/antecedentes';
const API_KEY = process.env.ANTECEDENTES_API_KEY || '';
const TIMEOUT = Number(process.env.ANTECEDENTES_TIMEOUT_MS || 90000);

// Extrae una cédula (solo dígitos) de "CC 72.277.252" / "C.C. 72277252" / "72.277.252".
// Descarta NITs (llevan guion de verificación o van precedidos de "NIT") y longitudes no plausibles.
function cedulaDe(identificacion) {
  if (!identificacion) return null;
  const raw = String(identificacion);
  if (/NIT/i.test(raw)) return null; // persona jurídica → esta API es para personas naturales (CC)
  const dig = raw.replace(/\D/g, '');
  return dig.length >= 6 && dig.length <= 10 ? dig : null;
}

export async function verificarAntecedentes(propietarios) {
  if (!API_KEY) return { ok: false, motivo: 'API de antecedentes no configurada (falta ANTECEDENTES_API_KEY)' };
  const lista = (Array.isArray(propietarios) ? propietarios : [])
    .map((p) => ({ nombre: p?.nombre || null, cedula: cedulaDe(p?.identificacion) }))
    .filter((x) => x.cedula);
  // dedupe por cédula, máx 10 (límite del batch de la API)
  const seen = new Set();
  const objetivos = [];
  for (const x of lista) { if (!seen.has(x.cedula)) { seen.add(x.cedula); objetivos.push(x); } if (objetivos.length >= 10) break; }
  if (!objetivos.length) return { ok: false, motivo: 'El CTL no registra cédulas de personas naturales para verificar (posible persona jurídica o sin identificación).' };

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), TIMEOUT);
  let json;
  try {
    const res = await fetch(API_URL, {
      method: 'POST', signal: ctrl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ cedulas: objetivos.map((o) => o.cedula), tipoDocumento: 'CC' }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    json = await res.json();
  } catch (e) {
    return { ok: false, motivo: 'No se pudo completar la verificación: ' + (e.name === 'AbortError' ? 'tiempo de espera agotado' : e.message) };
  } finally { clearTimeout(to); }

  // Normaliza: la API devuelve {batch, resultados:[...]} para lote, o el objeto plano para 1 cédula.
  const filas = Array.isArray(json?.resultados) ? json.resultados : [json];
  const nombreDe = (ced) => objetivos.find((o) => o.cedula === ced)?.nombre || null;
  const resultados = filas.map((r) => ({
    cedula: r?.cedula || r?.documentoVerificado || null,
    nombre: r?.nombre && r.nombre !== 'No registrado' ? r.nombre : nombreDe(r?.cedula),
    tieneAntecedentes: typeof r?.tieneAntecedentes === 'boolean' ? r.tieneAntecedentes : null, // null = no determinado
    hora: r?.horaConsultaOficial || null,
    error: r?.success === false ? (r?.error || 'error en la consulta') : null,
  }));
  return { ok: true, fuente: 'Policía Nacional de Colombia (antecedentes judiciales)', resultados };
}
