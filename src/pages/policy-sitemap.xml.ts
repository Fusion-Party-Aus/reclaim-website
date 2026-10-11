import { sitemapResponse } from '../lib/sitemap'
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ locals }) => {
  const { deployment: DEPLOYMENT, content } = locals.siteContext
  const { getPolicies } = content

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
