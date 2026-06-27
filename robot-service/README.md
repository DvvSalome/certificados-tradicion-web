# Robot SNR — servicio de generación y validación de certificados

Worker que **genera** Certificados de Tradición y Libertad (CTL) en el portal del SNR
(`certificados.supernotariado.gov.co`) y **valida** matrículas antes de cobrar. Es el motor detrás de
certitradicion.com: la web recibe el pago (Wompi) y dispara a este servicio, que automatiza el portal del
SNR vía navegador remoto (Browserless), descarga el PDF y lo entrega por correo.

> ⚠️ **Sin secretos en este archivo.** Aquí solo se nombran variables de entorno; sus valores viven en
> EasyPanel (env del servicio), nunca en el repo.

---

## 1. Dónde vive / cómo se despliega

| | |
|---|---|
| **Carpeta (código)** | `web/robot-service/` |
| **Arranque** | `node server.mjs` (ESM puro, sin build, sin TypeScript) |
| **Imagen Docker** | `easypanel/certificados/robot:latest` |
| **Builder** | **Nixpacks** (EasyPanel) — no hay `Dockerfile`; Nixpacks detecta Node y arma la imagen desde la subcarpeta `/robot-service` del repo |
| **Puerto interno** | `3000` → host interno `certificados_robot:3000` (no expuesto a internet) |
| **Réplicas** | **1** (obligatorio — ver §4) |
| **Repo / rama** | GitHub `FOURGSOLUTIONS-FGS/certificados-tradicion-web`, rama `master`, path `/robot-service` |
| **Despliegue** | EasyPanel `deployService` (proyecto `certificados`, servicio `robot`) vía túnel SSH. Construye desde `master` |

El contenedor corre en el VPS dentro de la stack de EasyPanel, junto a `certificados_web`, `certificados_db`
(Postgres) y `browserless_browserless`.

---

## 2. Qué expone (endpoints HTTP)

| Método | Ruta | Auth | Qué hace |
|---|---|---|---|
| `POST` | `/generar` | header `x-webhook-secret` | Genera el CTL (y el Estudio si `plan==='express'`) y lo entrega. Responde **202** al instante y procesa en segundo plano. |
| `POST` | `/verificar` | — | Valida disponibilidad de una matrícula (consulta pública, **sin login**). |
| `GET` | `/health` | — | Estado del worker. |

La web llama a `/generar` y `/verificar` **directo** (env `N8N_GENERAR_CTL_URL` / `N8N_VERIFY_URL` apuntan a
`http://certificados_robot:3000/...`). **n8n NO está en este camino** — solo se usa para alertas.

---

## 3. Arquitectura — dos "robots" distintos

### 3.1 Validación (`/verificar`) — SIN login
Validar si una matrícula existe **no requiere sesión**: usa el formulario público del homepage del SNR.
- **Camino rápido (`snr-consulta-http.mjs` → `consultaHttp`)**: replica el AJAX de PrimeFaces por **HTTP puro**
  (sin navegador) → ~1 s. Corre en paralelo (sin lock).
- **Fallback (`snr-robot.mjs` → `consultarPublico`)**: si el HTTP falla, usa el navegador (Browserless).
- Un `verifyRobot` persistente se calienta al arrancar y un heartbeat (cada 5 min) lo mantiene vivo.
  **Nunca loguea** → no gasta logins ni se ve afectado por bloqueos de cuenta.

### 3.2 Generación (`/generar`) — CON login (este es el único punto que loguea)
- Mantiene **un `genRobot` PERSISTENTE** con la sesión SNR ya logueada.
- `robot.generar()` usa `ensureLoggedIn()`, que **reutiliza** la sesión y solo re-loguea si murió.
  → **50+ certificados/día ≈ 1 login**, no 50.
- Las generaciones se **serializan** en una cola (`genChain`): una a la vez, comparten una sola página del
  navegador → nunca se pisan en el carrito del SNR.
- Si una generación falla con error que no sea `NO_DISPONIBLE`, se **resetea** el `genRobot` (sesión posible
  sucia) → la próxima venta arranca limpia.

### 3.3 Flujo de una venta (Express)
```
web webhook (pago Wompi aprobado)
  └─ POST /generar { reference, oficina, matricula, email, plan }
       └─ genChain (serializado)
            ├─ ensureGenRobot() → sesión SNR logueada (reusada)
            ├─ robot.generar()  → carrito → paga saldo prepago → descarga el CTL (Buffer PDF)
            ├─ reporta OK al panel  → la orden pasa a DELIVERED
            ├─ si plan==='express': Estudio de Títulos (best-effort, ver §5)
            └─ entregarCorreo()  → email con 1 PDF (básico) o 2 PDFs (express) + copia en "Enviados"
```

---

## 4. Por qué 1 sola réplica (¡no escalar!)
La sesión SNR logueada vive en la **memoria del proceso Node**. Con 2+ réplicas, cada contenedor tendría su
propia sesión → más logins (el SNR bloquea por logins/día) + dos carritos en carrera. Por eso `replicas: 1`
es un **requisito**, no una casualidad. Si el contenedor reinicia, se pierde la sesión y la **próxima** venta
re-loguea (1 login por vida del contenedor, no por venta).

---

## 5. Estudio de Títulos (plan Express)
Tras descargar el CTL, si `plan==='express'`, se genera un PDF de análisis con IA (NVIDIA NIM, gratis):
```
CTL (Buffer PDF)
  → pdf-read.mjs   → texto (pdf-parse; si es escaneado, OCR por visión NIM)
  → estudio.mjs    → NIM (texto) → JSON {inmueble, propietarios, gravámenes, banderas, semáforo, resumen}
  → estudio-pdf.mjs→ HTML branded (estudio-template.mjs) → PDF vía Browserless (página nueva)
  → se adjunta como 2º PDF en el correo
```
**Best-effort:** si el Estudio falla (IA/render), **el CTL igual se entrega** y se dispara la alerta
`estudio_pendiente` al admin (sin contar doble la generación). El cliente nunca queda sin su CTL.
Requiere env `NVIDIA_API_KEY` (nunca logueada, nunca en archivo versionado).

---

## 6. Pool de cuentas SNR (fallback) — `snr-accounts.mjs`
El SNR bloquea una cuenta si recibe demasiados logins/día. Para resiliencia y más capacidad, el robot soporta
**varias cuentas** con **fallback reactivo**:

- **Config (1 variable, extensible):** `SNR_ACCOUNTS="CC22521092:clave,CC72237401:clave"`.
  Agregar otra cuenta = anexar `,CCxxxx:clave`. Compatible: si no está, usa `SNR_USER`/`SNR_PASS` (1 cuenta).
- **Fallback reactivo:** `pickAccount()` devuelve la primera cuenta **usable** (sin cooldown y con saldo).
  Si la cuenta activa se **bloquea** (login con código `ACCOUNT_BLOCKED`) o se queda **sin saldo**, se marca y
  la siguiente generación salta a otra cuenta. Si **todas** se agotan → falla + alerta "agregar cuenta".
- **Cooldown:** una cuenta bloqueada queda en pausa **hasta la próxima medianoche (hora Colombia)** — el
  bloqueo del SNR es por día. Una cuenta sin saldo se reactiva sola cuando `setSaldo()` la sube.
- **Saldo por cuenta:** `setSaldo(user, cents)` registra el saldo leído (`leerSaldo()`); `estado()` da el
  snapshot (cuenta, disponible, saldo, motivo) para panel/alertas.
- **Por qué reactivo y no rotación:** el login es el recurso escaso (1 login/cuenta/día). Reactivo da N×
  capacidad sin gastar logins de más; rotar gastaría logins justo en lo que bloquea.

> **Estado de rollout:** el módulo `snr-accounts.mjs` está construido y con self-test de su lógica; la
> **detección de bloqueo** ya está en `login()`. Falta cablear `ensureGenRobot`/`generarOne` para que tomen la
> cuenta del pool y reporten el saldo por cuenta, + probar con la 2ª cuenta real, antes de activarlo en prod.

---

## 7. Entrega por correo — `deliver.mjs`
- SMTP (Hostinger) con plantilla premium (`ctl-template.mjs`), logo embebido (CID) y **preview difuminado**
  ("vista protegida") de la 1ª página.
- Adjunta **1 PDF** (básico: CTL) o **2 PDFs** (express: CTL + Estudio).
- Guarda copia en la carpeta **"Enviados"** del webmail vía **IMAP APPEND** (SMTP solo entrega; Enviados se
  llena por IMAP). Todo best-effort: si el preview o el IMAP fallan, el correo igual sale.

---

## 8. Mapa de archivos
| Archivo | Responsabilidad |
|---|---|
| `server.mjs` | HTTP server; orquesta `/generar` (genChain, genRobot persistente) y `/verificar`; reporta al panel |
| `snr-robot.mjs` | Automatización Playwright del portal SNR: `login`, `ensureLoggedIn`, `consultarPublico`, `generar`, `descargarDesdeHistorial`, `leerSaldo` |
| `snr-consulta-http.mjs` | Validación por HTTP directo (sin navegador) + mapa de las 195 oficinas |
| `snr-accounts.mjs` | **Pool de cuentas** (fallback por bloqueo/saldo, cooldown diario) |
| `nim-client.mjs` | Cliente NVIDIA NIM (OpenAI-compatible) con reintentos/backoff |
| `pdf-read.mjs` | Lee el CTL: texto (`pdf-parse`) o visión NIM si es escaneado |
| `estudio.mjs` | Análisis del CTL → JSON estructurado del Estudio |
| `estudio-template.mjs` | HTML branded del Estudio (semáforo, secciones, disclaimer) |
| `estudio-pdf.mjs` | Render del HTML del Estudio a PDF vía Browserless |
| `deliver.mjs` | Envío del correo (SMTP) + preview + copia en Enviados (IMAP) |
| `ctl-template.mjs` | Plantillas HTML/texto del correo del CTL |
| `package.json` | Dependencias (playwright, nodemailer, sharp, pdf-to-png-converter, pdf-parse, imapflow) |

---

## 9. Variables de entorno (EasyPanel → servicio `robot`)
| Variable | Para qué |
|---|---|
| `SNR_USER` / `SNR_PASS` | Cuenta SNR (1 sola). Sustituibles por `SNR_ACCOUNTS` (pool). |
| `SNR_ACCOUNTS` | Pool de cuentas `"user1:pass1,user2:pass2"` (opcional; tiene prioridad sobre SNR_USER). |
| `BROWSERLESS_WS` | WebSocket del navegador remoto (Browserless). |
| `PANEL_BASE_URL` | URL interna de la web para reportar generaciones/alertas (`http://certificados_web:3000`). |
| `N8N_WEBHOOK_SECRET` | Secreto compartido que protege `/generar`. |
| `SNR_COST_COP` | Costo de 1 cert al saldo prepago (default 23000). |
| `NVIDIA_API_KEY` | Key de NIM para el Estudio (Express). **Nunca logueada ni versionada.** |
| `SMTP_USER` / `SMTP_PASS` | Cuenta de correo para enviar + guardar en Enviados (IMAP). |
| `APP_BASE_URL` | URL pública del sitio (links del correo). |
| `PORT` | Puerto (3000). |
| `NIXPACKS_NODE_VERSION` / `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | Build (Node 22; no baja Chromium — usa Browserless). |

---

## 10. Operación
- **Recargar saldo:** se hace en el portal del SNR (manual, Alexis). El panel muestra el saldo; bajo umbral
  dispara alerta WhatsApp+Email.
- **Agregar una cuenta SNR:** editar `SNR_ACCOUNTS` en EasyPanel (anexar `,CCxxxx:clave`) y redeploy. Sin código.
- **Si una cuenta se bloquea ("cantidad inusual de ingresos por día"):** es temporal (por día). Con pool, el
  robot salta solo a otra cuenta; sin pool, esperar el reset diario. Para proteger la cuenta, evitar churn de
  logins (redeploys/reinicios repetidos del robot).
- **Recuperar un bloqueo a mano:** `docker service scale certificados_robot=0` detiene todo login; reset diario;
  volver a `scale=1`.
- **Ver logs:** EasyPanel → servicio `robot` → Logs (o `docker logs` del contenedor `certificados_robot`).

---

## 11. Verificación / tests
No hay framework de tests (ESM `.mjs` puro). La verificación es por scripts `node` que asertan:
- `node --check <archivo>.mjs` para sintaxis.
- Lógica del pool: self-test de `snr-accounts.mjs` (bloqueo→fallback→sin saldo→recarga→reset diario).
- Pipeline del Estudio: correr sobre un CTL real ya descargado, dentro del contenedor.
