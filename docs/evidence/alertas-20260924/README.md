# Alertas de Certitradición — 24 de septiembre de 2026

El aviso de venta mostraba `3890000` en el detalle porque el webhook de Wompi
enviaba centavos y el nodo de n8n los concatenaba sin formato. Equivale a
$38.900 COP. El cambio no modifica el importe cobrado ni el estado del pedido.

## Cambio

- El productor reutiliza `formatCOP` para título y detalle.
- `scripts/alert-email-format.js` es el contenido del nodo **Formatear** del
  workflow existente `BoP63y1fO1nM1NVl`.
- El renderer acepta las ventas anteriores con monto numérico en centavos y las
  nuevas con monto formateado. No cambia unidades de otros tipos de alerta.
- Usa tabla HTML con estilos inline, escape de contenido y hora de Bogotá.
- Conserva destinatario, remitente, credencial SMTP, conexiones y disparadores.

## Validación

```sh
node scripts/test-alert-email-format.mjs --preview
npx tsc --noEmit
git diff --check
```

Las tres comprobaciones pasaron. Revisión independiente sin bloqueos.
Preview con datos ficticios inspeccionado a 390 y 1280 px, sin desbordamiento.
La inspección de Chromium no acredita render en todos los clientes de correo.

## Publicación del renderer

El 24/09 a las 21:21 UTC se actualizó únicamente el nodo **Formatear** mediante
la API de n8n. La API instalada publica al actualizar un workflow activo.
Versión guardada y activa: `0f3a9e34-78a5-4ee4-9c96-d3805e5c407c`.
SHA-256 del código: `6da80e04ac1c57f823f6efee934cefd48970e98bc48e80cc2eda0de5392d91f3`.
La copia anterior se conserva fuera de Git para reversión; contiene referencias
operativas y no se adjunta a este informe.

La actualización no ejecutó el webhook ni envió correos. Modifica las alertas
futuras; no cambia el correo que ya estaba en la bandeja del destinatario.
El cambio del productor en Vercel requiere la publicación de este commit por
el flujo habitual del sitio. El renderer ya es compatible con ambos contratos.

## Aviso de asesor: circuito distinto

La venta usa n8n. El chat web del CRM usa `/api/internal/handoff-alert` y el
SMTP transaccional del CRM. Se identificó una solicitud del 23/09 a las 13:21
de Colombia: creó una notificación interna y el bot confirmó el aviso. No hay
registro durable que acredite la entrega del correo de esa solicitud.

El SMTP actual superó autenticación y aceptación del sobre (MAIL FROM/RCPT TO),
seguido de RSET, sin DATA ni correo enviado. Esto no demuestra entrega histórica
ni llegada a bandeja. Los logs del contenedor anterior ya no están disponibles.
No se modificaron credenciales, permisos, destinatarios ni configuración del CRM.
