# Plan de Implementación — Plan Express con Estudio de Títulos (Fase A)

> **Para workers agénticos:** SUB-SKILL REQUERIDA: usa `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para implementar tarea por tarea. Los pasos usan checkbox (`- [ ]`).

**Goal:** Agregar un tier de pago **Express ($44.900)** que entrega el CTL + un **Estudio de Títulos** (PDF) generado por IA (NVIDIA NIM, gratis) a partir del propio CTL.

**Architecture:** El checkout ofrece dos planes (Básico/Express). En Express, después de que el robot genera y descarga el CTL, lo lee (texto o visión NIM), lo analiza con NIM (modelo de texto) en JSON estructurado, lo renderiza a un PDF branded vía browserless, y lo entrega junto al CTL. El Estudio es best-effort: si falla, el CTL igual se entrega.

**Tech Stack:** Next.js 16 (web), Node ESM `.mjs` (robot-service), Postgres, Playwright+Browserless, NVIDIA NIM (OpenAI-compatible), nodemailer, pdf-to-png-converter, pdf-parse.

## Global Constraints

- **robot-service es ESM `.mjs` puro, sin TypeScript ni build** — arranca con `node server.mjs`. No introducir TS ahí. No hay framework de tests: la verificación es un script `node` que corre y asierta (patrón del repo).
- **Web es Next.js 16.2.9** — seguir patrones existentes; no introducir APIs nuevas de Next sin necesidad.
- **Precios (centavos):** Básico `3980000` ($39.800) · Express `4490000` ($44.900). Configurables por env `PRICE_BASICO_COP` / `PRICE_EXPRESS_COP`.
- **NIM:** key en `process.env.NVIDIA_API_KEY` (servicio robot, EasyPanel). **Nunca loguear la key.** Base `https://integrate.api.nvidia.com/v1`. Texto: `meta/llama-3.3-70b-instruct`. Visión: `meta/llama-3.2-90b-vision-instruct`.
- **Estudio best-effort:** el CTL SIEMPRE se entrega aunque el Estudio falle.
- **Disclaimer (verbatim) en el PDF del Estudio:** "Análisis informativo automatizado generado a partir del Certificado de Tradición y Libertad. No constituye asesoría jurídica profesional ni reemplaza el estudio de un abogado."
- **Generación sigue serializada** sobre el `genRobot` persistente (no cambiar el modelo de sesión SNR).
- **Despliegue:** robot y web a EasyPanel vía túnel SSH + tRPC `deployService` (proyecto `certificados`). Migración DB vía `psql` en el contenedor `certificados_db`.

---

### Task 1: Planes, modelo de orden y migración DB

**Files:**
- Modify: `web/lib/config.ts`
- Modify: `web/lib/orders.ts`
- Modify: `web/db/schema.sql`
- (DB) aplicar migración en producción

**Interfaces:**
- Produces: `PLANS`, `getPlan(id)`, `planAmountCents(id)` desde `@/lib/config`; `Order.plan: PlanId` en `@/lib/orders`.

- [ ] **Step 1: Agregar PLANS a `web/lib/config.ts`** (mantener `PRICE_COP` para compatibilidad del home)

```ts
export const PRICE_COP = Number(process.env.PRICE_BASICO_COP || process.env.PRICE_COP || 39800);
export const AMOUNT_IN_CENTS = PRICE_COP * 100;
export const CURRENCY = 'COP';
export const SITE_NAME = 'Certificado de Tradición y Libertad';

export type PlanId = 'basico' | 'express';
export interface Plan { id: PlanId; label: string; tagline: string; priceCop: number; recommended?: boolean; features: string[]; }

export const PLANS: Record<PlanId, Plan> = {
  basico: {
    id: 'basico', label: 'Básico', tagline: 'Ideal si solo necesitas el documento oficial',
    priceCop: Number(process.env.PRICE_BASICO_COP || 39800),
    features: ['Certificado de Tradición y Libertad (PDF oficial)', 'Entrega por correo en minutos', 'Validez 30 días'],
  },
  express: {
    id: 'express', label: 'Express', tagline: 'Descubre problemas ocultos del inmueble', recommended: true,
    priceCop: Number(process.env.PRICE_EXPRESS_COP || 44900),
    features: [
      'Incluye el Certificado de Tradición y Libertad',
      'Estudio de títulos: propietarios, hipotecas, embargos y banderas de riesgo',
      'Semáforo de riesgo en lenguaje simple',
      'Entrega por correo en minutos',
    ],
  },
};

export function getPlan(id: string | null | undefined): Plan { return PLANS[(id as PlanId)] ?? PLANS.basico; }
export function planAmountCents(id: string | null | undefined): number { return getPlan(id).priceCop * 100; }

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
```

- [ ] **Step 2: Agregar `plan` al modelo en `web/lib/orders.ts`**

En `import`: `import { getPool } from './db';` (sin cambio). Agregar el tipo y el campo:
- En `OrderStatus` no se toca. Agregar al `interface Order` el campo `plan?: 'basico' | 'express';` (después de `transactionId?`).
- En `type Row` agregar `plan?: string | null;`.
- En `toOrder` agregar: `plan: (row.plan === 'express' ? 'express' : 'basico'),`.
- En `memStore.create` ya guarda el objeto entero (incluye plan). En `pgStore.create` cambiar el INSERT para incluir `plan`:

```ts
  async create(o) {
    const { rows } = await getPool().query<Row>(
      `INSERT INTO orders (reference, matricula, oficina, email, phone, amount_in_cents, status, plan)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [o.reference, o.matricula, o.oficina, o.email, o.phone, o.amountInCents, o.status, o.plan ?? 'basico'],
    );
    return toOrder(rows[0]);
  },
```

- [ ] **Step 3: Agregar la columna en `web/db/schema.sql`** (instalaciones nuevas)

Dentro de `CREATE TABLE IF NOT EXISTS orders (...)`, tras `transaction_id TEXT,`:
```sql
  plan             TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico','express')),
```

- [ ] **Step 4: Verificar que compila**

Run: `cd web && npm run build 2>&1 | grep -E "Compiled|error|Error" | head`
Expected: `✓ Compiled successfully`

- [ ] **Step 5: Aplicar la migración en producción** (la tabla `orders` ya existe → `IF NOT EXISTS` es no-op; hay que ALTER)

```bash
HK="SHA256:176Fxv3EwFl9S72NTyTop55193s9vbnbopDpwv9mLEE"
cat <<'SQL' | "/c/Program Files/PuTTY/plink.exe" -batch -hostkey "$HK" -ssh -pw 'Adriangarx29@' root@72.60.124.121 'CID=$(docker ps -qf name=certificados_db); PGPASSWORD=***REDACTED*** docker exec -i $CID psql -U postgres -d certificados -t -A'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'basico';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='orders_plan_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_plan_check CHECK (plan IN ('basico','express'));
  END IF;
END $$;
SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='plan';
SQL
```
Expected: imprime `plan`.

- [ ] **Step 6: Commit**

```bash
cd web && git add lib/config.ts lib/orders.ts db/schema.sql && git commit -m "feat(planes): config PLANS (basico/express) + orders.plan + migración"
```

---

### Task 2: Checkout de dos planes (UI + monto por plan + validación Wompi)

**Files:**
- Modify: `web/components/CheckoutForm.tsx`
- Modify: `web/app/api/checkout/route.ts`
- Modify: `web/lib/wompi.ts` (sin cambio de firma; usa monto que le pasen)
- Modify: `web/app/api/wompi/webhook/route.ts`
- Modify: `web/app/page.tsx` (pasar planes al CheckoutForm)

**Interfaces:**
- Consumes: `PLANS`, `planAmountCents`, `getPlan` de `@/lib/config`; `orders.create` con `plan`.
- Produces: `/api/checkout` acepta `{ ..., plan }` y cobra el monto del plan; el webhook valida que el pago == monto del plan de la orden.

- [ ] **Step 1: `web/app/api/checkout/route.ts` — aceptar `plan`, cobrar su monto**

Leer la ruta actual y aplicar: extraer `plan` del body (`const plan = body.plan === 'express' ? 'express' : 'basico';`), usar `planAmountCents(plan)` como `amountInCents` al crear la orden y construir la `checkoutUrl`, y pasar `plan` a `orders.create`. (Mantener la validación de matrícula y email existentes.)

```ts
import { planAmountCents } from '@/lib/config';
// ...
const plan = body.plan === 'express' ? 'express' : 'basico';
const amountInCents = planAmountCents(plan);
// al crear la orden:
await orders.create({ reference, matricula, oficina, email, phone, amountInCents, status: 'PENDING_PAYMENT', plan });
// al construir checkoutUrl: usar amountInCents (en vez del PRICE fijo)
const checkoutUrl = checkoutUrl_fn({ reference, amountInCents, redirectUrl: `${origin}/estado?ref=${reference}` });
```

- [ ] **Step 2: `web/app/api/wompi/webhook/route.ts` — validar monto por plan**

En la validación de la transacción aprobada, donde compara `real.amount_in_cents === claimed.amountInCents`, eso ya valida contra el monto de la orden (que ahora es el del plan). **Verificar** que `claimed.amountInCents` viene de la orden (sí). No requiere cambio si ya compara contra `order.amountInCents`. Si compara contra un PRICE fijo, cambiarlo a `claimed.amountInCents`.

- [ ] **Step 3: `web/components/CheckoutForm.tsx` — selector de plan**

Agregar `import { PLANS, formatCOP, type PlanId } from '@/lib/config';`. Estado nuevo: `const [plan, setPlan] = useState<PlanId>('express');` (Express por defecto = más conversión). Renderizar, dentro del modal antes del botón "Pagar", dos tarjetas con radio (Básico/Express) mostrando `PLANS[x].label`, `formatCOP(PLANS[x].priceCop)`, y `features`. El botón "Pagar" muestra `formatCOP(PLANS[plan].priceCop)`. En `confirmAndPay`, incluir `plan` en el body del POST a `/api/checkout`:

```tsx
body: JSON.stringify({ matricula, oficina, email, phone, plan }),
```

(Diseño visual: reutilizar el estilo de tarjetas del checkout actual; Express con badge "MÁS ELEGIDO". El botón refleja el precio del plan elegido.)

- [ ] **Step 4: Verificar build**

Run: `cd web && npm run build 2>&1 | grep -E "Compiled|error" | head`
Expected: `✓ Compiled successfully`

- [ ] **Step 5: Desplegar web y verificar monto por plan**

Desplegar web (túnel + `deployService` serviceName `web`). Luego:
```bash
curl -s -X POST https://certitradicion.com/api/checkout -H "content-type: application/json" \
  -d '{"oficina":"BARRANQUILLA","matricula":"95200","email":"t@t.com","plan":"express"}' --max-time 40 \
  | grep -o "amount-in-cents=[0-9]*"
```
Expected: `amount-in-cents=4490000` (Express). Repetir con `"plan":"basico"` → `amount-in-cents=3980000`.

- [ ] **Step 6: Commit**

```bash
cd web && git add components/CheckoutForm.tsx app/api/checkout/route.ts app/api/wompi/webhook/route.ts app/page.tsx && git commit -m "feat(checkout): selector de plan + cobro/validación por plan"
```

---

### Task 3: Cliente NIM (port de `nvidiaClient.ts` a `.mjs`)

**Files:**
- Create: `web/robot-service/nim-client.mjs`

**Interfaces:**
- Produces: `nimChat(messages, { model?, json? })` → `Promise<string>` (contenido del mensaje). Usa `NVIDIA_API_KEY`. Reintentos+backoff ante 429/5xx/red, timeout por request.

- [ ] **Step 1: Crear `web/robot-service/nim-client.mjs`**

```js
// Cliente NIM (NVIDIA, OpenAI-compatible). Port de _leo-pr/src/llm/nvidiaClient.ts a ESM.
// Reintentos con backoff exponencial ante 429/5xx/red. NUNCA loguea la key.
const BASE = process.env.LLM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const backoff = (n) => Math.min(20000, 1000 * 2 ** (n - 1)) + Math.floor(Math.random() * 400);
const transient = (e) => /HTTP (429|5\d\d)|ECONN|ETIMEDOUT|EAI_AGAIN|fetch failed|network|socket/i.test(String(e?.message || e));

// messages: array OpenAI ({role, content}). content puede ser string o array (texto + image_url) para visión.
export async function nimChat(messages, { model, json = false, maxTokens = 2048 } = {}) {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error('NVIDIA_API_KEY no seteada (requerida para el Estudio)');
  const mdl = model || process.env.LLM_MODEL || 'meta/llama-3.3-70b-instruct';
  const body = JSON.stringify({ model: mdl, temperature: 0, top_p: 1, max_tokens: maxTokens, ...(json ? { response_format: { type: 'json_object' } } : {}), messages });
  const maxAttempts = Number(process.env.LLM_MAX_RETRIES || 5);
  const timeoutMs = Number(process.env.LLM_REQUEST_TIMEOUT_MS || 120000);
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(`${BASE}/chat/completions`, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body, signal: ac.signal });
      if (res.status === 429 || res.status >= 500) {
        const ra = Number(res.headers.get('retry-after')) || 0;
        lastErr = new Error(`NIM HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
        if (attempt < maxAttempts) { await sleep(ra > 0 ? ra * 1000 : backoff(attempt)); continue; }
        throw lastErr;
      }
      if (!res.ok) throw new Error(`NIM HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`);
      const j = await res.json();
      const c = j.choices?.[0]?.message?.content;
      if (typeof c !== 'string') throw new Error('NIM sin contenido');
      return c;
    } catch (e) {
      lastErr = e;
      const aborted = e?.name === 'AbortError';
      if (attempt < maxAttempts && (aborted || transient(e))) { await sleep(backoff(attempt)); continue; }
      throw aborted ? new Error(`NIM timeout tras ${timeoutMs}ms`) : e;
    } finally { clearTimeout(t); }
  }
  throw lastErr;
}
```

- [ ] **Step 2: Verificar sintaxis**

Run: `cd web/robot-service && node --check nim-client.mjs && echo OK`
Expected: `OK`

- [ ] **Step 3: Verificar contra NIM real** (script temporal — la key ya está validada)

```bash
cd web/robot-service && NVIDIA_API_KEY=***REDACTED*** \
node --input-type=module -e "import {nimChat} from './nim-client.mjs'; console.log(await nimChat([{role:'user',content:'Responde solo: OK'}]))"
```
Expected: imprime `OK` (o similar). **No commitear la key en ningún archivo.**

- [ ] **Step 4: Commit**

```bash
cd web && git add robot-service/nim-client.mjs && git commit -m "feat(robot): cliente NIM (port nvidiaClient a .mjs)"
```

---

### Task 4: Lectura del CTL (texto + visión NIM)

**Files:**
- Create: `web/robot-service/pdf-read.mjs`
- Modify: `web/robot-service/package.json` (dep `pdf-parse`)

**Interfaces:**
- Consumes: `nimChat` de `./nim-client.mjs`; `pdf-to-png-converter` (ya dep).
- Produces: `extraerTextoCTL(pdfBuffer)` → `Promise<string>` (texto del CTL; usa texto directo, visión NIM si es escaneado).

- [ ] **Step 1: Agregar dep en `web/robot-service/package.json`**

En `dependencies`: `"pdf-parse": "^1.1.1"`.

- [ ] **Step 2: Crear `web/robot-service/pdf-read.mjs`**

```js
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
    const pdfParse = (await import('pdf-parse')).default;
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
```

- [ ] **Step 3: Verificar sintaxis**

Run: `cd web/robot-service && node --check pdf-read.mjs && echo OK`
Expected: `OK`

- [ ] **Step 4: Verificar contra un CTL real** — se valida junto con el Estudio en Task 5 (necesita un CTL descargado). Marcar como cubierto por el test de Task 5.

- [ ] **Step 5: Commit**

```bash
cd web && git add robot-service/pdf-read.mjs robot-service/package.json && git commit -m "feat(robot): lectura del CTL (texto + visión NIM)"
```

---

### Task 5: Análisis — Estudio de Títulos (texto → JSON)

**Files:**
- Create: `web/robot-service/estudio.mjs`

**Interfaces:**
- Consumes: `extraerTextoCTL` de `./pdf-read.mjs`; `nimChat` de `./nim-client.mjs`.
- Produces: `generarEstudio(pdfBuffer, { matricula, oficina })` → `Promise<EstudioJSON>` con la forma del spec.

- [ ] **Step 1: Crear `web/robot-service/estudio.mjs`**

```js
// Genera el Estudio de Títulos estructurado a partir del CTL. Lee el CTL → NIM (texto) → JSON validado.
import { extraerTextoCTL } from './pdf-read.mjs';
import { nimChat } from './nim-client.mjs';

const SYS = `Eres un analista jurídico inmobiliario en Colombia. Recibes el TEXTO de un Certificado de Tradición
y Libertad (CTL) y produces un "Estudio de Títulos" claro para un comprador no experto. Analiza SOLO lo que el
texto dice (no inventes). Identifica propietarios actuales, la cadena de tradición, y los gravámenes/limitaciones
VIGENTES (hipotecas, embargos, patrimonio de familia, afectación a vivienda familiar, demandas, falsa tradición,
servidumbres). Marca banderas de riesgo (rojo = grave: embargo/demanda/extinción/falsa tradición; amarillo =
atención: hipoteca vigente, patrimonio de familia). Devuelve EXCLUSIVAMENTE un JSON con esta forma exacta:
{
  "inmueble": { "matricula": string, "direccion": string|null, "circulo": string|null, "area": string|null },
  "propietarios": [ { "nombre": string, "identificacion": string|null, "modo": string, "anotacion": string|null } ],
  "gravamenes": [ { "tipo": string, "descripcion": string, "vigente": boolean, "anotacion": string|null } ],
  "banderas": [ { "nivel": "rojo"|"amarillo", "titulo": string, "detalle": string } ],
  "semaforo": "verde"|"amarillo"|"rojo",
  "resumen": string
}
Reglas del semáforo: rojo si hay alguna bandera roja; amarillo si solo hay amarillas; verde si no hay banderas.
"resumen": 2-4 frases en español simple, directo al comprador. No incluyas texto fuera del JSON.`;

export async function generarEstudio(pdfBuffer, { matricula, oficina }) {
  const texto = await extraerTextoCTL(pdfBuffer);
  const user = `Matrícula: ${matricula} · Oficina: ${oficina}\n\nTEXTO DEL CTL:\n${texto.slice(0, 24000)}`;
  const raw = await nimChat([{ role: 'system', content: SYS }, { role: 'user', content: user }], { json: true, maxTokens: 3000 });
  let data;
  try { data = JSON.parse(raw); } catch { data = JSON.parse((raw.match(/\{[\s\S]*\}/) || ['{}'])[0]); }
  // saneo + defaults (nunca confiar 100% en el modelo)
  data.inmueble = { matricula: String(matricula), direccion: null, circulo: oficina || null, area: null, ...(data.inmueble || {}) };
  data.propietarios = Array.isArray(data.propietarios) ? data.propietarios : [];
  data.gravamenes = Array.isArray(data.gravamenes) ? data.gravamenes : [];
  data.banderas = Array.isArray(data.banderas) ? data.banderas : [];
  if (!['verde', 'amarillo', 'rojo'].includes(data.semaforo)) {
    data.semaforo = data.banderas.some((b) => b.nivel === 'rojo') ? 'rojo' : data.banderas.length ? 'amarillo' : 'verde';
  }
  data.resumen = typeof data.resumen === 'string' ? data.resumen : '';
  return data;
}
```

- [ ] **Step 2: Verificar sintaxis**

Run: `cd web/robot-service && node --check estudio.mjs && echo OK`
Expected: `OK`

- [ ] **Step 3: Verificar contra un CTL REAL** (descargar el cert de 95200 del historial — NO cobra — y correr el estudio). Crear `scratchpad/test-estudio.mjs`:

```js
import { SnrRobot } from './snr-robot.mjs';
import { generarEstudio } from './estudio.mjs';
const r = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, browserlessWs: process.env.BROWSERLESS_WS, headless: true, stateFile: null, log: () => {} });
await r.start(); await r.ensureLoggedIn();
const pdf = await r.descargarDesdeHistorial('95200');
await r.stop();
const e = await generarEstudio(pdf, { matricula: '95200', oficina: 'BARRANQUILLA' });
console.log(JSON.stringify(e, null, 2));
console.assert(e.semaforo && Array.isArray(e.propietarios) && typeof e.resumen === 'string', 'forma inválida');
console.log('SEMAFORO=' + e.semaforo + ' propietarios=' + e.propietarios.length + ' gravamenes=' + e.gravamenes.length);
```
Correr DENTRO del contenedor robot (tiene env + browserless), vía `docker exec` con el script base64 (patrón del repo). Expected: imprime un JSON coherente con los datos reales del CTL (propietarios reales, gravámenes reales) y `SEMAFORO=...`. **Iterar el prompt `SYS` hasta que el análisis sea fiel.**

- [ ] **Step 4: Commit**

```bash
cd web && git add robot-service/estudio.mjs && git commit -m "feat(robot): análisis Estudio de Títulos (CTL → NIM → JSON)"
```

---

### Task 6: Render del PDF del Estudio (JSON → HTML → PDF)

**Files:**
- Create: `web/robot-service/estudio-template.mjs`
- Create: `web/robot-service/estudio-pdf.mjs`

**Interfaces:**
- Consumes: el `EstudioJSON` de Task 5; browserless (`BROWSERLESS_WS`).
- Produces: `renderEstudioPdf(estudio, { matricula, oficina, fecha })` → `Promise<Buffer>` (PDF).

- [ ] **Step 1: Crear `web/robot-service/estudio-template.mjs`** (HTML branded del Estudio)

```js
// HTML del Estudio de Títulos (email-safe NO requerido: se renderiza a PDF con Chrome). Branded Certitradición.
const SEMA = { verde: { c: '#0F7A52', bg: '#E8F5EF', t: 'Sin alertas relevantes' }, amarillo: { c: '#B7791F', bg: '#FEF6E7', t: 'Requiere atención' }, rojo: { c: '#B42318', bg: '#FDECEC', t: 'Riesgo alto' } };
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

export function estudioHtml(e, { matricula, oficina, fecha }) {
  const s = SEMA[e.semaforo] || SEMA.amarillo;
  const row = (k, v) => v ? `<tr><td class="k">${esc(k)}</td><td class="v">${esc(v)}</td></tr>` : '';
  const banderas = (e.banderas || []).map((b) => `<div class="flag ${b.nivel}"><b>${esc(b.titulo)}</b><span>${esc(b.detalle)}</span></div>`).join('') || '<p class="muted">No se detectaron banderas de riesgo en el documento.</p>';
  const props = (e.propietarios || []).map((p) => `<li><b>${esc(p.nombre)}</b>${p.identificacion ? ' · ' + esc(p.identificacion) : ''} <span class="muted">${esc(p.modo || '')}${p.anotacion ? ' (' + esc(p.anotacion) + ')' : ''}</span></li>`).join('') || '<li class="muted">No identificados en el texto.</li>';
  const grav = (e.gravamenes || []).map((g) => `<li><b>${esc(g.tipo)}</b> ${g.vigente ? '<span class="tag v">VIGENTE</span>' : '<span class="tag">no vigente</span>'}<br><span class="muted">${esc(g.descripcion)}${g.anotacion ? ' · ' + esc(g.anotacion) : ''}</span></li>`).join('') || '<li class="muted">Sin gravámenes ni limitaciones vigentes encontrados.</li>';
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif} body{margin:0;color:#0D1B2A}
  .page{padding:40px 44px}
  .head{display:flex;align-items:center;gap:12px;border-bottom:2px solid #103A73;padding-bottom:16px}
  .brand{font-weight:800;font-size:20px;color:#103A73} .sub{font-size:10px;letter-spacing:.18em;color:#8593A3}
  h1{font-size:22px;margin:22px 0 4px} .muted{color:#5B6B7E}
  .sema{display:flex;align-items:center;gap:12px;background:${s.bg};border-radius:12px;padding:14px 18px;margin:16px 0}
  .dot{width:26px;height:26px;border-radius:999px;background:${s.c}} .sema b{color:${s.c};font-size:16px}
  table{width:100%;border-collapse:collapse;margin:6px 0 14px} .k{color:#5B6B7E;width:160px;padding:5px 0} .v{font-weight:600;padding:5px 0}
  h2{font-size:14px;color:#103A73;margin:18px 0 6px;text-transform:uppercase;letter-spacing:.04em}
  ul{margin:6px 0;padding-left:18px} li{margin:6px 0}
  .tag{font-size:10px;background:#eef1f7;color:#5B6B7E;border-radius:6px;padding:1px 6px} .tag.v{background:#FDECEC;color:#B42318}
  .flag{display:flex;flex-direction:column;border-left:4px solid #999;background:#fafbfd;padding:8px 12px;margin:6px 0;border-radius:6px}
  .flag.rojo{border-color:#B42318;background:#FDECEC} .flag.amarillo{border-color:#B7791F;background:#FEF6E7}
  .flag span{font-size:12px;color:#5B6B7E}
  .resumen{background:#EEF3FB;border-radius:12px;padding:16px;margin:16px 0;font-size:14px;line-height:1.5}
  .disc{font-size:10px;color:#8593A3;border-top:1px solid #E3E9F1;margin-top:24px;padding-top:12px;line-height:1.5}
  </style></head><body><div class="page">
    <div class="head"><span class="brand">Certitradición</span><span class="sub">ESTUDIO DE TÍTULOS</span></div>
    <h1>Estudio de Títulos del inmueble</h1>
    <p class="muted">Matrícula ${esc(matricula)} · ${esc(oficina)} · ${esc(fecha)}</p>
    <div class="sema"><div class="dot"></div><div><b>${s.t}</b><br><span class="muted">Semáforo de riesgo según el Certificado de Tradición y Libertad.</span></div></div>
    <div class="resumen">${esc(e.resumen) || 'Resumen no disponible.'}</div>
    <h2>Identificación del inmueble</h2>
    <table>${row('Matrícula', e.inmueble?.matricula)}${row('Dirección', e.inmueble?.direccion)}${row('Círculo registral', e.inmueble?.circulo)}${row('Área', e.inmueble?.area)}</table>
    <h2>Propietarios y tradición</h2><ul>${props}</ul>
    <h2>Gravámenes y limitaciones</h2><ul>${grav}</ul>
    <h2>Banderas de riesgo</h2>${banderas}
    <p class="disc">Análisis informativo automatizado generado a partir del Certificado de Tradición y Libertad. No constituye asesoría jurídica profesional ni reemplaza el estudio de un abogado.</p>
  </div></body></html>`;
}
```

- [ ] **Step 2: Crear `web/robot-service/estudio-pdf.mjs`** (HTML → PDF con browserless, página separada)

```js
// Renderiza el HTML del Estudio a PDF usando una página NUEVA de Browserless (no la del genRobot logueado).
import { chromium } from 'playwright';
import { estudioHtml } from './estudio-template.mjs';

export async function renderEstudioPdf(estudio, meta) {
  const ws = process.env.BROWSERLESS_WS;
  if (!ws) throw new Error('BROWSERLESS_WS no seteado');
  const browser = await chromium.connectOverCDP(ws);
  try {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.setContent(estudioHtml(estudio, meta), { waitUntil: 'load' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } });
    await ctx.close();
    return Buffer.from(pdf);
  } finally { try { await browser.close(); } catch {} }
}
```

- [ ] **Step 3: Verificar sintaxis**

Run: `cd web/robot-service && node --check estudio-template.mjs && node --check estudio-pdf.mjs && echo OK`
Expected: `OK`

- [ ] **Step 4: Verificar render** — dentro del contenedor robot, con un `estudio` de ejemplo (o el de Task 5): `const buf = await renderEstudioPdf(e, {matricula:'95200',oficina:'BARRANQUILLA',fecha:'26 de junio de 2026'}); console.log(buf.length, buf.slice(0,5).toString());`
Expected: `>0 %PDF-`.

- [ ] **Step 5: Commit**

```bash
cd web && git add robot-service/estudio-template.mjs robot-service/estudio-pdf.mjs && git commit -m "feat(robot): render del PDF del Estudio (HTML → browserless)"
```

---

### Task 7: Integración — generación Express + entrega de 2 PDFs + deploy

**Files:**
- Modify: `web/robot-service/server.mjs` (`generarOne`: branch Express)
- Modify: `web/robot-service/deliver.mjs` (`entregarCorreo` con `estudio` opcional + 2 adjuntos)
- Modify: `web/robot-service/ctl-template.mjs` (mención del Estudio en el copy, opcional)
- Modify: `web/lib/n8n.ts` y `web/app/api/wompi/webhook/route.ts` (propagar `plan` al `/generar`)
- (Env) `NVIDIA_API_KEY` en el servicio robot

**Interfaces:**
- Consumes: `generarEstudio` de `./estudio.mjs`, `renderEstudioPdf` de `./estudio-pdf.mjs`.
- El payload de `/generar` ahora incluye `plan`.

- [ ] **Step 1: Propagar `plan` hasta el robot**

- `web/lib/n8n.ts`: agregar `plan` a `GenerarCTLPayload` y pasarlo en el body.
- `web/app/api/wompi/webhook/route.ts`: en `triggerGenerarCTL({...})`, incluir `plan: order.plan ?? claimed.plan`.

- [ ] **Step 2: `deliver.mjs` — recibir `estudio` (Buffer) opcional y adjuntar 2 PDFs**

En `entregarCorreo({ pdf, matricula, oficina, email, reference, estudio })`, tras armar `attachments`:
```js
if (estudio) attachments.push({ filename: `Estudio-Titulos-${matricula}.pdf`, content: estudio });
```
(Opcional: en `ctl-template.mjs`, si se pasa un flag `conEstudio`, agregar una línea "Incluye tu Estudio de Títulos adjunto".)

- [ ] **Step 3: `server.mjs` `generarOne` — branch Express (best-effort)**

Tras `const r = await robot.generar({ oficina, matricula });` y antes de `reportPanel(... OK)`, agregar:
```js
let estudioPdf = null;
if (job.plan === 'express') {
  try {
    const { generarEstudio } = await import('./estudio.mjs');
    const { renderEstudioPdf } = await import('./estudio-pdf.mjs');
    const fecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
    const data = await generarEstudio(r.pdf, { matricula, oficina });
    estudioPdf = await renderEstudioPdf(data, { matricula, oficina, fecha });
    console.error(`[estudio] ✅ ${matricula} (${estudioPdf.length} bytes, semáforo ${data.semaforo})`);
  } catch (e) {
    console.error(`[estudio] ✕ ${matricula}: ${e.message}`); // best-effort: el CTL igual se entrega
    await reportPanel({ reference, matricula, oficina, status: 'OK', costCents: 0, error: 'estudio falló: ' + String(e.message).slice(0, 200) }).catch(() => {});
  }
}
```
Y en la llamada a `entregarCorreo`, pasar `estudio: estudioPdf`.

- [ ] **Step 4: Verificar sintaxis**

Run: `cd web/robot-service && node --check server.mjs && node --check deliver.mjs && echo OK`
Expected: `OK`

- [ ] **Step 5: Setear `NVIDIA_API_KEY` en el servicio robot** (EasyPanel, merge-preserving env) y desplegar robot.

(Usar el patrón de `updateEnv` + `deployService` vía túnel; agregar `NVIDIA_API_KEY=<key NIM>` sin borrar el resto del env.)

- [ ] **Step 6: Prueba end-to-end CONTROLADA (sin cobrar de más)** — descargar el CTL de 95200 del historial y correr el flujo Express completo enviando a un correo de prueba:

```js
// scratchpad/test-express.mjs (correr en el contenedor robot)
import { SnrRobot } from './snr-robot.mjs';
import { generarEstudio } from './estudio.mjs';
import { renderEstudioPdf } from './estudio-pdf.mjs';
import { entregarCorreo } from './deliver.mjs';
const r = new SnrRobot({ user: process.env.SNR_USER, pass: process.env.SNR_PASS, browserlessWs: process.env.BROWSERLESS_WS, headless: true, stateFile: null, log: () => {} });
await r.start(); await r.ensureLoggedIn();
const pdf = await r.descargarDesdeHistorial('95200'); await r.stop();
const data = await generarEstudio(pdf, { matricula: '95200', oficina: 'BARRANQUILLA' });
const estudio = await renderEstudioPdf(data, { matricula: '95200', oficina: 'BARRANQUILLA', fecha: '26 de junio de 2026' });
const d = await entregarCorreo({ pdf, matricula: '95200', oficina: 'BARRANQUILLA', email: process.env.TEST_EMAIL, reference: 'EXPRESS-TEST', estudio });
console.log('entregado:', JSON.stringify(d), 'estudio bytes:', estudio.length);
```
Expected: el correo de prueba recibe **2 adjuntos** (CTL + Estudio), el Estudio coherente con el CTL. No toca saldo SNR (solo descarga).

- [ ] **Step 7: Commit + deploy final**

```bash
cd web && git add robot-service/ lib/n8n.ts app/api/wompi/webhook/route.ts && git commit -m "feat(express): generación del Estudio + entrega de 2 PDFs (best-effort)"
# luego: deploy robot
```

---

## Self-Review

**Cobertura del spec:**
- Planes/precios → Task 1. ✓
- Checkout selector + monto + validación Wompi → Task 2. ✓
- Lectura CTL (texto+visión, patrón _leo-pr) → Tasks 3-4. ✓
- Análisis JSON (inmueble/propietarios/gravámenes/banderas/semáforo/resumen) → Task 5. ✓
- PDF branded + disclaimer → Task 6. ✓
- Entrega 2 PDFs + branch Express + robustez best-effort → Task 7. ✓
- Config env NVIDIA_API_KEY + dep pdf-parse → Tasks 4, 7. ✓
- Fuera de alcance (Tusdatos/avalúo) → no se implementa. ✓

**Placeholders:** ninguno — todo el código está completo. Las verificaciones contra NIM/CTL reales requieren correr en el contenedor (patrón del repo), no son TBD.

**Consistencia de tipos:** `nimChat(messages,{model,json,maxTokens})`, `extraerTextoCTL(buffer)`, `generarEstudio(buffer,{matricula,oficina})`, `renderEstudioPdf(estudio,{matricula,oficina,fecha})`, `entregarCorreo({...,estudio})`, `Order.plan`, `PLANS`/`planAmountCents` — nombres y firmas usados consistentemente entre tareas. ✓

**Notas de seguridad:** la key NIM NO se commitea (solo se setea como env en EasyPanel); en los scripts de verificación se pasa por env, nunca en archivos versionados.
