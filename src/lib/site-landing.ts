import type { LandingSite } from '../../config/sites.mjs'

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  )

/** These approved placeholders have no CMS, integration or offline-cache dependencies. */
export function createLandingResponse(site: LandingSite, url: URL, method = 'GET'): Response {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
  })
  let status = 200
  let body: string
  if (!['GET', 'HEAD'].includes(method)) {
    headers.set('Allow', 'GET, HEAD')
    return new Response('Method not allowed', { status: 405, headers })
  }
  if (url.pathname === '/') {
    headers.set('Content-Type', 'text/html; charset=utf-8')
    headers.set(
      'Content-Security-Policy',
      "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"
    )
    body = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(site.landing.label)}</title><meta name="description" content="${escape(site.landing.label)}. State website content is being prepared."><link rel="canonical" href="${site.canonicalOrigin}/"><style>body{margin:0;background:#f6f3e9;color:#171717;font-family:system-ui,sans-serif}main{max-width:52rem;margin:clamp(2rem,10vw,8rem) auto;padding:1.5rem}h1{font-size:clamp(2rem,6vw,4.5rem);line-height:1.05;overflow-wrap:break-word}p{font-size:1.125rem;line-height:1.6;max-width:40rem}a{color:inherit;text-underline-offset:.25em}a:focus-visible{outline:3px solid currentColor;outline-offset:5px}</style></head><body><main><p>Fusion Party</p><h1>${escape(site.landing.label)}</h1><p>Our ${escape(site.landing.state)} website content is being prepared.</p><p><a href="https://fusionparty.org.au/">Visit Fusion Party nationally</a></p></main></body></html>`
  } else if (url.pathname === '/robots.txt') {
    body = `User-agent: *\nAllow: /$\nDisallow: /\nSitemap: ${site.canonicalOrigin}/sitemap.xml\n`
  } else if (url.pathname === '/sitemap.xml') {
    headers.set('Content-Type', 'application/xml; charset=utf-8')
    body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.canonicalOrigin}/</loc></url></urlset>`
  } else {
    status = 404
    body = 'Page not found'
  }
  headers.set('X-Content-Type-Options', 'nosniff')
  return new Response(method === 'HEAD' ? null : body, { status, headers })
}
