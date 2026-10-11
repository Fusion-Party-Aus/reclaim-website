/** Real local HTTP confirmation; start Astro in production host-resolution mode.
 * node scripts/qa/check-state-landings.mjs http://127.0.0.1:4322
 * Vite local host allowlist: __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.fusionparty.org.au
 * No CMS queries, writes, screenshots or deploy operations.
 */
import assert from 'node:assert/strict'
import http from 'node:http'
import { resolveSite } from '../../config/sites.mjs'

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
for (const siteId of ['nsw', 'sa', 'nt', 'act']) {
  const host = `${siteId}.fusionparty.org.au`
  const site = resolveSite(`https://${host}`)
  assert.equal(site.kind, 'landing')
  assert.equal(site.cms, undefined)
  const root = await request(host, '/')
  assert.equal(root.status, 200, `${siteId} root`)
  assert.ok(root.body.includes(site.landing.label))
  assert.ok(root.body.includes(`href="${site.canonicalOrigin}/"`))
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
  console.log(
    `PASS: ${siteId} CMS-free landing, canonical, HEAD, 404 routes, 405 writes and root-only discovery`
  )
}
for (const [id, dataset] of [
  ['vic', 'production'],
  ['qld', 'qld'],
]) {
  assert.equal(resolveSite(`https://${id}.fusionparty.org.au`).cms.dataset, dataset)
}
console.log(
  'PASS: VIC/QLD content source resolution unchanged; no CMS reads were performed by this runner.'
)
