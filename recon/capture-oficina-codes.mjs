// Captura el código (índice) de cada oficina seleccionándola y leyendo indiceMatricula.
// Una sola corrida → mapa estático {OFICINA: "040"} para el selector. Gratis (no genera nada).
import { SnrRobot } from '../web/robot-service/snr-robot.mjs';
import fs from 'fs';

const log = (m) => console.log('· ' + m);
const robot = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, headless: true, stateFile: null, log });

await robot.start();
const p = robot.page;
try {
  await robot.login();
  await p.goto('https://certificados.supernotariado.gov.co/certificado/portal/business/generate.snr', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(1500);

  const opts = await p.evaluate(() => {
    const sel = document.getElementById('formGeneracionCertificados:listaOficinas_input');
    return Array.prototype.slice.call(sel.options).map((o) => ({ value: o.value, text: o.textContent.trim() }));
  });
  log('oficinas a capturar: ' + opts.length);

  const map = {};
  for (let i = 0; i < opts.length; i++) {
    const { value, text } = opts[i];
    await p.evaluate((v) => {
      const sel = document.getElementById('formGeneracionCertificados:listaOficinas_input');
      sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
    // esperar a que el índice se actualice (cambie respecto al previo)
    let indice = null;
    for (let t = 0; t < 12; t++) {
      await p.waitForTimeout(250);
      indice = await p.evaluate(() => { const e = document.getElementById('formGeneracionCertificados:indiceMatricula'); return e ? e.value : null; });
      if (indice && map[text] !== indice && (i === 0 || indice !== map[opts[i - 1].text])) break;
    }
    map[text] = indice;
    if (i % 20 === 0 || i === opts.length - 1) log(`${i + 1}/${opts.length}  ${text}=${indice}`);
  }
  fs.writeFileSync('recon/artifacts/oficina-codes.json', JSON.stringify(map, null, 2));
  log('✅ guardado recon/artifacts/oficina-codes.json (' + Object.keys(map).length + ' oficinas)');
  log('muestra: BARRANQUILLA=' + map['BARRANQUILLA'] + ' BOGOTA ZONA CENTRO=' + map['BOGOTA ZONA CENTRO'] + ' MEDELLIN NORTE=' + map['MEDELLIN NORTE']);
} catch (e) {
  log('ERROR: ' + e.message);
} finally {
  await robot.stop();
}
