import { sitemapResponse } from '../lib/sitemap'
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ locals }) => {
  const { deployment: DEPLOYMENT, content } = locals.siteContext
  const { getResearchResources } = content

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
