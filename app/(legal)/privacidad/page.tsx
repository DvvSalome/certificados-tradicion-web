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
      <p>Certitradición — servicio privado de gestión documental. Contacto y ejercicio de derechos: <a href="mailto:certificados@certitradicion.com">certificados@certitradicion.com</a>.</p>

      <h2>Qué datos tratamos</h2>
      <ul>
        <li>Matrícula inmobiliaria y oficina de registro del inmueble que consultas.</li>
        <li>Correo electrónico y, opcionalmente, número de WhatsApp, para entregarte el certificado.</li>
        <li>Datos del pago: son procesados directamente por Wompi (pasarela de pagos). Certitradición no almacena los datos de tu tarjeta.</li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Gestionar y entregar el Certificado de Tradición y Libertad solicitado.</li>
        <li>Enviarte el documento y comunicaciones relacionadas con tu pedido.</li>
        <li>Soporte y mejora del servicio.</li>
      </ul>

      <h2>Con quién se comparten</h2>
      <p>No vendemos ni cedemos tus datos. Solo se comparten con el proveedor de pagos (Wompi) y en lo estrictamente necesario para tramitar el certificado ante la autoridad competente. No compartimos tu información con terceros para fines comerciales.</p>

      <h2>Tus derechos</h2>
      <p>Puedes conocer, actualizar, rectificar y suprimir tus datos, o revocar la autorización, escribiendo a <a href="mailto:certificados@certitradicion.com">certificados@certitradicion.com</a>. Atenderemos tu solicitud en los términos de ley.</p>

      <h2>Seguridad y conservación</h2>
      <p>Aplicamos medidas razonables de seguridad y conservamos los datos solo el tiempo necesario para prestar el servicio y cumplir obligaciones legales.</p>

      <p style={{ fontSize: '12px', color: 'var(--muted-2)' }}>Última actualización: junio de 2026. Este documento es una versión inicial; te recomendamos revisarlo con tu asesor legal.</p>
    </article>
  );
}
