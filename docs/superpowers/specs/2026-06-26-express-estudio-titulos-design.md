# Spec — Plan Express con Estudio de Títulos (Fase A)

**Fecha:** 2026-06-26 · **Proyecto:** Certitradición (certitradicion.com) · **Estado:** diseño aprobado, pendiente plan de implementación

## 1. Objetivo

Hoy Certitradición vende un solo producto: el Certificado de Tradición y Libertad (CTL) a **$39.900**. El cliente (Alexis) quiere ofrecer un tier superior **Express** —estilo legalcheck.com.co— que agregue análisis sobre el inmueble.

Estrategia: **ganar por volumen**, no por precio. Por eso el Express va **por debajo** de legalcheck ($49.900).

**Fase A (este spec):** lanzar el tier Express con el componente más factible y de mayor valor: el **Estudio de Títulos** (análisis automatizado del CTL por IA). Las alertas/antecedentes (Tusdatos) y el avalúo quedan para fases B y C.

## 2. Planes y precios

| Plan | Precio | Incluye |
|---|---|---|
| **Básico** | **$39.800** | CTL (PDF oficial) |
| **Express** | **$44.900** | CTL + **Estudio de Títulos** (PDF branded) |

Costo de producir el Estudio: **$0** (NVIDIA NIM, free tier). Margen casi total en el +$5.100.

## 3. Arquitectura (qué cambia y qué se reutiliza)

### 3.1 Selección de plan (checkout)
- `lib/config.ts`: definir `PLANS = { basico: {id,label,price,features[]}, express: {...} }` en lugar del único `PRICE_COP`.
- `components/CheckoutForm.tsx`: selector de plan (2 tarjetas con radio, Express marcado "MÁS ELEGIDO" con su lista de features) dentro del modal actual. El total mostrado y el botón "Pagar" reflejan el plan elegido.
- La orden lleva el plan elegido y su monto.

### 3.2 Modelo de orden y pagos
- `db/schema.sql` + migración: `orders.plan TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico','express'))`.
- `lib/orders.ts`: `Order.plan`; `create` lo persiste; `toOrder` lo lee.
- `app/api/checkout/route.ts`: valida el plan, usa el monto del plan para crear la orden + la firma de integridad Wompi.
- `app/api/wompi/webhook/route.ts`: valida que `amount_in_cents` del pago **coincida con el monto del plan de la orden** (anti-fraude — ya valida monto; ahora contra el monto del plan).
- `lib/wompi.ts`: el checkout usa el monto del plan.

### 3.3 Generación (robot)
- `robot-service/server.mjs` (`generarOne`): el payload de `/generar` ahora incluye `plan`. Tras generar+descargar el CTL (flujo actual), **si `plan==='express'`** ejecuta la generación del Estudio.
- El robot ya descarga el CTL como Buffer PDF (fix de `dl.url()` ya desplegado). Ese Buffer es la entrada del Estudio.

### 3.4 Estudio de Títulos (núcleo nuevo — NIM, free)
Reutiliza el patrón probado de `_leo-pr`/`_audit-main`, **portado a `.mjs`**:

1. **Cliente NIM** — nuevo `robot-service/nim-client.mjs` (port de `nvidiaClient.ts`): OpenAI-compatible `POST https://integrate.api.nvidia.com/v1/chat/completions`, `temperature:0`, reintentos con backoff exponencial ante 429/5xx/red, timeout por request, key en `process.env.NVIDIA_API_KEY` (nunca logueada).
2. **Lectura del CTL** — nuevo `robot-service/pdf-read.mjs`:
   - Extracción de texto directa (`pdf-parse`) del CTL Buffer.
   - Si el PDF es escaneado (~0 texto): renderizar páginas con `pdf-to-png-converter` (dep ya presente) → **visión NIM** (`meta/llama-3.2-90b-vision-instruct`, port de `ocr.ts`) con guard anti-degeneración → texto.
3. **Análisis** — nuevo `robot-service/estudio.mjs`: manda el texto del CTL al modelo de texto NIM (`meta/llama-3.3-70b-instruct`) con un prompt estructurado → JSON validado:
   ```
   { inmueble: {matricula, direccion, circulo, area?},
     propietarios: [{nombre, identificacion?, modo, anotacion}],
     gravamenes:   [{tipo, descripcion, vigente, anotacion}],   // hipotecas, embargos, patrimonio de familia, afectaciones
     banderas:     [{nivel:'rojo'|'amarillo', titulo, detalle}], // falsa tradición, embargos, demandas, etc.
     semaforo:     'verde'|'amarillo'|'rojo',
     resumen:      "texto en lenguaje simple" }
   ```
4. **Render PDF** — nuevo `robot-service/estudio-template.mjs` (HTML branded del estudio: sello Certitradición, semáforo, secciones, disclaimer) + render a PDF vía **browserless** (`page.pdf()` — ya conectado). Disclaimer obligatorio: *"Análisis informativo automatizado generado a partir del Certificado de Tradición y Libertad. No constituye asesoría jurídica profesional ni reemplaza el estudio de un abogado."*

### 3.5 Entrega
- `robot-service/deliver.mjs`: `entregarCorreo` recibe un PDF opcional `estudio`; en Express adjunta **2 PDFs** (CTL + Estudio). El copy del correo (`ctl-template.mjs`) menciona el Estudio cuando aplica.
- El IMAP append (Enviados) y el preview difuminado se mantienen.

## 4. Flujo de datos

```
checkout(plan) → orden(plan, monto) → Wompi(monto del plan) → webhook(valida monto==plan)
  → /generar(plan) → robot: CTL (siempre) + Estudio (si express)
  → correo (1 PDF básico / 2 PDFs express) → orden DELIVERED
```

## 5. Manejo de errores y robustez
- **NIM 429/5xx/timeout** → backoff exponencial acotado (reuso del patrón). Guard anti-degeneración en visión.
- **Estudio falla** (IA/render) → **el CTL SÍ se entrega igual** (es lo crítico); el correo sale con el CTL, se loguea y se dispara alerta "Estudio pendiente — reenviar manual" al admin. Best-effort, como el preview. El cliente nunca queda sin su CTL.
- **Monto del pago** validado contra el plan en el webhook (anti-fraude).
- La generación sigue **serializada** sobre el `genRobot` persistente (no cambia el modelo de sesión SNR).

## 6. Config / env (servicio robot, EasyPanel)
- `NVIDIA_API_KEY` = key NIM (free) — verificada funcionando.
- Opcionales con default: `LLM_MODEL` (`meta/llama-3.3-70b-instruct`), `OCR_VISION_MODEL` (`meta/llama-3.2-90b-vision-instruct`).
- Nueva dependencia: `pdf-parse` (extracción de texto). `pdf-to-png-converter` ya está.

## 7. Testing
- **Estudio aislado:** correr `estudio.mjs` sobre un CTL real ya descargado (matrícula 95200, sin volver a cobrar al SNR) → verificar el JSON estructurado + el PDF renderizado. Iterar el prompt hasta que el análisis sea fiel y claro.
- **Flujo de planes:** orden Express → monto correcto en Wompi → webhook valida → (en prueba controlada) generación de los 2 PDFs.
- **Degradación:** simular fallo de NIM → confirmar que el CTL igual se entrega + alerta.

## 8. Fuera de alcance (fases siguientes)
- **Fase B:** Alertas (lavado/estafas/extinción) + Antecedentes de propietarios vía **Tusdatos** (agrega Procuraduría, Contraloría, Policía, Rama Judicial, listas restrictivas/OFAC). OFAC directo gratis como respaldo.
- **Fase C:** Avalúo comercial digital (avalúo catastral × factor de zona, o API de valoración).

## 9. Riesgos
- **NIM free tier**: límites de tasa a volumen alto → si topa, key dedicada o tier pago de NIM (el código ya tiene backoff; el cambio sería solo la key).
- **Calidad del análisis**: depende del modelo + prompt → iterar el prompt con CTLs reales; el disclaimer cubre el alcance legal.
- **Variabilidad del CTL**: distintas oficinas/formatos → el camino texto+visión cubre ambos; validar con CTLs de varias oficinas.
