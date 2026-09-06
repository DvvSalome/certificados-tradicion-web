// Clasificación de la consulta HTTP pública del SNR.
//   node robot-service/test-clasificacion-http.mjs
//
// Existe por la caída del 2026-09-06, que dejó el checkout sin vender media hora. Dos fallas
// distintas, las dos de LECTURA (el SNR estaba arriba y contestando en 0,5s):
//
//   1. Los regex de error se probaban contra el XML ENTERO. El AJAX del SNR reenvía varios
//      componentes y algunos traen plantillas ocultas con "Error de validación" y "no es posible
//      generar", así que TODA consulta buena se leía como portal caído → excepción → fallback al
//      navegador → cola compartida envenenada → 26s de cuelgue por visitante.
//   2. El SNR empezó a responder "la matrícula fue encontrada… puede generar el certificado" para
//      CUALQUIER matrícula, incluidas inventadas. Tomarlo por bueno = cobrar folios inexistentes.
import assert from 'node:assert';

// Frases reales capturadas del portal el 2026-09-06.
const MODAL_SIN_VALIDAR =
  'Informacion Matricula Seleccionada A continuacion se muestra la informacion encontrada para la ' +
  'matricula 19471 <span class="label"></span><span class="label"></span><span class="label">No Disponible</span> ' +
  'La matrícula fue encontrada, pero no registra dirección en la oficina de registro, puede generar ' +
  'el certificado sin esta información. Agregar al Carrito';

// Plantillas ocultas que viajan en el XML pero NO en el modal: no deben contar como error.
const XML_CON_PLANTILLAS_OCULTAS =
  '<update id="otroComponente"><![CDATA[ Error de validacion ... no es posible generar ]]></update>' +
  '<update id="modalMatriculaCarrito"><![CDATA[' + MODAL_SIN_VALIDAR + ']]></update>';

const clasificar = (xml) => {
  const mm = xml.match(/id="modalMatriculaCarrito"[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>/);
  const modal = mm ? mm[1] : '';
  const labels = [...modal.matchAll(/<span class="label">([^<]*)<\/span>/g)].map((m) => m[1].trim());
  const estado = labels[2] || null;
  const snrError = /Error de validaci[oó]n|no es posible generar|error interno/i.test(modal);
  const sinDireccion = !labels[0] && !labels[1];
  const portalSinValidar = sinDireccion
    && /matr[ií]cula fue encontrada|puede generar el certificado/i.test(modal)
    && (!estado || /no\s*disponible/i.test(estado));
  if (estado && /disponible/i.test(estado) && !/no\s*disponible/i.test(estado)) return 'disponible';
  if (portalSinValidar) return 'sin_validar';
  if (snrError) return 'error_portal';
  return 'otro';
};

// 1. El portal degradado se marca como NO CONCLUYENTE, nunca como venta ni como "no existe".
assert.equal(clasificar(XML_CON_PLANTILLAS_OCULTAS), 'sin_validar',
  'el modal "fue encontrada sin dirección" NO puede leerse como disponible ni como error');

// 2. Las plantillas ocultas del resto del XML no deben disparar el error del portal.
assert.notEqual(clasificar(XML_CON_PLANTILLAS_OCULTAS), 'error_portal',
  'los regex deben mirar SOLO el modal: si miran el XML entero, toda consulta buena es "error"');

// 3. Una matrícula con dirección real SÍ se vende (el camino bueno sigue intacto).
const MODAL_BUENO = '<update id="modalMatriculaCarrito"><![CDATA[' +
  '<span class="label">CALLE 1 # 2-3</span><span class="label">MARINILLA</span><span class="label">Disponible</span>' +
  ']]></update>';
assert.equal(clasificar(MODAL_BUENO), 'disponible');

// 4. Un error REAL dentro del modal sigue siendo error.
const MODAL_ERROR = '<update id="modalMatriculaCarrito"><![CDATA[ Error de validacion Matricula ]]></update>';
assert.equal(clasificar(MODAL_ERROR), 'error_portal');

console.log('✅ clasificación HTTP del SNR: los 4 casos pasan');
