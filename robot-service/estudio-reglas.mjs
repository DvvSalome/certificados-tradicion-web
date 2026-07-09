// Reglas DETERMINISTAS del Estudio de Títulos v2. El LLM solo EXTRAE hechos del CTL;
// este módulo emite el veredicto: concepto (favorable/condicionado/desfavorable), semáforo,
// checklist de documentos y salvedades. Funciones puras sin I/O → testeables sin LLM ni SNR.

const cap = (arr, n) => (Array.isArray(arr) ? arr.filter((x) => x && typeof x === 'object').slice(0, n) : []);
const s = (v, max = 500) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const b = (v) => v === true;

/* ── Saneo (extiende el saneo v1 de estudio.mjs) ─────────────────────────── */
export function sanearEstudio(data, { matricula, oficina }) {
  const d = data && typeof data === 'object' ? data : {};
  const im = d.inmueble || {};
  d.inmueble = {
    matricula: String(matricula), // autoritativa del caller: es un documento legal
    direccion: s(im.direccion), circulo: s(im.circulo) ?? (oficina || null), area: s(im.area, 120),
    fichaCatastral: s(im.fichaCatastral, 120), tipoPredio: s(im.tipoPredio, 60),
    estadoFolio: im.estadoFolio === 'cerrado' ? 'cerrado' : im.estadoFolio === 'activo' ? 'activo' : null,
    linderosResumen: s(im.linderosResumen, 300),
  };
  const al = d.alcance || {};
  d.alcance = {
    fechaExpedicionCTL: s(al.fechaExpedicionCTL, 40), fechaApertura: s(al.fechaApertura, 40),
    fechaUltimaAnotacion: s(al.fechaUltimaAnotacion, 40),
    totalAnotaciones: Number.isFinite(Number(al.totalAnotaciones)) ? Number(al.totalAnotaciones) : null,
  };
  d.propietarios = cap(d.propietarios, 20).map((p) => ({
    nombre: s(p.nombre, 140) || '—', identificacion: s(p.identificacion, 60),
    modo: s(p.modo, 200) || '', anotacion: s(p.anotacion, 20), cuota: s(p.cuota, 40),
  }));
  d.cadenaTradicion = cap(d.cadenaTradicion, 80).map((f) => ({
    anotacion: s(f.anotacion, 20) || '—', fecha: s(f.fecha, 40), acto: s(f.acto, 160) || '—',
    codigo: s(f.codigo, 12), de: s(f.de, 120), a: s(f.a, 120),
    deCedula: s(f.deCedula, 20), aCedula: s(f.aCedula, 20), valor: s(f.valor, 40),
    esTransferenciaDominio: b(f.esTransferenciaDominio), esFalsaTradicion: b(f.esFalsaTradicion),
    cancelada: s(f.cancelada, 20),
  }));
  const sj = d.situacionJuridica || {};
  d.situacionJuridica = {
    tipoDominio: ['pleno', 'falsa_tradicion'].includes(sj.tipoDominio) ? sj.tipoDominio : 'indeterminado',
    cuotas: s(sj.cuotas, 200),
    anioAdquisicionTitular: s(sj.anioAdquisicionTitular, 12),
    adquisicionFueCompraventa: b(sj.adquisicionFueCompraventa),
    tractoSucesivo: ['continuo', 'con_observaciones'].includes(sj.tractoSucesivo) ? sj.tractoSucesivo : 'indeterminado',
    tractoObservaciones: s(sj.tractoObservaciones, 400),
    sucesionIliquida: b(sj.sucesionIliquida), sucesionDetalle: s(sj.sucesionDetalle, 300),
  };
  d.gravamenes = cap(d.gravamenes, 40).map((g) => ({
    tipo: s(g.tipo, 120) || '—', descripcion: s(g.descripcion, 400) || '', vigente: b(g.vigente),
    naturaleza: g.naturaleza === 'normal' ? 'normal' : 'riesgo', anotacion: s(g.anotacion, 20),
    cuantia: s(g.cuantia, 60), acreedor: s(g.acreedor, 140), fechaAnotacion: s(g.fechaAnotacion, 40),
    canceladoPor: s(g.canceladoPor, 20),
  }));
  d.medidasCautelares = cap(d.medidasCautelares, 20).map((m) => ({
    tipo: s(m.tipo, 120) || '—', descripcion: s(m.descripcion, 400) || '', vigente: b(m.vigente),
    anotacion: s(m.anotacion, 20), demandante: s(m.demandante, 140), fechaAnotacion: s(m.fechaAnotacion, 40),
    canceladoPor: s(m.canceladoPor, 20),
  }));
  d.banderas = cap(d.banderas, 15).map((x) => ({
    nivel: x.nivel === 'rojo' ? 'rojo' : 'amarillo', titulo: s(x.titulo, 160) || '—', detalle: s(x.detalle, 500) || '',
  }));
  d.ultimaVenta = d.ultimaVenta && typeof d.ultimaVenta === 'object'
    ? { valor: s(d.ultimaVenta.valor, 40), anio: s(d.ultimaVenta.anio, 12) } : { valor: null, anio: null };
  d.recomendaciones = (Array.isArray(d.recomendaciones) ? d.recomendaciones : [])
    .filter((r) => typeof r === 'string' && r.trim()).slice(0, 8).map((r) => r.trim().slice(0, 400));
  d.resumen = typeof d.resumen === 'string' ? d.resumen : '';
  return d;
}

/* ── Falsa tradición: doble check determinista (la tabla de códigos SNR varía → el texto también manda) ── */
export function esFalsaTradicion(fila) {
  if (!fila) return false;
  return fila.esFalsaTradicion === true
    || /^06/.test(fila.codigo || '')
    || /FALSA\s+TRADICI|VENTA\s+DE\s+COSA\s+AJENA|DERECHOS\s+Y\s+ACCIONES/i.test(fila.acto || '');
}

export function aplicarFalsaTradicion(d) {
  const cadena = d.cadenaTradicion || [];
  const transferencias = cadena.filter((f) => f.esTransferenciaDominio && !f.cancelada);
  const ultima = transferencias[transferencias.length - 1] || null;
  if (ultima && esFalsaTradicion(ultima)) {
    // La ÚLTIMA transferencia no cancelada es falsa tradición → el dominio actual NO es pleno,
    // diga lo que diga el modelo.
    d.situacionJuridica.tipoDominio = 'falsa_tradicion';
    if (!d.banderas.some((x) => /falsa tradici/i.test(x.titulo))) {
      d.banderas.push({
        nivel: 'rojo', titulo: 'Falsa tradición en el título vigente',
        detalle: `La adquisición del titular actual (anot. ${ultima.anotacion}) es de falsa tradición (${ultima.acto}). El vendedor no tiene dominio pleno: no puede hipotecar ni transferir propiedad plena. Se sanea con proceso de pertenencia.`,
      });
    }
  } else if (transferencias.some(esFalsaTradicion) && d.situacionJuridica.tipoDominio === 'pleno') {
    // Antecedente 06xx en la cadena pero el título vigente no lo es → solo alerta de revisión.
    if (!d.banderas.some((x) => /falsa tradici/i.test(x.titulo))) {
      d.banderas.push({
        nivel: 'amarillo', titulo: 'Antecedente de falsa tradición en la cadena',
        detalle: 'Una anotación anterior registra falsa tradición. Verificar con abogado que la cadena posterior la haya saneado correctamente.',
      });
    }
  }
  return d;
}

/* ── Lesión enorme: compraventa hace <4 años → acción rescisoria posible (nota, no bandera roja) ── */
export function derivarLesionEnorme(d, anioActual) {
  const sj = d.situacionJuridica;
  const anio = parseInt(sj.anioAdquisicionTitular, 10);
  sj.tiempoTitularAnios = Number.isFinite(anio) && anio > 1900 ? Math.max(0, anioActual - anio) : null;
  sj.riesgoLesionEnorme = sj.adquisicionFueCompraventa && sj.tiempoTitularAnios !== null && sj.tiempoTitularAnios < 4;
  return d;
}

/* ── Concepto: NUNCA lo decide el modelo ─────────────────────────────────── */
export function derivarConcepto(d) {
  const sj = d.situacionJuridica;
  const condiciones = [];
  const bloqueos = [];

  for (const m of d.medidasCautelares.filter((m) => m.vigente)) {
    bloqueos.push(`Levantamiento de la medida cautelar "${m.tipo}" (anot. ${m.anotacion ?? '—'}) registrado en el folio.`);
  }
  if (sj.tipoDominio === 'falsa_tradicion') {
    bloqueos.push('Saneamiento del dominio: el título vigente es de falsa tradición; requiere proceso de pertenencia (prescripción adquisitiva) y concepto de abogado.');
  }
  for (const g of d.gravamenes.filter((g) => g.vigente && g.naturaleza === 'riesgo')) {
    if (/EXTINCI[OÓ]N\s+DE\s+DOMINIO/i.test(g.tipo + ' ' + g.descripcion)) {
      bloqueos.push(`Proceso de extinción de dominio (anot. ${g.anotacion ?? '—'}): abstenerse de negociar hasta resolución definitiva.`);
    } else if (/HIPOTECA/i.test(g.tipo)) {
      condiciones.push(`Cancelación de la hipoteca de la anot. ${g.anotacion ?? '—'}${g.acreedor ? ` a favor de ${g.acreedor}` : ''}${g.cuantia ? ` (${g.cuantia})` : ''}, o subrogación pactada en la escritura.`);
    } else if (/AFECTACI[OÓ]N\s+A?\s*VIVIENDA\s+FAMILIAR/i.test(g.tipo + ' ' + g.descripcion)) {
      condiciones.push(`Comparecencia y firma de ambos cónyuges en la escritura, o levantamiento previo de la afectación a vivienda familiar (anot. ${g.anotacion ?? '—'}).`);
    } else if (/PATRIMONIO\s+DE\s+FAMILIA/i.test(g.tipo + ' ' + g.descripcion)) {
      condiciones.push(`Levantamiento del patrimonio de familia (anot. ${g.anotacion ?? '—'}) mediante escritura registrada, antes de la venta.`);
    } else if (/USUFRUCTO/i.test(g.tipo)) {
      condiciones.push(`Renuncia o cancelación registrada del usufructo (anot. ${g.anotacion ?? '—'}); de lo contrario solo se adquiere la nuda propiedad.`);
    } else {
      condiciones.push(`Aclaración o cancelación de "${g.tipo}" (anot. ${g.anotacion ?? '—'}) antes de firmar.`);
    }
  }
  if (sj.sucesionIliquida) {
    condiciones.push('Adjudicación de la sucesión registrada en el folio (escritura o sentencia) antes de escriturar: hoy se estarían negociando derechos herenciales, no propiedad plena.');
  }
  if (sj.tractoSucesivo === 'con_observaciones') {
    condiciones.push(`Aclaración del tracto sucesivo: ${sj.tractoObservaciones || 'se detectaron inconsistencias en la cadena de transferencias.'}`);
  }
  if (sj.riesgoLesionEnorme) {
    condiciones.push(`Verificación del precio de la compraventa reciente (${sj.anioAdquisicionTitular}) frente al valor comercial: durante 4 años procede la acción de lesión enorme si se pagó menos de la mitad del valor real.`);
  }
  // Banderas que no quedaron cubiertas por una condición ya generada.
  const texto = (bloqueos.join(' ') + ' ' + condiciones.join(' ')).toLowerCase();
  for (const bd of d.banderas) {
    const key = (bd.titulo || '').toLowerCase().slice(0, 25);
    if (key && !texto.includes(key.slice(0, 15))) {
      (bd.nivel === 'rojo' ? bloqueos : condiciones).push(`${bd.titulo}: ${bd.detalle}`.slice(0, 300));
    }
  }

  const hayRojo = d.banderas.some((x) => x.nivel === 'rojo') || bloqueos.length > 0;
  const estado = hayRojo ? 'desfavorable' : condiciones.length ? 'favorable_condicionado' : 'favorable';
  return { estado, condiciones: (estado === 'desfavorable' ? [...bloqueos, ...condiciones] : condiciones).slice(0, 10) };
}

export function derivarSemaforo(d, concepto) {
  if (d.banderas.some((x) => x.nivel === 'rojo') || concepto.estado === 'desfavorable') return 'rojo';
  if (d.banderas.length || concepto.estado === 'favorable_condicionado') return 'amarillo';
  return 'verde';
}

/* ── Documentos a exigir antes de firmar (checklist base + condicionales) ── */
export function derivarDocumentosExigir(d) {
  const docs = [
    { doc: 'Copia de la escritura pública del título de adquisición vigente', motivo: 'Verificar linderos, precio y condiciones del acto por el que adquirió el propietario actual.' },
    { doc: 'Paz y salvo de impuesto predial', motivo: 'El predial pendiente persigue al inmueble, no al dueño anterior.' },
    { doc: 'Paz y salvo de contribución por valorización', motivo: 'Las valorizaciones pendientes también gravan el predio.' },
    { doc: 'CTL actualizado (máximo 30 días) al momento de firmar', motivo: 'El folio es cambiante: pueden inscribirse nuevas anotaciones en cualquier momento.' },
    { doc: 'Certificado o ficha catastral', motivo: 'Cotejar área, dirección y avalúo catastral contra el folio.' },
  ];
  const gv = d.gravamenes.filter((g) => g.vigente);
  if (gv.some((g) => g.naturaleza === 'normal' && /PROPIEDAD\s+HORIZONTAL|COPROPIEDAD/i.test(g.tipo + ' ' + g.descripcion))) {
    docs.push({ doc: 'Paz y salvo de administración de la copropiedad', motivo: 'Las cuotas de administración pendientes se transmiten con el inmueble (Ley 675 de 2001).' });
    docs.push({ doc: 'Reglamento de propiedad horizontal', motivo: 'Conocer coeficiente, usos permitidos y restricciones del conjunto.' });
  }
  for (const g of gv.filter((g) => /HIPOTECA/i.test(g.tipo))) {
    docs.push({ doc: `Carta de saldo y minuta de cancelación de la hipoteca (anot. ${g.anotacion ?? '—'})${g.acreedor ? ' — ' + g.acreedor : ''}`, motivo: 'Coordinar la cancelación o subrogación en la misma escritura de venta.' });
  }
  if (gv.some((g) => /AFECTACI[OÓ]N\s+A?\s*VIVIENDA/i.test(g.tipo + ' ' + g.descripcion))) {
    docs.push({ doc: 'Registro civil de matrimonio / declaración de unión marital del vendedor', motivo: 'La afectación a vivienda familiar exige la firma de ambos cónyuges o su levantamiento.' });
  }
  if (d.situacionJuridica.sucesionIliquida) {
    docs.push({ doc: 'Escritura o sentencia de adjudicación de la sucesión, registrada', motivo: 'Sin la adjudicación registrada solo se negocian derechos herenciales.' });
  }
  for (const m of d.medidasCautelares.filter((m) => m.vigente)) {
    docs.push({ doc: `Oficio de levantamiento de "${m.tipo}" (anot. ${m.anotacion ?? '—'}) registrado`, motivo: 'Una medida cautelar vigente impide o vicia la transferencia.' });
  }
  if (d.situacionJuridica.tipoDominio === 'falsa_tradicion') {
    docs.push({ doc: 'Concepto de abogado especialista + estudio del proceso de pertenencia', motivo: 'La falsa tradición solo se sanea judicialmente (prescripción adquisitiva).' });
  }
  return docs.slice(0, 12);
}

export function salvedades(fechaCTL) {
  return [
    `Este estudio se basa exclusivamente en el texto del Certificado de Tradición y Libertad${fechaCTL ? ` expedido el ${fechaCTL}` : ''}. No se tuvieron a la vista escrituras públicas, paz y salvos, documentos de identidad ni información catastral.`,
    'El folio de matrícula es cambiante: pueden inscribirse nuevas anotaciones en cualquier momento. Verifique con un CTL fresco (máximo 30 días) inmediatamente antes de firmar promesa o escritura.',
    'Concepto preliminar generado por un sistema automatizado. No constituye dictamen jurídico de abogado titulado ni sustituye la asesoría legal profesional.',
    'El tamizaje de listas restrictivas es una verificación por nombre contra la lista OFAC/SDN; no constituye una certificación SARLAFT ni una determinación.',
  ];
}

/* ── Orquestador: saneo + derivaciones en orden ──────────────────────────── */
export function aplicarReglas(data, { matricula, oficina, anioActual }) {
  const d = sanearEstudio(data, { matricula, oficina });
  aplicarFalsaTradicion(d);
  derivarLesionEnorme(d, anioActual);
  d.concepto = derivarConcepto(d);
  d.semaforo = derivarSemaforo(d, d.concepto);
  d.documentosExigir = derivarDocumentosExigir(d);
  d.salvedades = salvedades(d.alcance.fechaExpedicionCTL);
  return d;
}
