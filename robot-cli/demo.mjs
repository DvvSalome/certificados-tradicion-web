// Demo VISIBLE del robot SNR (headful + cámara lenta). DRY-RUN: llega al carrito y para ANTES de pagar.
// Uso: node --env-file=.env.local robot/demo.mjs [--oficina BARRANQUILLA] [--matricula 168410]
import { SnrRobot } from '../robot-service/snr-robot.mjs';

const arg = (f, d) => (process.argv.includes(f) ? process.argv[process.argv.indexOf(f) + 1] : d);
const OFICINA = arg('--oficina', 'BARRANQUILLA');
const MATRICULA = arg('--matricula', '168410');

const step = (n, m) => console.log(`\n  ┌─ PASO ${n} ──────────────────────────\n  │ ${m}\n  └──────────────────────────────────────`);

const robot = new SnrRobot({
  user: process.env.SNR_USER,
  pass: process.env.SNR_PASS,
  headless: false, // ventana VISIBLE
  slowMo: 650, // cámara lenta para seguir cada acción
  stateFile: null, // login fresco, para ver el paso de inicio de sesión
  log: (m) => console.log('     · ' + m),
});

await robot.start();
try {
  step(1, 'Abrir el portal de la SNR e INICIAR SESIÓN');
  await robot.login();

  step(2, `Ir a generación y CONSULTAR matrícula ${MATRICULA} en ${OFICINA}`);
  const info = await robot.consultar(OFICINA, MATRICULA);
  console.log('     → Inmueble:', JSON.stringify(info));
  await robot.page.waitForTimeout(3500); // ver el modal con la info del predio

  step(3, 'AGREGAR AL CARRITO (gratis — NO se paga ni se genera)');
  await robot.agregarAlCarrito();
  await robot.page.waitForTimeout(4500); // ver el carrito

  step(4, 'FIN del demo (dry-run). Aquí iría: Pagar → generar → descargar el PDF.');
  console.log('     ⚠ No se gastó saldo. La ventana se cierra en 6s…');
  await robot.page.waitForTimeout(6000);
} catch (e) {
  console.log('     ✗ ERROR:', e.message);
  await robot.page?.waitForTimeout(4000);
} finally {
  await robot.stop();
}
console.log('\n  Demo terminado.');
