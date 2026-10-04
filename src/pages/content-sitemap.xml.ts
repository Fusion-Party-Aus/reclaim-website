import type { APIRoute } from 'astro'
import { getDocuments, getElectorates, getArchivedElectorates, getPages } from '../lib/sanity'

export const prerender = false

const base = 'https://vic.fusionparty.org.au'
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface Document {
  slug?: { current?: string }
  _updatedAt?: string
  publishedAt?: string
}

/** Live CMS routes cannot be discovered by Astro's build-time sitemap crawler. */
export const GET: APIRoute = async () => {
  const [posts, faqs, electorates, archived, pages] = await Promise.all([
    getDocuments<Document>('blogPost'),
    getDocuments<Document>('faq'),
    getElectorates(),
    getArchivedElectorates(),
    getPages(),
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
  for (const [prefix, documents] of [
    ['blog', posts],
    ['faq', faqs],
    ['electorates', [...electorates, ...archived]],
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
  const urls = [...entries]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, updated]) => {
      const timestamp = updated ? new Date(updated) : null
      const lastmod =
        timestamp && !Number.isNaN(timestamp.getTime())
          ? `<lastmod>${timestamp.toISOString()}</lastmod>`
          : ''
      return `<url><loc>${escapeXml(new URL(path, base).href)}</loc>${lastmod}</url>`
    })
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=900',
      },
    }
  )
}
