/** Real local HTTP confirmation; start Astro in production host-resolution mode.
 * node scripts/qa/check-state-landings.mjs http://127.0.0.1:4322
 * Vite local host allowlist: __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.fusionparty.org.au
 * No CMS queries, writes, screenshots or deploy operations.
 */
import assert from 'node:assert/strict'
import { log } from 'node:console'
import process from 'node:process'
import { URL } from 'node:url'
import http from 'node:http'
import { resolveSite, siteRegistry } from '../../config/sites.mjs'
import { sharedBranchBaseContent } from '../../config/shared-branch-base.mjs'
import { getSiteBranding } from '../../config/site-branding.mjs'
import { branchCityPhotography } from '../../config/branch-city-photography.mjs'

const server = new URL(process.argv[2] || 'http://127.0.0.1:4322')
assert.equal(server.protocol, 'http:')
assert.ok(['127.0.0.1', 'localhost'].includes(server.hostname))
function request(host, pathname, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(
      new URL(pathname, server),
      { method, headers: { Host: `${host}:${server.port || 80}` } },
      (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          body += chunk
        })
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }))
      }
    )
    req.setTimeout(120000, () => req.destroy(new Error(`Timed out: ${host}${pathname}`)))
    req.on('error', reject)
    req.end()
  })
}
for (const siteId of ['nsw', 'sa', 'nt', 'act', 'tas', 'wa', 'qld']) {
  const host = `${siteId}.fusionparty.org.au`
  const site = resolveSite(`https://${host}`)
  assert.equal(site.kind, 'landing')
  assert.equal(site.cms, undefined)
  const root = await request(host, '/')
  assert.equal(root.status, 200, `${siteId} root`)
  assert.ok(root.body.includes(site.landing.label))
  assert.ok(root.body.includes(`href="${site.canonicalOrigin}/"`))
  assert.ok(root.body.includes(sharedBranchBaseContent.missionHeading), `${siteId} shared mission`)
  assert.ok(
    root.body.includes(sharedBranchBaseContent.introduction),
    `${siteId} shared introduction`
  )
  assert.ok(
    root.body.includes(branchCityPhotography[siteId].src.replaceAll('&', '&amp;')),
    `${siteId} own city image`
  )
  assert.ok(
    root.body.includes(`--fusion-accent:${getSiteBranding(siteId).accent}`),
    `${siteId} approved accent`
  )
  assert.equal(
    (root.body.match(/class="value-photo"/g) || []).length,
    6,
    `${siteId} value photographs`
  )
  assert.ok(root.body.includes('class="home-mobile-ribbons"'), `${siteId} mobile fold`)
  assert.ok(root.body.includes('class="home-ribbons"'), `${siteId} incumbent folds`)
  assert.ok(root.body.includes('data:font/woff2'), `${siteId} embedded fonts`)
  for (const area of sharedBranchBaseContent.policyAreas)
    assert.ok(root.body.includes(area.href), `${siteId} National policy link`)
  assert.equal((root.body.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1)
  assert.ok(!/api\.sanity\.io|cdn\.sanity\.io/.test(root.body))
  const head = await request(host, '/', 'HEAD')
  assert.equal(head.status, 200)
  assert.equal(head.body, '')
  assert.equal(head.headers['content-type'], root.headers['content-type'])
  for (const path of [
    '/policies',
    '/research',
    '/contact',
    '/api/policies.json',
    '/site.webmanifest',
    '/sw.js',
  ]) {
    const response = await request(host, path)
    assert.equal(response.status, 404, `${siteId}${path}`)
    assert.match(response.headers['cache-control'] || '', /no-store/)
  }
  const post = await request(host, '/', 'POST')
  assert.equal(post.status, 405)
  assert.equal(post.headers.allow, 'GET, HEAD')
  const robots = await request(host, '/robots.txt')
  assert.equal(robots.status, 200)
  assert.ok(robots.body.includes(`Sitemap: ${site.canonicalOrigin}/sitemap.xml`))
  const sitemap = await request(host, '/sitemap.xml')
  assert.equal(sitemap.status, 200)
  assert.equal((sitemap.body.match(/<loc>/g) || []).length, 1)
  assert.ok(sitemap.body.includes(`<loc>${site.canonicalOrigin}/</loc>`))
  log(
    `PASS: ${siteId} CMS-free landing, canonical, HEAD, 404 routes, 405 writes and root-only discovery`
  )
}
for (const [id, dataset] of [
  ['vic', 'production'],
  ['qld', 'qld'],
]) {
  const contentSite =
    id === 'qld' ? siteRegistry.qld : resolveSite(`https://${id}.fusionparty.org.au`)
  assert.equal(contentSite.cms.dataset, dataset)
}
log(
  'PASS: VIC content resolution and legacy QLD rollback source unchanged; no CMS reads were performed by this runner.'
)
