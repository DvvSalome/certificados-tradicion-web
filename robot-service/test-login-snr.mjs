// Deteccion de "estamos dentro del SNR".
//   node robot-service/test-login-snr.mjs
//
// Existe por la caida del 2026-09-09: un cliente pago $38.900 y no recibio nada. El login
// ENTRABA bien, pero comprobabamos con el literal 'Certificado Tradicion' y el portal escribe
// "Certificado de Tradicion" (con "de" y con tilde). La comparacion fallaba siempre.
//
// Ojo con el arreglo ingenuo: el nombre del producto tambien esta en la pagina PUBLICA, asi que
// buscarlo daria por bueno un login FALLIDO, que es peor (seguiriamos y romperiamos mas adelante).
// Por eso se usan marcas que solo existen ya autenticado.
import assert from 'node:assert';

const dentro = (txt) => /cerrar sesion|mis certificados|mi cuenta|saldo/.test(
  txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());

// Texto REAL de la pagina publica del SNR, 2026-09-09 (sin login).
const PUBLICA = 'Certificado de Tradición y Libertad de forma segura. Iniciar sesión Carrito ' +
                'Certificados Descargue CTL Pagado Validar Consulta Bienvenido Salir';
assert.equal(dentro(PUBLICA), false,
  'la pagina PUBLICA no puede leerse como sesion iniciada: daria por bueno un login fallido');

// Ya autenticado: aparecen las marcas privadas.
assert.equal(dentro('Mi cuenta Saldo disponible $722.000 Cerrar sesión'), true);
assert.equal(dentro('MIS CERTIFICADOS'), true, 'debe ser insensible a mayusculas');
assert.equal(dentro('Cerrar sesion'), true, 'debe funcionar SIN tildes tambien');

// El texto viejo, por si solo, ya no alcanza (asi se cayo).
assert.equal(dentro('Certificado de Tradición y Libertad'), false,
  'el nombre del producto NO prueba que estemos dentro');

console.log('✅ deteccion de login del SNR: los 5 casos pasan');
