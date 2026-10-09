import { sitemapResponse } from '../lib/sitemap'
import { DEPLOYMENT } from '../lib/deployment'
import type { APIRoute } from 'astro'
import { getPolicies } from '../lib/sanity'

export const prerender = false

export const GET: APIRoute = async () => {
  const documents = await getPolicies({ adoptedOnly: true })
  return sitemapResponse([
    ...documents.flatMap((policy) =>
      policy.slug?.current
        ? [
            {
              loc: `${DEPLOYMENT.siteUrl}/policies/${policy.slug.current}`,
              lastmod: policy._updatedAt || policy.publishedAt || policy._createdAt,
              changefreq: 'weekly' as const,
            },
          ]
        : []
    ),
  ])
}
