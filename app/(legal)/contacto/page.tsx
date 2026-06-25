import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacta a Certitradición para soporte con tu Certificado de Tradición y Libertad.',
  alternates: { canonical: '/contacto' },
};

export default function Contacto() {
  return (
    <article>
      <h1>Contacto</h1>
      <p>¿Necesitas ayuda con tu Certificado de Tradición y Libertad o con un pago? Estamos para ayudarte.</p>

      <h2>Correo</h2>
      <p><a href="mailto:certificados@certitradicion.com">certificados@certitradicion.com</a> — respondemos lo antes posible. Si escribes por un pedido, incluye tu número de referencia.</p>

      <h2>Sobre Certitradición</h2>
      <p>Somos un servicio privado de gestión documental que tramita en línea el Certificado de Tradición y Libertad de inmuebles en Colombia. No formamos parte del Gobierno de Colombia ni de GOV.CO; actuamos como intermediarios para facilitar tu solicitud ante la autoridad competente.</p>

      <p><a href="/">← Volver al inicio</a></p>
    </article>
  );
}
