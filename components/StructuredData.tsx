/**
 * StructuredData — JSON-LD (schema.org) server-rendered para Certitradición.
 *
 * LEGAL: Certitradición es un GESTOR/INTERMEDIARIO PRIVADO. NO somos canal
 * oficial de la Superintendencia de Notariado y Registro (SNR) ni una entidad
 * gubernamental. Por eso el grafo usa `Organization` / `Service` (gestor
 * privado) y nunca `GovernmentOrganization` ni tipos que insinúen oficialidad.
 *
 * Renderiza UN solo <script type="application/ld+json"> con un @graph que
 * agrupa: Organization, WebSite (+SearchAction), Service (+Offer), FAQPage,
 * BreadcrumbList y HowTo. Pensado para incrustarse desde el layout (la
 * integración la hace el orquestador, este archivo no se autoinyecta).
 */

import { PLANS } from '@/lib/config';

const SITE_URL = 'https://certitradicion.com';
// Precios reales (fuente única en lib/config) → el schema NUNCA queda desincronizado con la web.
const PRICE_BASICO = String(PLANS.basico.priceCop);
const PRICE_AVANZADO = String(PLANS.avanzado.priceCop);
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICE_ID = `${SITE_URL}/#service`;

const data = {
  '@context': 'https://schema.org',
  '@graph': [
    /* ── Organización / ProfessionalService (gestor privado, NO entidad oficial) ── */
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: 'Certitradición',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
      image: `${SITE_URL}/og-v3.jpg`,
      priceRange: '$',
      description:
        'Certitradición es un servicio privado de gestión que tramita en línea, en nombre del solicitante, el Certificado de Tradición y Libertad de inmuebles en Colombia. No somos canal oficial de la Superintendencia de Notariado y Registro (SNR).',
      // sameAs: perfiles oficiales de la marca (Google Business Profile, LinkedIn, YouTube, etc.).
      // Se agregan cuando existan las URLs REALES (un sameAs muerto resta confianza). Ver plan off-page.
      telephone: '+573212258245',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle 80 B #42 D',
        addressLocality: 'Barranquilla',
        addressRegion: 'Atlántico',
        postalCode: '080020',
        addressCountry: 'CO',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.9878,
        longitude: -74.7889,
      },
      areaServed: { '@type': 'Country', name: 'Colombia' },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+573212258245',
        email: 'certificados@certitradicion.com',
        areaServed: 'CO',
        availableLanguage: 'es',
      },
    },

    /* ── Sitio web (+ SearchAction) ──────────────────────────────────── */
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: 'Certitradición',
      inLanguage: 'es-CO',
      publisher: { '@id': ORG_ID },
      // (Sin SearchAction: no hay un buscador real que procese ?q= en el sitio.)
    },

    /* ── Servicio (+ Offer) ──────────────────────────────────────────── */
    {
      '@type': 'Service',
      '@id': SERVICE_ID,
      name: 'Gestión de Certificado de Tradición y Libertad en línea',
      serviceType: 'Gestión de Certificado de Tradición y Libertad',
      description:
        'Gestión en línea del Certificado de Tradición y Libertad (CTL) de inmuebles en Colombia: el usuario ingresa oficina de registro y matrícula inmobiliaria, paga de forma segura con Wompi y recibe el documento por correo electrónico o WhatsApp en minutos.',
      provider: { '@id': ORG_ID },
      areaServed: {
        '@type': 'Country',
        name: 'Colombia',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: SITE_URL,
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'COP',
        lowPrice: PRICE_BASICO,
        highPrice: PRICE_AVANZADO,
        offerCount: '3',
        availability: 'https://schema.org/InStock',
        url: SITE_URL,
        category: 'Trámite documental',
      },
    },

    /* ── Preguntas frecuentes (respuestas auto-contenidas, citables) ─── */
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué es el Certificado de Tradición y Libertad?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El Certificado de Tradición y Libertad es el documento que registra la historia jurídica de un inmueble en Colombia: propietarios, compraventas, hipotecas, embargos y demás anotaciones. Lo expide la Superintendencia de Notariado y Registro y sirve para verificar la situación legal de una propiedad antes de comprarla o arrendarla.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto tiempo es válido el certificado?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El Certificado de Tradición y Libertad tiene una vigencia de 30 días calendario desde su fecha de expedición. Pasado ese plazo, la mayoría de notarías, bancos y entidades exigen uno nuevo, ya que la información de un inmueble puede cambiar en cualquier momento por nuevas anotaciones registradas.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Quién puede solicitar el certificado?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cualquier persona puede solicitar el Certificado de Tradición y Libertad de un inmueble en Colombia; es un documento público y no se necesita ser el propietario. Basta con conocer la oficina de registro y el número de matrícula inmobiliaria del predio para tramitarlo a través de Certitradición.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto tarda la entrega del certificado?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tras confirmarse el pago, Certitradición gestiona y entrega el Certificado de Tradición y Libertad en minutos en la gran mayoría de los casos. El documento llega en formato PDF, listo para descargar e imprimir, sin necesidad de hacer filas ni desplazarse a una oficina de registro.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo se entrega el certificado?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El Certificado de Tradición y Libertad se entrega en formato PDF por correo electrónico y por WhatsApp al número que indiques al solicitarlo. Así puedes descargarlo, guardarlo e imprimirlo desde tu teléfono o computador, y reenviarlo fácilmente a notarías, bancos o asesores cuando lo necesites.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo validar la autenticidad del certificado?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cada Certificado de Tradición y Libertad incluye un código único de verificación emitido por la Superintendencia de Notariado y Registro. Puedes confirmar su autenticidad ingresando ese código en el portal oficial de la SNR, que mostrará los datos del inmueble y la fecha exacta de expedición del documento.',
          },
        },
      ],
    },

    /* ── Migas de pan (Inicio → Solicitar certificado) ───────────────── */
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Solicitar certificado',
          item: `${SITE_URL}/`,
        },
      ],
    },

    /* ── Cómo obtenerlo (3 pasos) ────────────────────────────────────── */
    {
      '@type': 'HowTo',
      '@id': `${SITE_URL}/#howto`,
      name: 'Cómo obtener tu Certificado de Tradición y Libertad en línea',
      description:
        'Solicita tu Certificado de Tradición y Libertad de un inmueble en Colombia en tres pasos: ingresa los datos del predio, paga de forma segura y recíbelo por correo o WhatsApp.',
      inLanguage: 'es-CO',
      totalTime: 'PT5M',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'COP',
        value: PRICE_BASICO,
      },
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Ingresa la oficina y la matrícula',
          text: 'Selecciona la oficina de registro correspondiente e ingresa el número de matrícula inmobiliaria del inmueble que quieres consultar.',
          url: `${SITE_URL}/#solicitar`,
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Paga de forma segura con Wompi',
          text: 'Realiza el pago único con tarjeta o PSE a través de Wompi. Tus datos viajan cifrados y no se almacena tu información de pago.',
          url: `${SITE_URL}/#solicitar`,
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Recíbelo por correo o WhatsApp',
          text: 'Una vez confirmado el pago, recibes tu Certificado de Tradición y Libertad en formato PDF por correo electrónico y por WhatsApp, en minutos.',
          url: `${SITE_URL}/#solicitar`,
        },
      ],
    },
  ],
};

// Schema condicional:
//  - 'global' (en el layout, TODAS las páginas): solo las ENTIDADES del sitio (Organization + WebSite).
//  - 'home'   (solo en la homepage): el contenido específico VISIBLE ahí (Service + FAQPage + HowTo +
//    BreadcrumbList). No inyectar FAQ/HowTo en páginas donde ese contenido no se muestra → Google lo marca
//    como spam (FAQ no visible). Las demás páginas (pilar, guías, nosotros) traen su propio schema.
export default function StructuredData({ variant = 'global' }: { variant?: 'global' | 'home' }) {
  const graph = data['@graph'] as { '@type': string | string[] }[];
  const isEntity = (n: { '@type': string | string[] }) => {
    const t = Array.isArray(n['@type']) ? n['@type'] : [n['@type']];
    return t.includes('Organization') || t.includes('WebSite');
  };
  const selected = variant === 'global' ? graph.filter(isEntity) : graph.filter((n) => !isEntity(n));
  const out = { '@context': data['@context'], '@graph': selected };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(out) }}
    />
  );
}
