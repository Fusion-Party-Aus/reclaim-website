interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: 'weekly' | 'monthly'
}

/** Serialize routable entries without allowing one malformed CMS date to fail the feed. */
export function sitemapResponse(entries: Iterable<SitemapEntry>): Response {
  const escapeXml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const urls = Array.from(entries, ({ loc, lastmod, changefreq }) => {
    const date = lastmod ? new Date(lastmod) : null
    const timestamp =
      date && !Number.isNaN(date.getTime()) ? `<lastmod>${date.toISOString()}</lastmod>` : ''
    return `<url><loc>${escapeXml(loc)}</loc>${timestamp}${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}</url>`
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
