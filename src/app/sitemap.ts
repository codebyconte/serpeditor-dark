import { client } from '@/sanity/lib/client'
import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serpeditor.fr'

interface SitemapItem {
  href: string
  _updatedAt?: string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques publiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features/recherche-mots-cles`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/analyse-seo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/suivi-position-seo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/analyse-backlinks`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/analyse-mots-cles-concurrents`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/geo-seo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/outils-seo-gratuits`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/outils-seo-gratuits/audit-seo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Récupérer uniquement les articles de blog depuis Sanity
  // Les catégories ne sont pas indexées (noindex) donc pas dans le sitemap
  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    const posts = await client.fetch<SitemapItem[]>(
      `*[_type == "post" && status == "published" && !(seo.noIndex == true)]{
        "href": "/blog/" + slug.current,
        _updatedAt
      }`,
      {},
      {
        next: { revalidate: 3600 }, // Cache 1 heure
      }
    )

    dynamicPages = posts.map((item) => ({
      url: `${baseUrl}${item.href}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération du sitemap depuis Sanity:', error)
    // En cas d'erreur, on continue avec les pages statiques uniquement
  }

  // Combiner les pages statiques et dynamiques
  return [...staticPages, ...dynamicPages]
}
