// HTML del Estudio de Títulos v2 → se renderiza a PDF con Chrome (browserless). Branded Certitradición.
// Estructura calcada de un estudio de títulos profesional: concepto, situación jurídica, cadena de
// tradición, gravámenes, medidas cautelares, documentos a exigir, recomendaciones y salvedades.
// Tolerante a data v1 (todo campo nuevo es opcional; estados vacíos honestos).
const SEMA = {
  verde: { c: '#0F7A52', bg: '#E8F5EF', ring: '#B7E4CE', t: 'Sin alertas relevantes' },
  amarillo: { c: '#B7791F', bg: '#FEF6E7', ring: '#F6DFA8', t: 'Requiere atención' },
  rojo: { c: '#B42318', bg: '#FDECEC', ring: '#F5C2C0', t: 'Riesgo alto' },
};
const CONCEPTO = {
  favorable: { label: 'FAVORABLE', pal: SEMA.verde, sub: 'El folio no registra obstáculos para la negociación.' },
  favorable_condicionado: { label: 'FAVORABLE · CONDICIONADO', pal: SEMA.amarillo, sub: 'Viable, sujeto a subsanar las condiciones listadas antes de firmar.' },
  desfavorable: { label: 'DESFAVORABLE', pal: SEMA.rojo, sub: 'Se desaconseja negociar hasta resolver los impedimentos listados.' },
};
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

// Iconos de sección (línea, 24x24). El helper `sec` arma el <h2> con su icono.
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
  scale: '<path d="M12 3v18"/><path d="M8 21h8"/><path d="M6 7h12"/><path d="m6 7-3 6a3 3 0 0 0 6 0Z"/><path d="m18 7-3 6a3 3 0 0 0 6 0Z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5"/><path d="M17.5 20a5.5 5.5 0 0 0-2.5-4.5"/>',
  history: '<path d="M3 12a9 9 0 1 0 2.6-6.3L3 8"/><path d="M3 3v5h5"/><path d="M12 8v4l3 2"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  gavel: '<path d="m13 12-8.5 8.5"/><path d="M3 21h7"/><path d="m11 6 7 7 2.5-2.5-7-7Z"/><path d="m8.5 8.5 7 7"/>',
  flag: '<path d="M4 21V4"/><path d="M4 4h13l-2.5 4L17 12H4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  usercheck: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 10-3.2"/><path d="m15.5 18 2 2 4-4"/>',
  money: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11"/><path d="M15 9a2.4 2 0 0 0-3-1.4c-1.5 0-2.4.8-2.4 1.9s.9 1.7 2.4 2 2.5.8 2.5 2-1 1.6-2.5 1.6A2.4 2 0 0 1 9 14.7"/>',
  filelist: '<path d="M14 3v5h5"/><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M8.5 13h7"/><path d="M8.5 17h5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01"/>',
};
const sec = (icon, t) => `<h2><svg class="h2ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon] || ''}</svg><span>${esc(t)}</span></h2>`;
// Envuelve una sección (header + contenido) en su propia tarjeta. `wide` permite que se parta entre páginas
// (para la tabla larga de la cadena de tradición).
const block = (inner, wide) => inner ? `<section class="block${wide ? ' block-wide' : ''}">${inner}</section>` : '';

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

  /* ── Alcance (línea bajo el lead) ── */
  const al = e.alcance || {};
  const alcanceBits = [
    al.fechaApertura || al.fechaExpedicionCTL
      ? `Período analizado: ${esc(al.fechaApertura || 'apertura del folio')} — ${esc(al.fechaExpedicionCTL || 'fecha de expedición')}` : '',
    al.totalAnotaciones ? `${esc(al.totalAnotaciones)} anotaciones` : '',
    e.inmueble?.estadoFolio ? `Folio ${esc(e.inmueble.estadoFolio)}` : '',
  ].filter(Boolean).join(' · ');
  const alcanceHtml = alcanceBits ? `<p class="alcance">${alcanceBits}</p>` : '';

  /* ── Concepto (caja destacada, veredicto derivado en código) ── */
  const co = e.concepto && CONCEPTO[e.concepto.estado] ? e.concepto : null;
  const coPal = co ? CONCEPTO[co.estado] : null;
  const coIcon = {
    favorable: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    favorable_condicionado: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9.5v4"/><path d="M12 17h.01"/>',
    desfavorable: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/>',
  }[co ? co.estado : ''] || '';
  const conceptoHtml = co ? `
    <div class="concepto" style="border-color:${coPal.pal.ring};border-left-color:${coPal.pal.c};background:${coPal.pal.bg}">
      <div class="co-lbl">CONCEPTO PRELIMINAR · ANÁLISIS AUTOMATIZADO</div>
      <div class="co-estado" style="color:${coPal.pal.c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${coIcon}</svg><span>${coPal.label}</span></div>
      <div class="co-sub">${coPal.sub}</div>
      ${co.condiciones?.length ? `<ol class="co-conds">${co.condiciones.map((c) => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}
    </div>` : '';

  /* ── Resumen multi-párrafo ── */
  const resumenHtml = (esc(e.resumen) || 'Resumen no disponible.')
    .split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, ' ')}</p>`).join('');

  /* ── Situación jurídica ── */
  const sj = e.situacionJuridica || null;
  const domBadge = !sj ? '' : sj.tipoDominio === 'pleno'
    ? '<span class="tag n">DOMINIO PLENO</span>'
    : sj.tipoDominio === 'falsa_tradicion'
      ? '<span class="tag v">FALSA TRADICIÓN</span>'
      : '<span class="tag">INDETERMINADO</span>';
  const situacionHtml = !sj ? '' : `
    ${sec('scale', 'Situación jurídica actual')}
    <table>
      <tr><td class="k">Tipo de dominio</td><td class="v">${domBadge}${sj.tipoDominio === 'falsa_tradicion' ? '<div class="mini muted">El titular no tiene propiedad plena: no puede hipotecar ni transferir dominio pleno. Se sanea mediante proceso de pertenencia.</div>' : ''}</td></tr>
      ${row('Copropiedad / cuotas', sj.cuotas)}
      ${sj.anioAdquisicionTitular ? `<tr><td class="k">Titular actual desde</td><td class="v">${esc(sj.anioAdquisicionTitular)}${sj.tiempoTitularAnios != null ? ` <span class="muted">(${esc(sj.tiempoTitularAnios)} año${sj.tiempoTitularAnios === 1 ? '' : 's'})</span>` : ''}${sj.riesgoLesionEnorme ? '<div class="mini warn">⚠ Compraventa hace menos de 4 años: verificar precio pagado vs. valor comercial — la acción de lesión enorme procede durante 4 años si se pagó menos de la mitad del valor real.</div>' : ''}</td></tr>` : ''}
      ${sj.tractoSucesivo && sj.tractoSucesivo !== 'indeterminado' ? `<tr><td class="k">Tracto sucesivo</td><td class="v">${sj.tractoSucesivo === 'continuo' ? '<span class="okc">✓ Ininterrumpido</span>' : `<span class="warnc">Con observaciones</span>${sj.tractoObservaciones ? `<div class="mini muted">${esc(sj.tractoObservaciones)}</div>` : ''}`}</td></tr>` : ''}
      ${sj.sucesionIliquida ? `<tr><td class="k">Sucesión</td><td class="v"><span class="warnc">Sucesión ilíquida detectada</span>${sj.sucesionDetalle ? `<div class="mini muted">${esc(sj.sucesionDetalle)}</div>` : ''}</td></tr>` : ''}
    </table>`;

  /* ── Propietarios ── */
  const props = (e.propietarios || []).map((p) => `<li><b>${esc(p.nombre)}</b>${p.identificacion ? ' · ' + esc(p.identificacion) : ''}${p.cuota ? ` <span class="tag">${esc(p.cuota)}</span>` : ''} <span class="muted">${esc(p.modo || '')}${p.anotacion ? ' (anot. ' + esc(p.anotacion) + ')' : ''}</span></li>`).join('') || '<li class="muted">No identificados en el texto.</li>';

  /* ── Estudio de la tradición (tabla que SÍ puede partirse entre páginas) ── */
  const cadena = e.cadenaTradicion || [];
  const cadenaHtml = !cadena.length ? '' : `
    ${sec('history', 'Estudio de la tradición')}
    <p class="mini muted" style="margin:0 0 6px">Cadena de actos inscritos en el folio, en orden cronológico. Las filas atenuadas fueron canceladas por una anotación posterior.</p>
    <table class="cadena">
      <thead><tr><th style="width:38px">Anot.</th><th style="width:70px">Fecha</th><th>Acto</th><th>De → A</th><th style="width:88px">Valor</th></tr></thead>
      <tbody>
      ${cadena.map((f) => {
        const cls = [f.esFalsaTradicion ? 'ft' : '', f.cancelada ? 'cancel' : ''].filter(Boolean).join(' ');
        const deA = f.de || f.a ? `${esc(f.de || '—')}${f.a ? ' → ' + esc(f.a) : ''}` : '<span class="muted">—</span>';
        return `<tr class="${cls}"><td><b>${esc(f.anotacion)}</b></td><td>${esc(f.fecha || '—')}</td><td>${esc(f.acto)}${f.codigo ? ` <span class="cod">${esc(f.codigo)}</span>` : ''}${f.esFalsaTradicion ? ' <span class="tag v">FALSA TRAD.</span>' : ''}${f.cancelada ? ` <span class="tag">cancelada por anot. ${esc(f.cancelada)}</span>` : ''}</td><td>${deA}</td><td>${esc(f.valor || '—')}</td></tr>`;
      }).join('')}
      </tbody>
    </table>`;

  /* ── Gravámenes (enriquecidos) ── */
  const gravTag = (g) => !g.vigente ? '<span class="tag">no vigente</span>'
    : g.naturaleza === 'normal' ? '<span class="tag n">normal (propiedad horizontal)</span>'
    : '<span class="tag v">VIGENTE</span>';
  const gravExtra = (g) => {
    const bits = [];
    if (g.cuantia) bits.push(`Cuantía: ${esc(g.cuantia)}`);
    if (g.acreedor) bits.push(`Acreedor/beneficiario: ${esc(g.acreedor)}`);
    if (g.fechaAnotacion) bits.push(esc(g.fechaAnotacion));
    if (!g.vigente && g.canceladoPor) bits.push(`cancelado por anot. ${esc(g.canceladoPor)}`);
    return bits.length ? `<br><span class="muted mini">${bits.join(' · ')}</span>` : '';
  };
  const grav = (e.gravamenes || []).map((g) => `<li><b>${esc(g.tipo)}</b> ${gravTag(g)}<br><span class="muted">${esc(g.descripcion)}${g.anotacion ? ' · anot. ' + esc(g.anotacion) : ''}</span>${gravExtra(g)}</li>`).join('')
    || '<li class="ok-li">✓ Sin gravámenes ni limitaciones vigentes encontrados.</li>';

  /* ── Medidas cautelares (sección propia) ── */
  const medidas = e.medidasCautelares || [];
  const medidasHtml = medidas.length
    ? medidas.map((m) => `<div class="flag ${m.vigente ? 'rojo' : ''}"><b>${esc(m.tipo)}${m.vigente ? ' · VIGENTE' : ' · levantada'}</b><span>${esc(m.descripcion)}${m.demandante ? ' · Demandante: ' + esc(m.demandante) : ''}${m.anotacion ? ' · anot. ' + esc(m.anotacion) : ''}${m.fechaAnotacion ? ' · ' + esc(m.fechaAnotacion) : ''}${!m.vigente && m.canceladoPor ? ' · cancelada por anot. ' + esc(m.canceladoPor) : ''}</span></div>`).join('')
    : '<div class="flag ok"><b>Sin medidas cautelares vigentes</b><span>El folio no registra embargos, demandas ni otras medidas cautelares vigentes.</span></div>';

  /* ── Banderas ── */
  const banderas = (e.banderas || []).map((x) => `<div class="flag ${nivelClass(x.nivel)}"><b>${esc(x.titulo)}</b><span>${esc(x.detalle)}</span></div>`).join('')
    || '<div class="flag ok"><b>Sin banderas de riesgo</b><span>No se detectaron alertas de riesgo en el documento.</span></div>';

  /* ── Alertas listas restrictivas ── */
  const A = e.alertas;
  const alertasHtml = !A || A.ok === false
    ? '<p class="muted">Tamizaje de listas restrictivas no disponible en esta emisión.</p>'
    : (A.coincidencias && A.coincidencias.length)
      ? A.coincidencias.map((c) => `<div class="flag rojo"><b>Posible coincidencia: ${esc(c.propietario)}</b><span>${esc(c.lista)} · ${esc(c.entrada)}${c.programa ? ' (' + esc(c.programa) + ')' : ''}. Coincidencia POSIBLE por nombre — requiere verificación manual, no es una determinación.</span></div>`).join('')
      : '<div class="flag ok"><b>Sin coincidencias en listas restrictivas</b><span>Los propietarios no aparecen en la Lista OFAC/SDN (Clinton) de lavado de activos.</span></div>';

  /* ── Verificación de antecedentes judiciales (solo plan Avanzado) ── */
  const ant = e.antecedentes;
  const antPersonas = !ant || !ant.ok ? '' : (ant.resultados || []).map((r) => {
    const rojo = r.tieneAntecedentes === true, limpio = r.tieneAntecedentes === false;
    const cls = r.error ? '' : rojo ? 'rojo' : limpio ? 'ok' : '';
    const label = r.error ? 'No se pudo verificar' : rojo ? 'TIENE asuntos pendientes con las autoridades judiciales' : limpio ? 'Sin asuntos pendientes con las autoridades judiciales' : 'Resultado no determinado';
    return `<div class="flag ${cls}"><b>${esc(r.nombre || 'Propietario')}${r.cedula ? ' · C.C. ' + esc(r.cedula) : ''}</b><span>${label}.${r.hora ? ' Consulta oficial: ' + esc(r.hora) + '.' : ''}${r.error ? ' (' + esc(r.error) + ')' : ''}</span></div>`;
  }).join('');
  // Personas jurídicas (empresas): no se consultan; los antecedentes judiciales son de personas naturales.
  const antJuridicas = ant && ant.omitidos && ant.omitidos.length
    ? `<div class="flag"><b>Persona(s) jurídica(s): ${ant.omitidos.map(esc).join(', ')}</b><span>No aplica verificación de antecedentes judiciales (corresponde a personas naturales). Para empresas, revise el Certificado de Existencia y Representación Legal (Cámara de Comercio / RUES).</span></div>`
    : '';
  const antecedentesHtml = !ant ? '' :
    ((ant.ok ? antPersonas : (ant.omitidos && ant.omitidos.length ? '' : `<p class="muted">${esc(ant.motivo || 'Verificación de antecedentes no disponible en esta emisión.')}</p>`))
      + antJuridicas
      + (ant.ok ? `<p class="mini muted" style="margin-top:6px">Fuente: ${esc(ant.fuente || 'Policía Nacional de Colombia')}. Consulta realizada en el marco de la debida diligencia de una compraventa y con la autorización declarada por el solicitante. Refleja el estado al momento de la consulta; cada persona puede descargar su certificado oficial en el portal de la Policía Nacional.</p>` : ''));

  /* ── Avalúo ── */
  const V = e.avaluo;
  const avaluoHtml = !V || !V.disponible
    ? '<p class="muted">Estimado no disponible: no se pudo determinar el área del inmueble en el CTL.</p>'
    : `<div class="avaluo">
        <div class="av-top">
          <div><div class="av-lbl">Valor comercial estimado</div><div class="est">${esc(V.estimado)}</div></div>
          ${V.confianza ? `<div class="av-conf conf-${esc(V.confianza)}">confianza ${esc(V.confianza)}</div>` : ''}
        </div>
        <div class="av-range"><span class="av-min">${esc(V.min)}</span><div class="av-bar"><span></span></div><span class="av-max">${esc(V.max)}</span></div>
        <div class="rango" style="margin-top:4px">Rango referencial de mercado</div>
        ${V.metodologia ? `<div class="av-meto">📐 ${esc(V.metodologia)}</div>` : ''}
        ${e.ultimaVenta && e.ultimaVenta.valor ? `<div class="av-meto">🧾 Última compraventa registrada en el folio: <b>${esc(e.ultimaVenta.valor)}</b>${e.ultimaVenta.anio ? ' (' + esc(e.ultimaVenta.anio) + ')' : ''}. <span style="color:#8593A3">Valor declarado en escritura (suele estar por debajo del precio real de mercado).</span></div>` : ''}
        <div class="muted" style="font-size:11px;margin-top:8px;line-height:1.5">${esc(V.nota)}</div>
      </div>`;

  /* ── Documentos a exigir ── */
  const docs = e.documentosExigir || [];
  const docsHtml = !docs.length ? '' : `
    ${sec('filelist', 'Documentos a exigir antes de firmar')}
    <ul class="docs">${docs.map((x) => `<li><span class="chk">☐</span> <b>${esc(x.doc)}</b><br><span class="muted mini">${esc(x.motivo)}</span></li>`).join('')}</ul>`;

  /* ── Recomendaciones ── */
  const recos = e.recomendaciones || [];
  const recosHtml = !recos.length ? '' : `
    ${sec('check', 'Recomendaciones')}
    <ol class="recos">${recos.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>`;

  /* ── Salvedades ── */
  const salv = e.salvedades || [];
  const salvHtml = !salv.length ? '' : `
    ${sec('info', 'Salvedades y alcance')}
    <ul class="salv">${salv.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif} body{margin:0;color:#0D1B2A;font-size:13px;line-height:1.5;background:#F1EEF5}
  /* Cada seccion en su propia tarjeta sobre el fondo suave → look "seccionado". */
  .block{background:#fff;border:1px solid #EAE4EE;border-radius:14px;padding:6px 20px 16px;margin:11px 0;box-shadow:0 1px 3px rgba(13,27,42,.05);break-inside:avoid;page-break-inside:avoid}
  .block>h2:first-child{margin-top:12px}
  .block-wide{break-inside:auto;page-break-inside:auto}
  /* Página 1 a sangre (header morado); siguientes con margen. Tarjetas no se parten — EXCEPTO la tabla
     de la cadena de tradición, que puede ocupar varias páginas (sus FILAS sí van completas). */
  @page{size:A4;margin:14mm 0} @page :first{margin:0}
  h2{break-after:avoid;page-break-after:avoid}
  .sema,.resumen,.avaluo,.flag,li,table:not(.cadena),.concepto{break-inside:avoid;page-break-inside:avoid}
  table.cadena{break-inside:auto;page-break-inside:auto} .cadena tr{break-inside:avoid;page-break-inside:avoid}
  .cadena thead{display:table-header-group}
  .header{display:flex;align-items:center;gap:14px;background:linear-gradient(100deg,#774B78,#5B2A78);color:#fff;padding:22px 44px;border-bottom:3px solid #84cc16}
  .header .brand{font-weight:800;font-size:21px;letter-spacing:-.2px} .header .sub{font-size:10px;letter-spacing:.22em;color:rgba(255,255,255,.72);margin-top:2px}
  .header .meta{margin-left:auto;text-align:right;font-size:11px;color:rgba(255,255,255,.85);line-height:1.6}
  .page{padding:30px 44px 40px}
  h1{font-size:23px;margin:4px 0 2px;letter-spacing:-.3px} .lead{color:#5B6B7E;font-size:12.5px;margin:0 0 4px} .muted{color:#5B6B7E}
  .alcance{font-size:11px;color:#774B78;font-weight:600;margin:0 0 4px;letter-spacing:.02em}
  .mini{font-size:11px;line-height:1.5} .warn{color:#B7791F;font-weight:600;margin-top:3px} .okc{color:#0F7A52;font-weight:700} .warnc{color:#B7791F;font-weight:700}
  .sema{display:flex;align-items:center;gap:14px;background:${s.bg};border:1px solid ${s.ring};border-radius:14px;padding:14px 20px;margin:16px 0 10px}
  .dot{width:30px;height:30px;border-radius:999px;background:${s.c};flex-shrink:0;box-shadow:0 0 0 5px ${s.bg},0 0 0 6px ${s.ring}} .sema b{color:${s.c};font-size:17px}
  .concepto{border:1.5px solid;border-left-width:6px;border-radius:14px;padding:16px 22px;margin:0 0 12px;box-shadow:0 1px 3px rgba(13,27,42,.05)}
  .co-lbl{font-size:9px;letter-spacing:.16em;font-weight:800;color:#8593A3}
  .co-estado{display:flex;align-items:center;gap:8px;font-size:21px;font-weight:800;letter-spacing:-.3px;margin-top:4px} .co-estado svg{width:22px;height:22px;flex-shrink:0}
  .co-sub{font-size:12px;color:#5B6B7E;margin-top:2px}
  .co-conds{margin:9px 0 0;padding-left:20px;font-size:12px;line-height:1.55} .co-conds li{margin:4px 0}
  .resumen{background:#F7F5F9;border-left:4px solid #774B78;border-radius:10px;padding:14px 18px;margin:12px 0;font-size:13.5px;line-height:1.6}
  .resumen p{margin:0 0 9px} .resumen p:last-child{margin-bottom:0}
  h2{display:flex;align-items:center;gap:7px;font-size:12px;color:#774B78;margin:22px 0 9px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;border-bottom:1px solid #ECE6EE;padding-bottom:6px}
  .h2ic{width:14px;height:14px;flex-shrink:0;color:#84cc16}
  table{width:100%;border-collapse:collapse;margin:2px 0} .k{color:#8593A3;width:170px;padding:6px 0;font-size:12px;vertical-align:top} .v{font-weight:600;padding:6px 0}
  .cadena{font-size:10.5px} .cadena th{text-align:left;color:#8593A3;font-size:9px;text-transform:uppercase;letter-spacing:.07em;padding:4px 6px;border-bottom:1.5px solid #ECE6EE}
  .cadena td{padding:5px 6px;border-bottom:1px solid #F1EDF3;vertical-align:top;font-weight:400}
  .cadena tr.ft td{background:#FDECEC} .cadena tr.cancel td{color:#9aa3ad}
  .cod{font-size:8.5px;color:#8593A3;background:#F3EFF5;border-radius:4px;padding:1px 4px;font-weight:700}
  ul{margin:6px 0;padding-left:18px;list-style:none} li{margin:8px 0;padding-left:2px} .ok-li{color:#0F7A52;font-weight:600;list-style:none;margin-left:-16px}
  .tag{font-size:9.5px;font-weight:700;background:#eef1f7;color:#5B6B7E;border-radius:5px;padding:2px 7px;vertical-align:middle} .tag.v{background:#FDECEC;color:#B42318} .tag.n{background:#E8F5EF;color:#0F7A52}
  .flag{display:flex;flex-direction:column;border-left:4px solid #999;background:#fafbfd;padding:10px 14px;margin:8px 0;border-radius:8px}
  .flag b{font-size:13px} .flag.rojo{border-color:#B42318;background:#FDECEC} .flag.amarillo{border-color:#B7791F;background:#FEF6E7} .flag.ok{border-color:#0F7A52;background:#E8F5EF} .flag.ok b{color:#0F7A52}
  .flag span{font-size:11.5px;color:#5B6B7E;margin-top:2px}
  .avaluo{background:#F7F5F9;border:1px solid #ECE6EE;border-radius:12px;padding:16px 18px;margin:8px 0}
  .avaluo .est{font-size:27px;font-weight:800;color:#1B2A3A;letter-spacing:-.5px;margin-top:2px} .avaluo .rango{color:#774B78;font-weight:600;font-size:12px}
  .av-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
  .av-lbl{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#8593A3;font-weight:700}
  .av-conf{font-size:9.5px;font-weight:700;border-radius:6px;padding:3px 9px;white-space:nowrap} .conf-media{background:#FEF6E7;color:#B7791F} .conf-baja{background:#FDECEC;color:#B42318} .conf-alta{background:#E8F5EF;color:#0F7A52}
  .av-range{display:flex;align-items:center;gap:8px;margin-top:10px} .av-range .av-min,.av-range .av-max{font-size:11.5px;color:#5B6B7E;font-weight:600;white-space:nowrap}
  .av-bar{flex:1;height:5px;border-radius:999px;background:linear-gradient(90deg,#B7E4CE,#774B78)}
  .av-meto{font-size:11px;color:#5B6B7E;margin-top:9px;background:#fff;border:1px solid #ECE6EE;border-radius:8px;padding:7px 10px}
  .docs li{margin:9px 0} .docs .chk{color:#774B78;font-weight:800;margin-right:2px}
  .recos{margin:6px 0;padding-left:20px} .recos li{margin:7px 0;font-size:12.5px;line-height:1.55}
  .salv{margin:6px 0;padding-left:18px;list-style:disc} .salv li{margin:5px 0;font-size:10.5px;color:#5B6B7E;line-height:1.5}
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
      ${alcanceHtml}
      <div class="sema"><div class="dot"></div><div><b>${s.t}</b><br><span class="muted">Semáforo de riesgo según las anotaciones vigentes del folio.</span></div></div>
      ${conceptoHtml}
      <div class="resumen">${resumenHtml}</div>
      ${block(`${sec('home', 'Identificación del inmueble')}<table>${row('Matrícula', e.inmueble?.matricula)}${row('Dirección', e.inmueble?.direccion)}${row('Círculo registral', e.inmueble?.circulo)}${row('Área', e.inmueble?.area)}${row('Ficha catastral', e.inmueble?.fichaCatastral)}${row('Tipo de predio', e.inmueble?.tipoPredio)}${row('Linderos (resumen)', e.inmueble?.linderosResumen)}</table>`)}
      ${block(situacionHtml)}
      ${block(`${sec('users', 'Propietarios actuales')}<ul>${props}</ul>`)}
      ${block(cadenaHtml, true)}
      ${block(`${sec('lock', 'Gravámenes y limitaciones')}<ul>${grav}</ul>`)}
      ${block(`${sec('gavel', 'Medidas cautelares')}${medidasHtml}`)}
      ${block(`${sec('flag', 'Banderas de riesgo')}${banderas}`)}
      ${block(`${sec('shield', 'Alertas · listas restrictivas (lavado de activos)')}${alertasHtml}`)}
      ${antecedentesHtml ? block(`${sec('usercheck', 'Verificación de antecedentes judiciales del propietario')}${antecedentesHtml}`) : ''}
      ${block(`${sec('money', 'Avalúo comercial · estimado digital')}${avaluoHtml}`)}
      ${block(docsHtml)}
      ${block(recosHtml)}
      ${block(salvHtml)}
      <p class="disc">Análisis informativo automatizado generado a partir del Certificado de Tradición y Libertad. El "concepto preliminar" es el resultado de reglas automáticas sobre las anotaciones del folio: no constituye dictamen jurídico de abogado titulado ni reemplaza el estudio de títulos de un profesional del derecho. El avalúo es un estimado referencial, no un avalúo formal de perito.</p>
      <div class="foot">${SELLO.replace('width="46" height="46"', 'width="16" height="16"').replace(/stroke="#fff"/g, 'stroke="#8593A3"').replace(/fill="#fff"/g, 'fill="#8593A3"')} Certitradición · certitradicion.com</div>
    </div>
  </body></html>`;
}
