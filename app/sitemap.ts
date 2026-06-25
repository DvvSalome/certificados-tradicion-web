import type { MetadataRoute } from 'next'
import { CIUDADES } from '@/lib/ciudades'

const BASE_URL = 'https://certitradicion.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const ciudades: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/certificado-tradicion-libertad`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    ...CIUDADES.map((c) => ({
      url: `${BASE_URL}/certificado-tradicion-libertad/${c.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    ...ciudades,
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/verificar`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/como-leer-certificado`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/preguntas-frecuentes`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/precio`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
