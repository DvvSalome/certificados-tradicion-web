import fs from 'fs';
const out = 'C:/Users/jhanf/AppData/Local/Temp/claude/D--TRABAJOS-PROPIOS-projects-ALEXIS-TRADICION-CERTIFICADO/7129954f-c3cb-42ab-848d-7c609483de4a/tasks/wucov8qtp.output';
const j = JSON.parse(fs.readFileSync(out, 'utf8'));
fs.writeFileSync('GEO-ESTRATEGIA-vs-legalcheck.md', j.result.report);
console.log('reporte escrito:', j.result.report.length, 'chars -> GEO-ESTRATEGIA-vs-legalcheck.md');
