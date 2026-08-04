import fs from 'fs';
import { entregarCorreo } from '../web/robot-service/deliver.mjs';
const pdf = fs.readFileSync('recon/artifacts/CTL-95200.pdf');
for (const email of ['certificados@certitradicion.com', 'four4gsolutions@gmail.com']) {
  const r = await entregarCorreo({ pdf, matricula: '95200', oficina: 'BARRANQUILLA', email, reference: 'CTL-DEMO95200' });
  console.log(email, '->', JSON.stringify(r));
}
