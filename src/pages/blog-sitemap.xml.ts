import { sitemapResponse } from '../lib/sitemap'
import { DEPLOYMENT } from '../lib/deployment'
import type { APIRoute } from 'astro'
import { getDocuments } from '../lib/sanity'

export const prerender = false

interface BlogSitemapPost {
  slug?: { current?: string }
  publishedAt?: string
  _updatedAt?: string
}

export const GET: APIRoute = async () => {
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
