import { sitemapResponse } from '../lib/sitemap'
import { DEPLOYMENT } from '../lib/deployment'
import type { APIRoute } from 'astro'
import { getResearchResources } from '../lib/sanity'

export const prerender = false

export const GET: APIRoute = async () => {
  const documents = await getResearchResources()
  return sitemapResponse([
    { loc: `${DEPLOYMENT.siteUrl}/research`, changefreq: 'weekly' as const },
    ...documents.flatMap((resource) =>
      resource.slug?.current
        ? [
            {
              loc: `${DEPLOYMENT.siteUrl}/research/${resource.slug.current}`,
              lastmod: resource._updatedAt || resource.publishedAt,
              changefreq: 'monthly' as const,
            },
          ]
        : []
    ),
  ])
}
