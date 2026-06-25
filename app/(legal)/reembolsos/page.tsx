import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Reembolsos',
  description: 'Política de reembolsos de Certitradición: cuándo aplica y cómo se procesa.',
  alternates: { canonical: '/reembolsos' },
};

export default function Reembolsos() {
  return (
    <article>
      <h1>Política de Reembolsos</h1>
      <p>Queremos que pagues con confianza. Esta política explica cuándo aplica un reembolso.</p>

      <h2>Reembolso automático</h2>
      <p>Si la matrícula que ingresaste <strong>no existe o no está disponible</strong> para expedición y por eso no podemos entregarte el certificado, te <strong>devolvemos el pago automáticamente</strong>. La devolución se procesa a través de Wompi y el tiempo en que se refleja depende de tu banco o medio de pago.</p>

      <h2>Cuándo NO aplica reembolso</h2>
      <ul>
        <li>Cuando el certificado <strong>ya fue generado y entregado</strong> a tu correo: el servicio se prestó y el documento ya está en tu poder.</li>
        <li>Cuando ingresaste una matrícula u oficina equivocada pero el certificado de esa matrícula sí se generó y entregó correctamente. Por eso, en el checkout verificamos y te mostramos la dirección del inmueble antes de cobrarte: revísala.</li>
      </ul>

      <h2>Cómo solicitar ayuda</h2>
      <p>Si tienes cualquier duda con tu pago o tu certificado, escríbenos a <a href="mailto:certificados@certitradicion.com">certificados@certitradicion.com</a> con tu número de referencia y te ayudamos.</p>

      <p style={{ fontSize: '12px', color: 'var(--muted-2)' }}>Última actualización: junio de 2026. Versión inicial; revísala con tu asesor legal.</p>
    </article>
  );
}
