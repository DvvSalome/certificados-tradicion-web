import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones del servicio de gestión de Certitradición.',
  alternates: { canonical: '/terminos' },
};

export default function Terminos() {
  return (
    <article>
      <h1>Términos y Condiciones</h1>
      <p>Estos términos regulan el uso de Certitradición. Al solicitar y pagar, los aceptas.</p>

      <h2>Qué es Certitradición</h2>
      <p>Certitradición es un <strong>servicio privado de gestión documental</strong>. No formamos parte del Gobierno de Colombia ni de GOV.CO ni de la Superintendencia de Notariado y Registro (SNR); actuamos como <strong>intermediarios</strong> que facilitan la solicitud del Certificado de Tradición y Libertad ante la autoridad competente, en nombre del usuario.</p>

      <h2>El servicio</h2>
      <ul>
        <li>Gestionamos en línea la obtención del Certificado de Tradición y Libertad del inmueble que indiques mediante su matrícula inmobiliaria y oficina de registro.</li>
        <li>El documento se entrega en formato PDF, a tu correo electrónico (y opcionalmente WhatsApp), normalmente en minutos.</li>
        <li>El certificado tiene la validez que define la autoridad competente (en general, 30 días desde su expedición).</li>
      </ul>

      <h2>Precio y pago</h2>
      <p>El servicio de gestión tiene un costo de $39.900 COP, que incluye la generación en línea, la entrega inmediata y el soporte. El pago se realiza de forma segura a través de Wompi. La tarifa oficial del Estado por el certificado es definida por la SNR de forma independiente.</p>

      <h2>Responsabilidad</h2>
      <p>La información del certificado proviene del registro oficial; Certitradición gestiona y entrega el documento, pero no genera ni modifica su contenido. Para que la solicitud proceda, la matrícula debe existir y estar disponible para expedición.</p>

      <h2>Reembolsos</h2>
      <p>Si la matrícula no existe o no está disponible y no podemos entregar el certificado, te devolvemos el pago. Consulta los detalles en nuestra <a href="/reembolsos">Política de Reembolsos</a>.</p>

      <p style={{ fontSize: '12px', color: 'var(--muted-2)' }}>Última actualización: junio de 2026. Versión inicial; revísala con tu asesor legal.</p>
    </article>
  );
}
