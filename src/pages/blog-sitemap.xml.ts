import type { APIRoute } from 'astro'
import { getDocuments } from '../lib/sanity'

export const prerender = false

const base = 'https://vic.fusionparty.org.au'
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface BlogSitemapPost {
  slug?: { current?: string }
  publishedAt?: string
  _updatedAt?: string
}

export const GET: APIRoute = async () => {
  const posts = await getDocuments<BlogSitemapPost>('blogPost')
  const urls = posts
    .filter((post) => post.slug?.current)
    .map((post) => {
      const loc = `${base}/blog/${post.slug!.current}`
      const lastmod = post._updatedAt || post.publishedAt
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '',
        '  </url>',
      ].filter(Boolean).join('\n')
    })

  return new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${base}/blog</loc>`,
    '  </url>',
    ...urls,
    '</urlset>',
  ].join('\n'), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    },
  })
}
