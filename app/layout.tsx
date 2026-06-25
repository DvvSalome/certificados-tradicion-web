import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Certitradición — Certificado de Tradición y Libertad en línea" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificado de Tradición y Libertad en línea | Certitradición",
    description:
      "Tu Certificado de Tradición y Libertad en minutos, por correo o WhatsApp. Pago seguro con Wompi.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
