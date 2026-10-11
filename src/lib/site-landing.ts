import { getBranchBaseContent } from '../../config/shared-branch-base.mjs'
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
    const base = getBranchBaseContent(site.siteId)
    const link = (key: keyof typeof base.links, label: string) =>
      `<a href="${escape(base.links[key])}">${label}</a>`
    body = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(site.landing.label)}</title><meta name="description" content="Meet ${escape(site.landing.label)}, explore Fusion’s shared values and find ways to participate nationally."><meta property="og:title" content="${escape(site.landing.label)}"><meta property="og:url" content="${site.canonicalOrigin}/"><link rel="canonical" href="${site.canonicalOrigin}/"><style>
    *{box-sizing:border-box}body{margin:0;background:#f6f3e9;color:#171717;font-family:system-ui,sans-serif}header,main,footer{max-width:76rem;margin:auto;padding:1.5rem}header{border-bottom:2px solid;display:flex;gap:1rem;flex-wrap:wrap;justify-content:space-between}nav{display:flex;gap:1.25rem;flex-wrap:wrap}h1{font-size:clamp(2.5rem,7vw,6rem);line-height:1.02;letter-spacing:-.04em;overflow-wrap:break-word;max-width:15ch;margin:2rem 0}h2{font-size:clamp(1.8rem,4vw,3rem);line-height:1.1}p,dd{font-size:1.125rem;line-height:1.65;max-width:65ch}section{padding:2.5rem 0;border-top:2px solid}a{color:inherit;text-underline-offset:.25em}a:hover{text-decoration-thickness:3px}a:focus-visible{outline:3px solid #9b0756;outline-offset:5px}.intro{font-size:clamp(1.2rem,2vw,1.5rem)}.status{border-left:4px solid;padding-left:1rem}dl{display:grid;grid-template-columns:1fr 1fr;gap:2rem 3rem}dt{font-size:1.4rem;font-weight:700}dd{margin:.5rem 0 0}.actions{display:flex;gap:1rem;flex-wrap:wrap}.actions a{padding:1rem 1.25rem;border:2px solid;font-weight:700}.actions a:first-child{background:#171717;color:#f6f3e9}footer{border-top:2px solid;padding-block:2rem}footer p{font-size:1rem}@media(max-width:42rem){dl{grid-template-columns:1fr}header,main,footer{padding-inline:1.25rem}.actions a{width:100%}}
    </style></head><body><header><a href="#about">Fusion Party</a><nav aria-label="On this page"><a href="#values">Our values</a><a href="#get-involved">Get involved</a></nav></header><main data-base-version="${base.version}" data-content-owner="${base.ownerSiteId}"><div id="about"><h1>${escape(site.landing.label)}</h1><p class="intro">${escape(base.introduction)}</p><p class="status">Our ${escape(site.landing.state)} website content is being prepared. State and territory policy and candidate information is not yet published on this website.</p></div><section id="values"><h2>Values we share</h2><p>These are Fusion’s National values. State policies will be published separately when approved.</p><dl>${base.values.map((value) => `<div><dt>${escape(value.name)}</dt><dd>${escape(value.description)}</dd></div>`).join('')}</dl><p>${link('values', 'Read our National values')} · ${link('policy', 'Explore National policies')}</p></section><section id="get-involved"><h2>Help shape what comes next</h2><p>Join the party or offer your time through Fusion’s National website. The forms let you tell us where you live and how you want to participate.</p><div class="actions">${link('join', 'Join Fusion nationally')}${link('volunteer', 'Volunteer through Fusion nationally')}</div><p>${link('contact', 'Contact the National team')}</p></section></main><footer><p>Shared introduction and values from Fusion nationally. Local content is awaiting approval.</p><p>${link('privacy', 'National privacy policy')} · <a href="https://www.fusionparty.org.au/">Visit Fusion Party nationally</a></p></footer></body></html>`
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
