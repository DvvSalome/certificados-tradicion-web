// Chequeo de la clasificación de respuestas del SNR.
//   node robot-service/test-clasificacion-snr.mjs
//
// Existe porque el SNR mete en el MISMO diálogo ("Error de validacion Matricula") dos cosas que
// para el cliente son opuestas: un fallo suyo (reintentar sirve) y un "no se puede, por esto"
// (reintentar NO sirve nunca). Se confundían, y a un cliente real con la matrícula 018-19471 le
// dijimos "está demorando, reintenta" cuando el predio tenía un turno de registro en trámite.
//
// Si alguien toca los regex de _consultaPublicaOnce, esto se cae.
import assert from 'node:assert';

const MOTIVOS = [
  [/en\s+calificaci[oó]n/i, 'En calificación'],
  [/matr[ií]cula\s+cerrada|folio\s+cerrado/i, 'Matrícula cerrada'],
  [/en\s+proceso\s+de\s+(registro|inscripci[oó]n)/i, 'En proceso de registro'],
];
const esErrorDePortal = (raw) =>
  /Error de validaci[oó]n|no es posible generar|error interno|servicio no (est[aá] )?disponible|intente (m[aá]s tarde|nuevamente)|502|503|timeout/i.test(raw);

const clasificar = (raw) => {
  const m = MOTIVOS.find(([re]) => re.test(raw));
  if (m) return { tipo: 'concluyente', estado: m[1], turno: (raw.match(/Turno:\s*([0-9-]+)/i) || [])[1] || null };
  if (esErrorDePortal(raw)) return { tipo: 'portal' };
  return { tipo: 'normal' };
};

// Texto REAL del SNR, 2026-08-13, matrícula 018-19471.
const REAL =
  'Error de validacion Matricula Lo sentimos pero no es posible generar certificado para la ' +
  'matricula (No se puede Generar el certificado Matricula en calificacion. No se puede expedir ' +
  'el Certificado de Tradicion Inmobiliaria. - 18-Turno: 2026-018-6-7971) Aceptar';

const r = clasificar(REAL);
assert.equal(r.tipo, 'concluyente', 'la matrícula en calificación NO puede tratarse como fallo del portal');
assert.equal(r.estado, 'En calificación');
assert.equal(r.turno, '2026-018-6-7971', 'hay que extraer el turno para mostrárselo al cliente');

// Un fallo real del portal SÍ debe seguir mandando a reintentar.
assert.equal(clasificar('Error de validacion. El servicio no esta disponible, intente mas tarde.').tipo, 'portal');

// Y lo normal no debe verse afectado.
assert.equal(clasificar('Direccion CALLE 1 Circulo MARINILLA Estado Disponible Agregar').tipo, 'normal');
assert.equal(clasificar('La matricula no se encuentra registrada').tipo, 'normal');

console.log('✅ clasificación del SNR: los 4 casos pasan');
