# DESIGN.md — Certitradición

**Manual de marca + estrategia SEO/GEO + prompts de generación.**
Documento base para generar un frontend, un logo y todo el material de marca coherente.
Marca: **Certitradición** · certitradicion.com · Colombia · Categoría: emisión en línea de Certificados de Tradición y Libertad (CTL).

---

## 1. La marca en una frase

> **Certitradición es el camino más corto y confiable entre "necesito el certificado de tradición" y "ya lo tengo — y entiendo qué dice".**

Mientras el competidor (legalcheck) suena a *"chequeo/auditoría"* (anglicismo frío, olvidable), nosotros somos **certificado oficial + rápido + en español claro + te lo explicamos**.

## 2. Posicionamiento (cómo le ganamos a legalcheck)

Tres pilares, en este orden:
1. **Confianza registral** — lenguaje colombiano, sin anglicismos, sello de "documento oficial vigente", transparencia de ser intermediario privado.
2. **Velocidad medible** — "en tu correo o WhatsApp en minutos", con SLA visible, contador de entrega y estados por WhatsApp.
3. **UX sin fricción + humano colombiano** — el formulario más corto del mercado, pago en un toque, y un asesor real por WhatsApp cuando se complica.

**Diferenciador / foso defensivo:** la capa **"lector AI + semáforo de riesgo"** — además del PDF, el usuario recibe un resumen en lenguaje simple ("tu predio: sin hipotecas, sin embargos, último propietario X") con un **semáforo verde / amarillo / rojo**.

## 3. Mensajes clave (copy)

- **Titular:** *Tu Certificado de Tradición y Libertad, oficial y vigente — en minutos.*
- **Sub:** *Solicítalo con tu matrícula inmobiliaria y recíbelo por correo o WhatsApp. Rápido, seguro y sin filas.*
- **Reaseguros (siempre visibles):** pago seguro Wompi · entrega rápida · validez 30 días · soporte humano.
- **Disclaimer OBLIGATORIO (legal):** *"Servicio de gestión privado. No somos canal oficial de la Superintendencia de Notariado y Registro (SNR); facilitamos el trámite en tu nombre."*
- ⚠️ **Prohibido:** evocar Superintendencia, SNR, ".gov" o escudos oficiales (riesgo legal + de inducir a error).

## 4. Voz y tono

Español **colombiano**, claro, cercano y tranquilizador. Tutea. Directo, sin tecnicismos ni anglicismos. Vende **paz mental** ("tu propiedad, al día"), no un trámite. Profesional pero humano.

## 5. Logo — dirección creativa

- **Concepto:** escudo/sello + documento/folio, o un monograma **"C"** limpio. Debe transmitir **confianza registral + modernidad** (legal-tech, no notaría polvorienta).
- **Estilo:** geométrico, plano, minimalista. Una sola idea fuerte.
- **Color:** azul marca sobre blanco; versión monocroma (1 tinta) y negativa (blanco sobre azul).
- **Reglas:** legible a 24px y como favicon · funciona en el header azul del correo · espacio de respiro alrededor.
- **No:** escudos oficiales/gubernamentales, degradados recargados, más de 2 colores, clip-art de casas genérico.

## 6. Color (tokens)

| Token | Hex | Uso |
|---|---|---|
| `brand` | `#103A73` | Azul profundo. Marca, botones, header. Confianza. |
| `brand-600` | `#0D2F5E` | Hover del primario. |
| `accent` | `#0F7A52` | Verde "válido". Estados OK, **semáforo verde**, checks. |
| `risk-amber` | `#C77700` | **Semáforo amarillo** (precaución). |
| `risk-red` | `#C0392B` | **Semáforo rojo** (alerta: embargo/hipoteca). |
| `ink` | `#0D1B2A` | Texto principal. |
| `muted` | `#5B6B7F` | Texto secundario. |
| `line` | `#E7EDF5` | Bordes, divisores. |
| `bg` | `#F4F6FB` | Fondo de página. |
| `surface` | `#FFFFFF` | Tarjetas. |

**Estrategia:** neutros fríos + **azul** para acción/marca + **verde** solo para estado OK. Acento ≤ 10% de la pantalla. El azul es jerarquía, no decoración.

## 7. Tipografía

- **UI / texto:** **Inter** (o Geist). Limpia, moderna, altísima legibilidad. Pesos 400/500/600/700.
- **Números** (montos, matrícula, precios): **tabulares / monospace** para precisión y confianza.
- **Jerarquía** por escala + peso (ratio ≥ 1.25). Moneda siempre formateada (`$39.900`).

## 8. Componentes y principios de UI

- **Botón primario:** azul `brand`, texto blanco, radio 10–12px, sombra de marca `0 8px 20px -6px rgba(16,58,115,.5)`; hover `brand-600`; estados disabled/loading (spinner).
- **Tarjetas:** `surface` + borde `line` + radio 14–16px + sombra suave **azulada** (no negra). Sin tarjetas anidadas.
- **Inputs:** borde `line`, focus ring azul (`ring-4` translúcido). Labels semibold. Hints contextuales.
- **Estados:** loading, error (rojo suave + ícono, `role="alert"`), vacío (ícono + mensaje + acción). Nunca `alert()`.
- **Semáforo de riesgo:** componente estrella. Tres variantes (verde/ámbar/rojo) con resumen del CTL en lenguaje simple. Es el gancho de conversión y el diferenciador.
- **Señales de confianza** siempre presentes: SSL, "Pago seguro Wompi", validez 30 días, contador de certificados emitidos.
- **Mobile-first**, accesible (contraste AA, labels, focus visible, `prefers-reduced-motion`).
- **Prohibido (slop):** gradient text, glass por default, hero-métrica genérico, grids de cards idénticas, em-dashes en copy, modales como primer recurso.

## 9. SEO / GEO (resumen accionable)

*(Estrategia completa en `GEO-ESTRATEGIA-vs-legalcheck.md`.)*

**Keywords objetivo:** `certificado de tradición y libertad`, `certificado tradicion online`, `consultar matrícula inmobiliaria`, `cuánto cuesta certificado de tradición`, `cómo leer un certificado de tradición`, `qué es falsa tradición`, `cómo saber si una propiedad está embargada`.

**Contenido (donde legalcheck está vacío):**
- Pilar: **"Cómo leer un certificado de tradición y libertad (con ejemplo real anotado sección por sección)"** + plantilla descargable.
- Cluster de anotaciones: embargo, hipoteca, falsa tradición, patrimonio de familia, afectación a vivienda familiar, servidumbre, cancelación de hipoteca.
- **"Precio 2026: oficial $23.000 vs intermediarios"** (tabla, alerta de sobrecostos, fecha de actualización visible).
- FAQ central con **FAQPage schema + speakable**.

**GEO (visibilidad en IA — el flanco débil de legalcheck):**
- Publicar **`/llms.txt`** curado desde el día 1.
- robots.txt: permitir explícitamente GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
- **Schema JSON-LD** server-rendered: `Organization` + `LegalService` + **`Person`** (fundador/abogado) + **`Review`/`aggregateRating`** + `FAQPage` + `HowTo` + `BreadcrumbList`, con **`sameAs`** a 5–6 perfiles.
- **Construir entidad:** LinkedIn company colombiana + Google Business Profile + **Wikidata** + YouTube + reseñas (Google/Trustpilot).
- Sembrar **Reddit/Quora** ("cómo verificar si una propiedad está embargada") y 2–3 menciones en medios (Fincaraíz, Metrocuadrado).

**Framing ganador a repetir en todo el sitio:** *"Certificado oficial + te lo explicamos con semáforo de riesgo, en minutos."*

---

## 10. PROMPTS

### 10.1 — Logo (Ideogram / Midjourney / DALL·E)

```
Minimalist, modern logo for "Certitradición", a Colombian legal-tech service that
delivers official property certificates (Certificado de Tradición y Libertad) online.
Mark: a clean geometric combination of a shield/seal and a document/folio (or a refined
"C" monogram), conveying trust, official records, and speed. Flat vector, deep
institutional blue (#103A73) on white, no gradients, no government emblems. Must be
legible at favicon size. Include a clean modern sans-serif wordmark "Certitradición".
Style: trustworthy fintech + legal, professional, premium, simple. White background.
```
*Variantes a pedir: solo el ícono (favicon), horizontal (wordmark + ícono), negativo (blanco sobre azul), monocromo.*

### 10.2 — Frontend (v0.dev / Lovable / Claude / Cursor)

```
Construye el frontend de "Certitradición" (certitradicion.com): una web colombiana,
en español, que vende y emite Certificados de Tradición y Libertad en línea, compitiendo
contra legalcheck.com.co y buscando ganarles en confianza, velocidad y claridad.

Stack: Next.js (App Router) + Tailwind v4 + TypeScript. Mobile-first, accesible (AA).

MARCA (usa estos tokens):
- brand #103A73, accent verde #0F7A52, semáforo ámbar #C77700 / rojo #C0392B,
  ink #0D1B2A, muted #5B6B7F, line #E7EDF5, bg #F4F6FB, surface #FFFFFF.
- Tipografía Inter. Números tabulares. Botón primario azul con sombra de marca, radio 12px.
- Estética fintech-legal seria y confiable. Nada de glass/gradient-text/slop.

PÁGINAS:
1) Home/landing de conversión: header con logo + badge "Pago 100% seguro"; hero
   "Tu Certificado de Tradición y Libertad, oficial y vigente — en minutos"; 3 señales de
   confianza (entrega correo/WhatsApp, validez 30 días, pago Wompi cifrado); bloque
   "Cómo funciona" en 3 pasos; tarjeta de checkout sticky a la derecha con precio $39.900,
   formulario CORTO (Oficina de Registro [select], Matrícula inmobiliaria [solo números],
   Correo, WhatsApp opcional) y botón "Pagar $39.900" que va a Wompi; franja de reaseguro
   (SSL, Wompi, entrega rápida); disclaimer "no somos canal oficial de la SNR".
2) /estado: seguimiento del pedido con timeline (Pago → Confirmado → Generando → Enviado)
   y polling.
3) Sección/Página "Tu informe con semáforo de riesgo": explica el verde/amarillo/rojo
   (sin gravámenes / con precaución / con alerta) — diferenciador clave.
4) FAQ con FAQPage schema (vigencia 30 días, quién puede pedirlo, sin matrícula, tiempo,
   validar autenticidad).

SEO/GEO: metadatos es-CO, JSON-LD (Organization + LegalService + FAQPage + HowTo),
headings en formato pregunta con respuesta directa de 40–55 palabras debajo, y un
/llms.txt. Incluye un cluster de contenido informacional ("cómo leer un CTL", "qué es
falsa tradición", "precio oficial vs intermediarios").

Voz: español colombiano, claro, cercano, sin anglicismos. Vende tranquilidad. Tutea.
```

### 10.3 — Imagen OG / hero (DALL·E / Midjourney)

```
Clean, professional hero image for a Colombian property-certificate web service.
Abstract representation of a verified property document with a subtle green/amber/red
risk indicator, deep blue (#103A73) and white palette, soft shadows, modern fintech-legal
style, lots of negative space, no text. 1200x630, premium and trustworthy.
```

---

*Referencias: identidad y tokens validados en `web/` (la app actual) y en la plantilla de correo `email/ctl-template.mjs`. Estrategia competitiva en `GEO-ESTRATEGIA-vs-legalcheck.md`.*
