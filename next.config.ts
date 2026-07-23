import type { NextConfig } from "next";

// Headers de seguridad (buenas señales técnicas para SEO/GEO y protección básica). Se omite CSP para no
// romper Wompi ni los scripts inline de Next; añadir CSP en report-only más adelante si se requiere.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // microphone: se DELEGA al iframe del chat del CRM (nota de voz del visitante). Con
  // `microphone=()` el navegador lo apaga para todo el documento y el allow="microphone"
  // del iframe no sirve: no se puede delegar un permiso que el padre no tiene.
  // Cámara y ubicación siguen apagadas por completo (nadie las usa).
  { key: "Permissions-Policy", value: 'camera=(), microphone=("https://crm.fourgsolutions.com"), geolocation=()' },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
