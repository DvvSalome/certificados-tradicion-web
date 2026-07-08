// Plan AVANZADO: verifica antecedentes judiciales (Policía Nacional) de los propietarios del inmueble,
// usando la API propia que resuelve el captcha. Toma las cédulas que el Estudio ya extrajo del CTL.
// Consulta legítima en el marco de una compraventa; el consentimiento se declara en el checkout.
const API_URL = process.env.ANTECEDENTES_API_URL || 'https://api-antecedentes.zvkdyr.easypanel.host/api/antecedentes';
const API_KEY = process.env.ANTECEDENTES_API_KEY || '';
const TIMEOUT = Number(process.env.ANTECEDENTES_TIMEOUT_MS || 90000);

// Detecta persona JURÍDICA (empresa): la API de antecedentes judiciales es para personas naturales (CC),
// no para NITs. Se detecta por el prefijo "NIT" o por la razón social (S.A.S, LTDA, & CIA, etc.).
const RE_JURIDICA = /\b(S\.?\s?A\.?\s?S|S\.?\s?A\.?|LTDA|E\.?\s?U\.?|S\.?\s?C\.?\s?A|S\.?\s?EN\.?\s?C|&\s?CIA|CIA\.?|FUNDACI[OÓ]N|CORPORACI[OÓ]N|ASOCIACI[OÓ]N|COOPERATIVA|CONSORCIO|UNI[OÓ]N\s+TEMPORAL)\b/i;
function esJuridica(p) {
  return /NIT/i.test(String(p?.identificacion || '')) || RE_JURIDICA.test(String(p?.nombre || ''));
}
// Extrae una cédula (solo dígitos) de "CC 72.277.252" / "C.C. 72277252" / "72.277.252".
function cedulaDe(identificacion) {
  if (!identificacion) return null;
  const dig = String(identificacion).replace(/\D/g, '');
  return dig.length >= 6 && dig.length <= 10 ? dig : null;
}

export async function verificarAntecedentes(propietarios) {
  if (!API_KEY) return { ok: false, motivo: 'API de antecedentes no configurada (falta ANTECEDENTES_API_KEY)' };
  const props = Array.isArray(propietarios) ? propietarios : [];
  // Persona jurídica → no se consulta (los antecedentes judiciales son de personas naturales).
  const omitidos = props.filter(esJuridica).map((p) => p?.nombre).filter(Boolean);
  const lista = props.filter((p) => !esJuridica(p))
    .map((p) => ({ nombre: p?.nombre || null, cedula: cedulaDe(p?.identificacion) }))
    .filter((x) => x.cedula);
  // dedupe por cédula, máx 10 (límite del batch de la API)
  const seen = new Set();
  const objetivos = [];
  for (const x of lista) { if (!seen.has(x.cedula)) { seen.add(x.cedula); objetivos.push(x); } if (objetivos.length >= 10) break; }
  if (!objetivos.length) {
    return { ok: false, omitidos, motivo: omitidos.length
      ? 'El/los propietario(s) es/son persona(s) jurídica(s); la verificación de antecedentes judiciales aplica solo a personas naturales.'
      : 'El CTL no registra cédulas de personas naturales para verificar.' };
  }

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
  return { ok: true, fuente: 'Policía Nacional de Colombia (antecedentes judiciales)', resultados, omitidos };
}
