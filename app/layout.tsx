import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import WhatsAppWidget from "@/components/WhatsAppWidget";

// Microsoft Clarity (heatmaps + grabaciones de sesión). Project ID público; solo en producción.
const CLARITY_ID = "xeefxjms0y";

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
        <StructuredData />
        {children}
        <WhatsAppWidget />
        {process.env.NODE_ENV === "production" && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
