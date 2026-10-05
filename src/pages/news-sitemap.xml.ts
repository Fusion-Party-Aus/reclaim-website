import type { APIRoute } from 'astro'
import { getDocuments } from '../lib/sanity'

export const prerender = false

const base = 'https://vic.fusionparty.org.au'
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface NewsPost {
  title: string
  slug?: { current?: string }
  publishedAt?: string
  category?: string
}

export const GET: APIRoute = async () => {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000
  const posts = (await getDocuments<NewsPost>('blogPost'))
    .filter((post) =>
      post.slug?.current &&
      post.publishedAt &&
      ['news', 'analysis', 'policy', 'explainer'].includes(post.category || '') &&
      new Date(post.publishedAt).getTime() >= cutoff
    )
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())

  const urls = posts.map((post) => [
    '  <url>',
    `    <loc>${escapeXml(`${base}/blog/${post.slug!.current}`)}</loc>`,
    '    <news:news>',
    '      <news:publication>',
    '        <news:name>Fusion Party Victoria</news:name>',
    '        <news:language>en</news:language>',
    '      </news:publication>',
    `      <news:publication_date>${escapeXml(new Date(post.publishedAt!).toISOString())}</news:publication_date>`,
    `      <news:title>${escapeXml(post.title)}</news:title>`,
    '    </news:news>',
    '  </url>',
  ].join('\n'))

  return new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n'), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    },
  })
}
