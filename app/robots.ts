import type { MetadataRoute } from 'next'

const BASE_URL = 'https://certitradicion.com'

// Rutas privadas/transaccionales que no deben rastrearse ni indexarse.
const DISALLOW = ['/estado', '/admin', '/api']

// Crawlers de IA que permitimos explícitamente para máxima citabilidad GEO.
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
