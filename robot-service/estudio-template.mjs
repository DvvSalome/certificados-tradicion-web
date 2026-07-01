// HTML del Estudio de Títulos → se renderiza a PDF con Chrome (browserless). Branded Certitradición (con sello).
const SEMA = {
  verde: { c: '#0F7A52', bg: '#E8F5EF', ring: '#B7E4CE', t: 'Sin alertas relevantes' },
  amarillo: { c: '#B7791F', bg: '#FEF6E7', ring: '#F6DFA8', t: 'Requiere atención' },
  rojo: { c: '#B42318', bg: '#FDECEC', ring: '#F5C2C0', t: 'Riesgo alto' },
};
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

// Sello Certitradición (documento + firma + pluma) — trazo blanco para el header morado.
const SELLO = `<svg width="46" height="46" viewBox="0 0 96 96" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M34 9 H57 a7 7 0 0 1 7 7 V80 a7 7 0 0 1 -7 7 H23 a7 7 0 0 1 -7 -7 V26 Z"/>
  <path d="M16 26 H29 a5 5 0 0 0 5 -5 V9"/>
  <path d="M25 34 H53"/><path d="M25 43 H49"/><path d="M25 52 H53"/><path d="M25 61 H46"/>
  <path d="M25 75 c 4 -7 8 -5 9 1 c 1 5 5 5 7 -1 c 1 -4 5 -3 6 1 c 1 3 4 4 8 -1" stroke-width="4"/>
  <path d="M25 84 H50"/>
  <path d="M75.5 13.4 A 5.8 5.8 0 0 1 86 18.2 L 67.6 59.8 L 55 75.5 L 57 55.2 Z" fill="#fff" stroke="none"/>
</svg>`;

export function estudioHtml(e, { matricula, oficina, fecha }) {
  const s = SEMA[e.semaforo] || SEMA.amarillo;
  const row = (k, v) => v ? `<tr><td class="k">${esc(k)}</td><td class="v">${esc(v)}</td></tr>` : '';
  const nivelClass = (n) => (n === 'rojo' || n === 'amarillo' ? n : '');
  const banderas = (e.banderas || []).map((b) => `<div class="flag ${nivelClass(b.nivel)}"><b>${esc(b.titulo)}</b><span>${esc(b.detalle)}</span></div>`).join('')
    || '<div class="flag ok"><b>Sin banderas de riesgo</b><span>No se detectaron alertas de riesgo en el documento.</span></div>';
  const props = (e.propietarios || []).map((p) => `<li><b>${esc(p.nombre)}</b>${p.identificacion ? ' · ' + esc(p.identificacion) : ''} <span class="muted">${esc(p.modo || '')}${p.anotacion ? ' (anot. ' + esc(p.anotacion) + ')' : ''}</span></li>`).join('') || '<li class="muted">No identificados en el texto.</li>';
  const grav = (e.gravamenes || []).map((g) => `<li><b>${esc(g.tipo)}</b> ${g.vigente ? '<span class="tag v">VIGENTE</span>' : '<span class="tag">no vigente</span>'}<br><span class="muted">${esc(g.descripcion)}${g.anotacion ? ' · anot. ' + esc(g.anotacion) : ''}</span></li>`).join('')
    || '<li class="ok-li">✓ Sin gravámenes ni limitaciones vigentes encontrados.</li>';
  const A = e.alertas;
  const alertasHtml = !A || A.ok === false
    ? '<p class="muted">Tamizaje de listas restrictivas no disponible en esta emisión.</p>'
    : (A.coincidencias && A.coincidencias.length)
      ? A.coincidencias.map((c) => `<div class="flag rojo"><b>Posible coincidencia: ${esc(c.propietario)}</b><span>${esc(c.lista)} · ${esc(c.entrada)}${c.programa ? ' (' + esc(c.programa) + ')' : ''}. Coincidencia POSIBLE por nombre — requiere verificación manual, no es una determinación.</span></div>`).join('')
      : '<div class="flag ok"><b>Sin coincidencias en listas restrictivas</b><span>Los propietarios no aparecen en la Lista OFAC/SDN (Clinton) de lavado de activos.</span></div>';
  const V = e.avaluo;
  const avaluoHtml = !V || !V.disponible
    ? '<p class="muted">Estimado no disponible: no se pudo determinar el área del inmueble en el CTL.</p>'
    : `<div class="avaluo"><div class="est">${esc(V.estimado)}</div><div class="rango">Rango referencial ${esc(V.min)} – ${esc(V.max)}</div><div class="muted" style="font-size:11.5px;margin-top:6px">Área ${esc(V.areaM2)} m²${V.ciudad ? ' · valor de referencia zona ' + esc(V.ciudad) : ''}. ${esc(V.nota)}</div></div>`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif} body{margin:0;color:#0D1B2A;font-size:13px;line-height:1.5}
  .header{display:flex;align-items:center;gap:14px;background:#774B78;color:#fff;padding:22px 44px}
  .header .brand{font-weight:800;font-size:21px;letter-spacing:-.2px} .header .sub{font-size:10px;letter-spacing:.22em;color:rgba(255,255,255,.72);margin-top:2px}
  .header .meta{margin-left:auto;text-align:right;font-size:11px;color:rgba(255,255,255,.85);line-height:1.6}
  .page{padding:30px 44px 40px}
  h1{font-size:23px;margin:4px 0 2px;letter-spacing:-.3px} .lead{color:#5B6B7E;font-size:12.5px;margin:0 0 4px} .muted{color:#5B6B7E}
  .sema{display:flex;align-items:center;gap:14px;background:${s.bg};border:1px solid ${s.ring};border-radius:14px;padding:16px 20px;margin:18px 0}
  .dot{width:30px;height:30px;border-radius:999px;background:${s.c};flex-shrink:0;box-shadow:0 0 0 5px ${s.bg},0 0 0 6px ${s.ring}} .sema b{color:${s.c};font-size:17px}
  .resumen{background:#F7F5F9;border-left:4px solid #774B78;border-radius:10px;padding:15px 18px;margin:14px 0;font-size:13.5px;line-height:1.6}
  h2{font-size:12px;color:#774B78;margin:22px 0 8px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;border-bottom:1px solid #ECE6EE;padding-bottom:5px}
  table{width:100%;border-collapse:collapse;margin:2px 0} .k{color:#8593A3;width:170px;padding:6px 0;font-size:12px} .v{font-weight:600;padding:6px 0}
  ul{margin:6px 0;padding-left:18px;list-style:none} li{margin:8px 0;padding-left:2px} .ok-li{color:#0F7A52;font-weight:600;list-style:none;margin-left:-16px}
  .tag{font-size:9.5px;font-weight:700;background:#eef1f7;color:#5B6B7E;border-radius:5px;padding:2px 7px;vertical-align:middle} .tag.v{background:#FDECEC;color:#B42318}
  .flag{display:flex;flex-direction:column;border-left:4px solid #999;background:#fafbfd;padding:10px 14px;margin:8px 0;border-radius:8px}
  .flag b{font-size:13px} .flag.rojo{border-color:#B42318;background:#FDECEC} .flag.amarillo{border-color:#B7791F;background:#FEF6E7} .flag.ok{border-color:#0F7A52;background:#E8F5EF} .flag.ok b{color:#0F7A52}
  .flag span{font-size:11.5px;color:#5B6B7E;margin-top:2px}
  .avaluo{background:#F7F5F9;border:1px solid #ECE6EE;border-radius:12px;padding:16px 18px;margin:8px 0}
  .avaluo .est{font-size:26px;font-weight:800;color:#1B2A3A;letter-spacing:-.5px} .avaluo .rango{color:#774B78;font-weight:600;font-size:12.5px;margin-top:2px}
  .disc{font-size:10px;color:#8593A3;border-top:1px solid #E3E9F1;margin-top:26px;padding-top:12px;line-height:1.55}
  .foot{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:10px;color:#8593A3}
  </style></head><body>
    <div class="header">
      ${SELLO}
      <div><div class="brand">Certitradición</div><div class="sub">ESTUDIO DE TÍTULOS</div></div>
      <div class="meta">Matrícula <b>${esc(matricula)}</b><br>${esc(oficina)}<br>${esc(fecha)}</div>
    </div>
    <div class="page">
      <h1>Estudio de Títulos del inmueble</h1>
      <p class="lead">Análisis automatizado del Certificado de Tradición y Libertad</p>
      <div class="sema"><div class="dot"></div><div><b>${s.t}</b><br><span class="muted">Semáforo de riesgo según las anotaciones vigentes del folio.</span></div></div>
      <div class="resumen">${esc(e.resumen) || 'Resumen no disponible.'}</div>
      <h2>Identificación del inmueble</h2>
      <table>${row('Matrícula', e.inmueble?.matricula)}${row('Dirección', e.inmueble?.direccion)}${row('Círculo registral', e.inmueble?.circulo)}${row('Área', e.inmueble?.area)}</table>
      <h2>Propietarios y tradición</h2><ul>${props}</ul>
      <h2>Gravámenes y limitaciones vigentes</h2><ul>${grav}</ul>
      <h2>Banderas de riesgo</h2>${banderas}
      <h2>Alertas · listas restrictivas (lavado de activos)</h2>${alertasHtml}
      <h2>Avalúo comercial · estimado digital</h2>${avaluoHtml}
      <p class="disc">Análisis informativo automatizado generado a partir del Certificado de Tradición y Libertad. No constituye asesoría jurídica profesional ni reemplaza el estudio de un abogado. El avalúo es un estimado referencial, no un avalúo formal de perito.</p>
      <div class="foot">${SELLO.replace('width="46" height="46"', 'width="16" height="16"').replace(/stroke="#fff"/g, 'stroke="#8593A3"').replace(/fill="#fff"/g, 'fill="#8593A3"')} Certitradición · certitradicion.com</div>
    </div>
  </body></html>`;
}
