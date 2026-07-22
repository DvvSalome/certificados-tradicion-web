// Contenido compartido entre la home y las páginas /precio y /preguntas-frecuentes
// (sitelinks reales: antes eran solo anclas de la home).

export const COMPARISON = [
  { feature: 'Entrega', official: 'Según disponibilidad del portal', us: 'En minutos, garantizada' },
  { feature: 'Canales de envío', official: 'Descarga en el portal', us: 'Correo electrónico y WhatsApp' },
  { feature: 'Soporte y acompañamiento', official: 'Autogestión, sin asesoría', us: 'Soporte humano durante el trámite' },
  { feature: 'Pago', official: 'Pasarela oficial', us: 'Pago seguro con Wompi (tarjeta/PSE)' },
  { feature: 'Ayuda si no conoces la matrícula', official: 'No incluida', us: 'Te ayudamos a ubicarla' },
];

export const FAQS = [
  {
    q: '¿Qué es el Certificado de Tradición y Libertad?',
    a: 'El Certificado de Tradición y Libertad (CTL) es el documento oficial que resume la historia jurídica de un inmueble en Colombia. Lo expide la Superintendencia de Notariado y Registro (SNR) a partir del folio de matrícula inmobiliaria y muestra propietarios, hipotecas, embargos y demás anotaciones registradas.',
    extra: ['En la práctica funciona como la "hoja de vida" del predio: cada acto jurídico que afecta la propiedad (compraventas, gravámenes, medidas cautelares) queda registrado en él de forma cronológica mediante anotaciones numeradas.'],
  },
  {
    q: '¿Para qué sirve el Certificado de Tradición y Libertad?',
    a: 'Sirve para conocer quién es el dueño real de un inmueble y si tiene cargas que limiten su venta o uso. Es indispensable antes de comprar, vender, hipotecar o arrendar, y suele exigirse en trámites bancarios, notariales, sucesiones y procesos judiciales para verificar la situación jurídica del predio.',
    extra: ['Cualquier comprador prudente lo revisa para confirmar que el inmueble esté libre de hipotecas, embargos o limitaciones antes de firmar una promesa de compraventa o entregar dinero.'],
  },
  {
    q: '¿Cuál es la vigencia del Certificado de Tradición y Libertad?',
    a: 'El Certificado de Tradición y Libertad tiene una vigencia de 30 días calendario contados desde su fecha de expedición, según los términos de la Superintendencia de Notariado y Registro. Pasado ese plazo, bancos y notarías suelen exigir uno actualizado, porque la situación del inmueble puede cambiar con nuevas anotaciones.',
  },
  {
    q: '¿Quién puede solicitar el Certificado de Tradición y Libertad?',
    a: 'Cualquier persona puede solicitarlo: es un documento público y no se requiere ser el propietario del inmueble ni demostrar interés legítimo. Basta con conocer el folio de matrícula inmobiliaria, o la oficina de registro y los datos del predio, para pedirlo y obtenerlo de forma legal.',
  },
  {
    q: '¿Cómo lo pido si no conozco la matrícula inmobiliaria?',
    a: 'Si no tienes la matrícula, puedes ubicarla con la dirección del inmueble o el número predial en la oficina de registro correspondiente a la ciudad o municipio donde está ubicado. En nuestro formulario seleccionas la oficina de registro y, si lo necesitas, te ayudamos a identificar el folio antes de continuar.',
  },
  {
    q: '¿Cuánto tarda la entrega del certificado?',
    a: 'La entrega es en minutos. Una vez confirmado el pago, gestionamos la expedición electrónica y te enviamos el Certificado de Tradición y Libertad en formato PDF, normalmente en pocos minutos.',
  },
  {
    q: '¿Cómo se entrega el Certificado de Tradición y Libertad?',
    a: 'El certificado se entrega en formato PDF por correo electrónico y por WhatsApp, listo para descargar, guardar o imprimir.',
  },
  {
    q: '¿Cómo validar la autenticidad del certificado?',
    a: 'Cada Certificado de Tradición y Libertad incluye un código de verificación expedido por la Superintendencia de Notariado y Registro. Con ese código puedes confirmar la autenticidad del documento directamente en el portal oficial de la SNR (supernotariado.gov.co).',
  },
];
