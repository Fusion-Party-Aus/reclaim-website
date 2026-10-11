import { sitemapResponse } from '../lib/sitemap'
import type { APIRoute } from 'astro'

export const prerender = false

interface BlogSitemapPost {
  slug?: { current?: string }
  publishedAt?: string
  _updatedAt?: string
}

export const GET: APIRoute = async ({ locals }) => {
  const { deployment: DEPLOYMENT, content } = locals.siteContext
  const { getDocuments } = content

  const documents = await getDocuments<BlogSitemapPost>('blogPost')
  return sitemapResponse([
    { loc: `${DEPLOYMENT.siteUrl}/blog` },
    ...documents.flatMap((post) =>
      post.slug?.current
        ? [
            {
              loc: `${DEPLOYMENT.siteUrl}/blog/${post.slug.current}`,
              lastmod: post._updatedAt || post.publishedAt,
            },
          ]
        : []
    ),
  ])
}
