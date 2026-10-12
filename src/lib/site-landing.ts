import { getSiteBranding } from '../../config/site-branding.mjs'
import {
  getStaticBranchLandingContent,
  assertBranchLandingContent,
  type BranchLandingContent,
} from './branch-landing-content'
import { landingStyles, heroFolds, bannerFolds } from './branch-landing-design'
import { fusionMark } from './branch-landing-brand'
import { barlowLicense } from './branch-landing-font-license'
import wordmark from '../../public/fusion-wordmark.svg'
import type { LandingSite } from '../../config/sites.mjs'

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  )

/** These approved placeholders have no CMS, integration or offline-cache dependencies. */
export function createLandingResponse(
  site: LandingSite,
  url: URL,
  method = 'GET',
  content?: BranchLandingContent
): Response {
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
      "default-src 'none'; style-src 'unsafe-inline'; img-src data: https://images.unsplash.com; font-src data:; base-uri 'none'; frame-ancestors 'none'"
    )
    const resolvedContent = content ?? getStaticBranchLandingContent(site.siteId)
    assertBranchLandingContent(site.siteId, resolvedContent)
    const { base, photography: photo } = resolvedContent
    const branding = getSiteBranding(site.siteId)
    const split = base.heroSlogan.indexOf(', ')
    const heroHeading =
      split < 0
        ? escape(base.heroSlogan)
        : `${escape(base.heroSlogan.slice(0, split + 1))}<br> <span>${escape(base.heroSlogan.slice(split + 2))}</span>`
    const link = (key: keyof typeof base.links, label: string) =>
      `<a href="${escape(base.links[key])}">${label}</a>`
    body = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(site.landing.label)}</title><meta name="description" content="Meet ${escape(site.landing.label)}, explore Fusion’s shared values and find ways to participate nationally."><meta property="og:title" content="${escape(site.landing.label)}"><meta property="og:url" content="${site.canonicalOrigin}/"><link rel="canonical" href="${site.canonicalOrigin}/"><style>${landingStyles}
:root{--fusion-accent:${branding.accent};--fusion-accent-ink:${branding.accentInk};--fusion-accent-dark:${branding.accentDark};--fusion-accent-soft:${branding.accentSoft};--fusion-accent-display:${branding.accentDisplay}}</style><!-- ${barlowLicense.replaceAll('--', '—')} --></head><body class="public-editorial"><a class="skip" href="#main-content">Skip to content</a><header class="site-header home-shell"><a class="brand" href="#about" aria-label="${escape(site.landing.label)}">${fusionMark}<span class="brand-type"><img src="${escape(wordmark)}" alt="Fusion" width="120" height="37"><span>${escape(site.landing.state)}</span></span></a><nav aria-label="On this page"><a href="#values">Our values</a><a href="#get-involved">Get involved</a></nav></header><main id="main-content" class="fusion-home" data-base-version="${base.version}" data-content-owner="${base.ownerSiteId}"><header id="about" class="home-hero"><figure class="home-hero-photo"><img src="${escape(photo.src)}" alt="${escape(photo.alt)}" width="1800" height="1100" fetchpriority="high" style="object-position:${escape(photo.position)}"></figure>${heroFolds}<div class="home-shell"><div class="home-hero-copy"><h1>${heroHeading}</h1><p class="home-deck">${escape(base.missionHeading)}</p><div class="home-actions"><a class="home-button" href="#get-involved">Get involved</a><a class="home-button home-button-outline" href="#values">Explore our values</a></div></div></div></header><section class="home-section"><div class="home-shell mission"><h2>${escape(base.missionHeading)}</h2><div><p>${escape(base.introduction)}</p><p class="local-status">State policies and candidate information will be published here once approved.</p></div></div></section><section id="values" class="home-section home-section-tint"><div class="home-shell"><h2>Values we share</h2><p>These are Fusion’s National values. State policies will be published separately when approved.</p><dl class="values">${base.values.map((value) => `<div><dt><img class="value-photo" src="${escape(value.photography.src)}" alt="${escape(value.photography.alt)}" width="180" height="180" loading="lazy">${escape(value.name)}</dt><dd>${escape(value.description)}</dd><dd class="value-credit">Photo by <a href="${escape(value.photography.creditUrl)}">${escape(value.photography.photographer)} on Unsplash</a></dd></div>`).join('')}</dl><p>${link('values', 'Read our National values')} · ${link('policy', 'Explore National policies')}</p></div></section><section class="home-section"><div class="home-shell"><h2>Explore Fusion’s National policy</h2><p>These are National policy areas. State platforms will be published separately when approved.</p><ul class="policy-areas">${base.policyAreas.map((area) => `<li><img class="policy-photo" src="${escape(area.photography.src)}" alt="${escape(area.photography.alt)}" width="640" height="400" loading="lazy"><p class="policy-credit">Photo by <a href="${escape(area.photography.creditUrl)}">${escape(area.photography.photographer)} on Unsplash</a></p><h3>${escape(area.title)}</h3><p>${escape(area.description)}</p><a href="${escape(area.href)}">Read the National policy</a></li>`).join('')}</ul></div></section><section id="get-involved" class="home-section home-section-dark home-join-banner">${bannerFolds}<div class="home-shell"><h2>Help shape what comes next</h2><p>Join the party or offer your time through Fusion’s National website. The forms let you tell us where you live and how you want to participate.</p><div class="home-actions"><a class="home-button" href="${escape(base.links.join)}">Join Fusion nationally</a><a class="home-button home-button-outline" href="${escape(base.links.volunteer)}">Volunteer through Fusion nationally</a></div><p>${link('contact', 'Contact the National team')}</p></div></section></main><footer class="site-footer"><div class="home-shell"><p>Shared introduction and values from Fusion nationally. Local content is awaiting approval.</p><p>${link('privacy', 'National privacy policy')} · <a href="https://www.fusionparty.org.au/">Visit Fusion Party nationally</a></p><p class="photo-credit">${escape(photo.city)} photo by <a href="${escape(photo.creditUrl)}">${escape(photo.photographer)} on Unsplash</a>.</p></div></footer></body></html>`
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
