import type { APIRoute } from 'astro'
export const prerender = false
export const GET: APIRoute = ({ locals }) => {
  const origin = locals.siteContext.site.canonicalOrigin
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['sitemap-0.xml', 'content-sitemap.xml', 'policy-sitemap.xml', 'research-sitemap.xml', 'blog-sitemap.xml', 'news-sitemap.xml'].map((path) => `<sitemap><loc>${origin}/${path}</loc></sitemap>`).join('')}</sitemapindex>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=900',
      },
    }
  )
}
