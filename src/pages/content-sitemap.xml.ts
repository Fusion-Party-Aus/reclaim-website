import { sitemapResponse } from '../lib/sitemap'
import type { APIRoute } from 'astro'

export const prerender = false

interface Document {
  slug?: { current?: string }
  _updatedAt?: string
  publishedAt?: string
}

/** Live CMS routes cannot be discovered by Astro's build-time sitemap crawler. */
export const GET: APIRoute = async ({ locals }) => {
  const { content } = locals.siteContext
  const { getDocuments, getElectorates, getPages, getInvestigations } = content
  const investigationsEnabled = locals.siteContext.deployment.features.investigations
  const base = locals.siteContext.site.canonicalOrigin

  const [posts, faqs, electorates, pages, investigations] = await Promise.all([
    getDocuments<Document>('blogPost'),
    getDocuments<Document>('faq'),
    getElectorates(),
    getPages(),
    investigationsEnabled ? getInvestigations() : Promise.resolve([]),
  ])
  const entries = new Map<string, string | undefined>()
  for (const route of [
    '/',
    '/policies',
    '/vision',
    '/research',
    '/blog',
    '/faq',
    '/manifesto',
    '/electorates',
    '/past-candidates',
    '/contact',
    '/convince-your-friends',
  ])
    entries.set(route, undefined)
  if (investigationsEnabled) entries.set('/investigations', undefined)
  for (const [prefix, documents] of [
    ['blog', posts],
    ['faq', faqs],
    ['electorates', electorates],
    [
      'investigations',
      investigations.map((item) => ({
        slug: item.slug,
        publishedAt: item.publishedAt,
        _updatedAt: undefined,
      })),
    ],
  ] as const) {
    for (const doc of documents) {
      if (doc.slug?.current)
        entries.set(`/${prefix}/${doc.slug.current}`, doc._updatedAt || doc.publishedAt)
    }
  }
  for (const page of pages) {
    if (!page.slug?.current) continue
    const segments = [page.slug.current]
    let parent = page.parent
    while (parent?.slug?.current) {
      segments.unshift(parent.slug.current)
      parent = parent.parent
    }
    entries.set(`/${segments.join('/')}`, page._updatedAt)
  }
  return sitemapResponse(
    [...entries]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, lastmod]) => ({ loc: new URL(path, base).href, lastmod }))
  )
}
