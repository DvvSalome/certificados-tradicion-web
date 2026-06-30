import { execSync } from 'child_process';
import fs from 'fs';

const rawEnv = fs.readFileSync('.env.local', 'utf-8');
const lines = rawEnv.split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('APP_BASE_URL') || trimmed.startsWith('DATABASE_URL')) {
    continue;
  }
  
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  
  const k = trimmed.slice(0, eqIdx).trim();
  const v = trimmed.slice(eqIdx + 1).trim();
  
  if (k && v) {
    console.log(`\n=== Procesando ${k} ===`);
    try {
      console.log(`Removiendo ${k}...`);
      execSync(`npx vercel env rm ${k} production -y`, { stdio: 'pipe' });
    } catch (e) {
      console.log(`(No existía o no se pudo remover)`);
    }
    
    try {
      console.log(`Añadiendo ${k}...`);
      execSync(`npx vercel env add ${k} production --value "${v}" --yes`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`Error añadiendo ${k}`, e.message);
    }
  }
}

console.log("\n=== VARIABLES ACTUALIZADAS. INICIANDO DEPLOY A PRODUCCIÓN ===");
try {
  execSync(`npx vercel deploy --prod --yes`, { stdio: 'inherit' });
} catch (e) {
  console.error("Error durante el deploy:", e.message);
}
