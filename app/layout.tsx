import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import CrmChat from "@/components/CrmChat";

// Microsoft Clarity (heatmaps + grabaciones de sesión). Project ID público; solo en producción.
const CLARITY_ID = "xeefxjms0y";

// Google Tag Manager: contenedor desde el que se administran GA4 y la conversión de Google Ads
// sin volver a tocar el código ni redesplegar. La compra se comunica con el evento `purchase`
// que EstadoView empuja al dataLayer al confirmarse el pago.
const GTM_ID = "GTM-M6PHSS5Z";

// Meta Pixel: instalado DIRECTO en código (no vía GTM) porque el Purchase lleva eventID
// (la referencia CTL) para deduplicar contra la CAPI server-side cuando se encienda.
// OJO: NO agregar el pixel también dentro de GTM o Meta cuenta los eventos DOBLE.
const META_PIXEL_ID = "1747057343316637";

// Google Ads: se activa cuando definas NEXT_PUBLIC_GADS_ID (AW-XXXXXXXXX) en Vercel. Sin la env, no
// carga nada. La conversión se dispara en /estado al confirmarse el pago (ver EstadoView).
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://certitradicion.com"),
  title: {
    default: "Certificado de Tradición y Libertad en línea | Certitradición",
    template: "%s | Certitradición",
  },
  description:
    "Solicita tu Certificado de Tradición y Libertad en línea y recíbelo en minutos por correo o WhatsApp. Pago seguro con Wompi. Documento en PDF con validez de 30 días.",
  keywords: [
    "certificado de tradición y libertad",
    "certificado de tradición",
    "certificado de tradición en línea",
    "certificado de libertad y tradición",
    "matrícula inmobiliaria",
    "certificado de tradición Colombia",
  ],
  alternates: { canonical: "/" },
  applicationName: "Certitradición",
  authors: [{ name: "Certitradición" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://certitradicion.com",
    siteName: "Certitradición",
    title: "Certificado de Tradición y Libertad en línea | Certitradición",
    description:
      "Tu Certificado de Tradición y Libertad en minutos, por correo o WhatsApp. Pago seguro con Wompi. Validez de 30 días.",
    images: [{ url: "/og-v3.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "Certitradición — Certificado de Tradición y Libertad en línea" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificado de Tradición y Libertad en línea | Certitradición",
    description:
      "Tu Certificado de Tradición y Libertad en minutos, por correo o WhatsApp. Pago seguro con Wompi.",
    images: ["/og-v3.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        {/* GTM (noscript): respaldo cuando el navegador bloquea JavaScript. Va primero en el body. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Meta Pixel (noscript): respaldo sin JavaScript. */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <StructuredData />
        {children}
        <CrmChat />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {process.env.NODE_ENV === "production" && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
          </Script>
        )}
        {GADS_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`} strategy="afterInteractive" />
            <Script id="gads-base" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GADS_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
