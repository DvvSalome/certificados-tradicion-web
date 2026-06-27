// HTML del Estudio de Títulos (email-safe NO requerido: se renderiza a PDF con Chrome). Branded Certitradición.
const SEMA = { verde: { c: '#0F7A52', bg: '#E8F5EF', t: 'Sin alertas relevantes' }, amarillo: { c: '#B7791F', bg: '#FEF6E7', t: 'Requiere atención' }, rojo: { c: '#B42318', bg: '#FDECEC', t: 'Riesgo alto' } };
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

export function estudioHtml(e, { matricula, oficina, fecha }) {
  const s = SEMA[e.semaforo] || SEMA.amarillo;
  const row = (k, v) => v ? `<tr><td class="k">${esc(k)}</td><td class="v">${esc(v)}</td></tr>` : '';
  const nivelClass = (n) => (n === 'rojo' || n === 'amarillo' ? n : '');
  const banderas = (e.banderas || []).map((b) => `<div class="flag ${nivelClass(b.nivel)}"><b>${esc(b.titulo)}</b><span>${esc(b.detalle)}</span></div>`).join('') || '<p class="muted">No se detectaron banderas de riesgo en el documento.</p>';
  const props = (e.propietarios || []).map((p) => `<li><b>${esc(p.nombre)}</b>${p.identificacion ? ' · ' + esc(p.identificacion) : ''} <span class="muted">${esc(p.modo || '')}${p.anotacion ? ' (' + esc(p.anotacion) + ')' : ''}</span></li>`).join('') || '<li class="muted">No identificados en el texto.</li>';
  const grav = (e.gravamenes || []).map((g) => `<li><b>${esc(g.tipo)}</b> ${g.vigente ? '<span class="tag v">VIGENTE</span>' : '<span class="tag">no vigente</span>'}<br><span class="muted">${esc(g.descripcion)}${g.anotacion ? ' · ' + esc(g.anotacion) : ''}</span></li>`).join('') || '<li class="muted">Sin gravámenes ni limitaciones vigentes encontrados.</li>';
  // Alertas (listas restrictivas / lavado): verde si no hay coincidencias, rojo por cada posible coincidencia.
  const A = e.alertas;
  const alertasHtml = !A || A.ok === false
    ? '<p class="muted">Tamizaje de listas restrictivas no disponible en esta emisión.</p>'
    : (A.coincidencias && A.coincidencias.length)
      ? A.coincidencias.map((c) => `<div class="flag rojo"><b>Posible coincidencia: ${esc(c.propietario)}</b><span>${esc(c.lista)} · ${esc(c.entrada)}${c.programa ? ' (' + esc(c.programa) + ')' : ''}. Es una coincidencia POSIBLE por nombre — requiere verificación manual, no es una determinación.</span></div>`).join('')
      : '<div class="flag" style="border-left-color:#0F7A52;background:#E8F5EF"><b style="color:#0F7A52">Sin coincidencias en listas restrictivas</b><span>Los propietarios no aparecen en la Lista OFAC/SDN (Clinton) de lavado de activos.</span></div>';
  // Avalúo comercial digital (referencial).
  const V = e.avaluo;
  const avaluoHtml = !V || !V.disponible
    ? '<p class="muted">Estimado no disponible (no se identificó el área del inmueble en el CTL).</p>'
    : `<div class="resumen"><b style="font-size:20px;color:#103A73">${esc(V.estimado)}</b> <span class="muted">(rango ${esc(V.min)} – ${esc(V.max)})</span><br><span class="muted" style="font-size:12px">Área ${esc(V.areaM2)} m²${V.ciudad ? ' · referencia ' + esc(V.ciudad) : ''}. ${esc(V.nota)}</span></div>`;
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif} body{margin:0;color:#0D1B2A}
  .page{padding:40px 44px}
  .head{display:flex;align-items:center;gap:12px;border-bottom:2px solid #103A73;padding-bottom:16px}
  .brand{font-weight:800;font-size:20px;color:#103A73} .sub{font-size:10px;letter-spacing:.18em;color:#8593A3}
  h1{font-size:22px;margin:22px 0 4px} .muted{color:#5B6B7E}
  .sema{display:flex;align-items:center;gap:12px;background:${s.bg};border-radius:12px;padding:14px 18px;margin:16px 0}
  .dot{width:26px;height:26px;border-radius:999px;background:${s.c}} .sema b{color:${s.c};font-size:16px}
  table{width:100%;border-collapse:collapse;margin:6px 0 14px} .k{color:#5B6B7E;width:160px;padding:5px 0} .v{font-weight:600;padding:5px 0}
  h2{font-size:14px;color:#103A73;margin:18px 0 6px;text-transform:uppercase;letter-spacing:.04em}
  ul{margin:6px 0;padding-left:18px} li{margin:6px 0}
  .tag{font-size:10px;background:#eef1f7;color:#5B6B7E;border-radius:6px;padding:1px 6px} .tag.v{background:#FDECEC;color:#B42318}
  .flag{display:flex;flex-direction:column;border-left:4px solid #999;background:#fafbfd;padding:8px 12px;margin:6px 0;border-radius:6px}
  .flag.rojo{border-color:#B42318;background:#FDECEC} .flag.amarillo{border-color:#B7791F;background:#FEF6E7}
  .flag span{font-size:12px;color:#5B6B7E}
  .resumen{background:#EEF3FB;border-radius:12px;padding:16px;margin:16px 0;font-size:14px;line-height:1.5}
  .disc{font-size:10px;color:#8593A3;border-top:1px solid #E3E9F1;margin-top:24px;padding-top:12px;line-height:1.5}
  </style></head><body><div class="page">
    <div class="head"><span class="brand">Certitradición</span><span class="sub">ESTUDIO DE TÍTULOS</span></div>
    <h1>Estudio de Títulos del inmueble</h1>
    <p class="muted">Matrícula ${esc(matricula)} · ${esc(oficina)} · ${esc(fecha)}</p>
    <div class="sema"><div class="dot"></div><div><b>${s.t}</b><br><span class="muted">Semáforo de riesgo según el Certificado de Tradición y Libertad.</span></div></div>
    <div class="resumen">${esc(e.resumen) || 'Resumen no disponible.'}</div>
    <h2>Identificación del inmueble</h2>
    <table>${row('Matrícula', e.inmueble?.matricula)}${row('Dirección', e.inmueble?.direccion)}${row('Círculo registral', e.inmueble?.circulo)}${row('Área', e.inmueble?.area)}</table>
    <h2>Propietarios y tradición</h2><ul>${props}</ul>
    <h2>Gravámenes y limitaciones</h2><ul>${grav}</ul>
    <h2>Banderas de riesgo</h2>${banderas}
    <h2>Alertas — listas restrictivas (lavado de activos)</h2>${alertasHtml}
    <h2>Avalúo comercial · estimado digital</h2>${avaluoHtml}
    <p class="disc">Análisis informativo automatizado generado a partir del Certificado de Tradición y Libertad. No constituye asesoría jurídica profesional ni reemplaza el estudio de un abogado.</p>
  </div></body></html>`;
}
