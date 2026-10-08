import { DEPLOYMENT } from '../lib/deployment'
import type { APIRoute } from 'astro'
import { getResearchResources } from '../lib/sanity'

export const prerender = false

const base = DEPLOYMENT.siteUrl
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const GET: APIRoute = async () => {
  const resources = await getResearchResources()
  const urls = resources
    .filter((resource) => resource.slug?.current)
    .map((resource) => {
      const loc = `${base}/research/${resource.slug.current}`
      const lastmod = resource._updatedAt || resource.publishedAt
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '',
        '    <changefreq>monthly</changefreq>',
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <url>',
      `    <loc>${base}/research</loc>`,
      '    <changefreq>weekly</changefreq>',
      '  </url>',
      ...urls,
      '</urlset>',
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=900',
      },
    }
  )
}
