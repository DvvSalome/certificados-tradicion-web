import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de tratamiento de datos personales de Certitradición (Ley 1581 de 2012 — Habeas Data).',
  alternates: { canonical: '/privacidad' },
};

export default function Privacidad() {
  return (
    <article>
      <h1>Política de Privacidad y Tratamiento de Datos</h1>
      <p>En Certitradición protegemos tus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 (Habeas Data). Al usar nuestro servicio aceptas esta política.</p>

      <h2>Responsable</h2>
      <p>Certitradición, servicio privado de gestión documental con domicilio en Calle 80 B #42 D, Barranquilla, Atlántico, Colombia. Contacto y ejercicio de derechos: <a href="mailto:certificados@certitradicion.com">certificados@certitradicion.com</a> · WhatsApp +57 321 225 8245.</p>

      <h2>Qué datos tratamos</h2>
      <ul>
        <li>Matrícula inmobiliaria y oficina de registro del inmueble que consultas.</li>
        <li>Nombres, tipo y número de identificación, correo electrónico y teléfono/WhatsApp, para gestionar y entregar el certificado.</li>
        <li>El contenido del Certificado de Tradición y Libertad, que incluye datos de los propietarios del inmueble (que pueden ser terceros distintos de quien solicita).</li>
        <li>Datos del pago: procesados directamente por Wompi (pasarela de pagos). Certitradición no almacena los datos de tu tarjeta.</li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Gestionar ante la Superintendencia de Notariado y Registro (SNR) y entregar el Certificado de Tradición y Libertad solicitado.</li>
        <li>En el plan Express, generar un Estudio de Títulos: un análisis automatizado del certificado (propietarios, gravámenes, banderas de riesgo y un estimado referencial de valor).</li>
        <li>Enviarte el documento y comunicaciones relacionadas con tu pedido.</li>
        <li>Soporte y mejora del servicio.</li>
      </ul>

      <h2>Encargados y terceros que intervienen</h2>
      <p>No vendemos ni cedemos tus datos con fines comerciales. Para prestar el servicio intervienen únicamente estos encargados:</p>
      <ul>
        <li><strong>Wompi</strong> (Bancolombia) — procesamiento del pago.</li>
        <li><strong>Meta Platforms / WhatsApp</strong> — entrega del certificado por WhatsApp, si eliges ese canal.</li>
        <li><strong>Proveedor de correo (Hostinger)</strong> — envío del certificado por correo electrónico.</li>
        <li><strong>Plan Express — análisis con inteligencia artificial:</strong> el texto del certificado (que contiene datos de los propietarios) se envía a un proveedor de modelos de IA (a través de OpenRouter, que enruta a modelos como Google Gemini) exclusivamente para generar el Estudio de Títulos. No se usa para publicidad ni para entrenar modelos con tus datos.</li>
      </ul>
      <p>El tamizaje contra listas de prevención de lavado de activos (lista OFAC/SDN) del plan Express se realiza <strong>localmente</strong> en nuestros servidores: descargamos la lista pública y hacemos la comparación por nuestra cuenta, sin enviar datos personales a terceros para ese fin.</p>

      <h2>Transferencia internacional de datos</h2>
      <p>Algunos encargados (Meta/WhatsApp y los proveedores de IA del plan Express) operan servidores fuera de Colombia, principalmente en Estados Unidos. Al aceptar esta política y solicitar el servicio (en especial el plan Express), autorizas esa transferencia internacional, limitada a lo necesario para prestarte el servicio.</p>

      <h2>Conservación y eliminación</h2>
      <p>El archivo PDF de tu certificado se conserva de forma temporal (aproximadamente 48 horas) solo para poder reenviártelo por WhatsApp o correo, y luego se elimina de nuestros sistemas; el documento permanece disponible en el historial de la autoridad de registro. Los datos de contacto y de la orden se conservan el tiempo necesario para prestar el servicio y cumplir obligaciones legales y contables.</p>

      <h2>Tus derechos</h2>
      <p>Puedes conocer, actualizar, rectificar y suprimir tus datos, o revocar la autorización, escribiendo a <a href="mailto:certificados@certitradicion.com">certificados@certitradicion.com</a>. Atenderemos tu solicitud en los términos de la Ley 1581 de 2012.</p>

      <h2>Seguridad</h2>
      <p>Aplicamos medidas razonables de seguridad técnicas y administrativas para proteger tus datos frente a acceso no autorizado, pérdida o alteración.</p>

      <p style={{ fontSize: '12px', color: 'var(--muted-2)' }}>Última actualización: julio de 2026. Te recomendamos revisar este documento con tu asesor legal y complementarlo con los datos de identificación tributaria (NIT/razón social) del responsable.</p>
    </article>
  );
}
