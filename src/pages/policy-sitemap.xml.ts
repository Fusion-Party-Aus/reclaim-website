import type { APIRoute } from 'astro'
import { getPolicies } from '../lib/sanity'

export const prerender = false

const base = 'https://vic.fusionparty.org.au'

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const GET: APIRoute = async () => {
  const policies = await getPolicies()
  const urls = policies
    .filter((policy) => policy.slug?.current)
    .map((policy) => {
      const loc = `${base}/policies/${policy.slug.current}`
      const lastmod = policy._updatedAt || policy.publishedAt || policy._createdAt
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '',
        '    <changefreq>weekly</changefreq>',
        '  </url>',
      ].filter(Boolean).join('\n')
    })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    },
  })
}
