// Lee el contenido de un CTL (Buffer PDF). Texto directo si el PDF tiene texto; si es escaneado
// (~0 texto) → render a PNG (pdf-to-png-converter) → visión NIM (port del OCR de _leo-pr/_audit-main).
import { nimChat } from './nim-client.mjs';

const OCR_PROMPT =
  'Eres un OCR de documentos legales colombianos (español). Transcribe TODO el texto visible en esta ' +
  'página VERBATIM, conservando saltos de línea, nombres, cédulas, números de anotación, fechas, montos y ' +
  'tildes exactamente como aparecen. No resumas, no traduzcas, no expliques, no omitas. Devuelve solo el texto.';

async function ocrPaginaPng(pngBuffer) {
  const b64 = pngBuffer.toString('base64');
  return nimChat([{ role: 'user', content: [
    { type: 'text', text: OCR_PROMPT },
    { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
  ] }], { model: process.env.OCR_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct', maxTokens: 4096 });
}

export async function extraerTextoCTL(pdfBuffer) {
  // 1) intentar texto directo
  let texto = '';
  try {
    // OJO: importar el submódulo interno, NO 'pdf-parse' (su index.js tiene un "debug mode" que al
    // cargarse intenta leer ./test/data/05-versions-space.pdf → ENOENT → rompía la extracción de texto
    // y forzaba OCR de visión para TODO CTL). El lib interno es el parser puro.
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const r = await pdfParse(pdfBuffer);
    texto = (r.text || '').trim();
  } catch (e) { console.error('[estudio] pdf-parse falló:', e.message); }
  if (texto.replace(/\s/g, '').length >= 400) return texto; // suficiente texto → es PDF con texto

  // 2) escaneado → render + visión NIM
  console.error('[estudio] CTL sin texto suficiente → OCR visión NIM');
  const { pdfToPng } = await import('pdf-to-png-converter');
  const pages = await pdfToPng(pdfBuffer, { viewportScale: 2 });
  const partes = [];
  for (const p of pages.slice(0, 6)) { // CTLs suelen ser 1-4 págs; tope de seguridad
    try { partes.push(await ocrPaginaPng(p.content)); } catch (e) { console.error('[estudio] OCR pág falló:', e.message); }
  }
  const ocr = partes.join('\n\n').trim();
  if (!ocr) throw new Error('no se pudo leer el CTL (ni texto ni OCR)');
  return ocr;
}
