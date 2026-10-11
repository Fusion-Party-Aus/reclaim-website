/**
 * Same-server, real-content site isolation regression.
 * Start: __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.fusionparty.org.au SITE_RUNTIME_MODE=production node node_modules/astro/bin/astro.mjs dev --host 127.0.0.1
 * Run: node scripts/qa/check-site-network.mjs http://127.0.0.1:4321 [--routes]
 * --routes includes policies navigation once the #79 route migration is complete.
 * Optional QA_SCREENSHOT_DIR writes desktop/mobile evidence outside the source tree.
 */
import assert from 'node:assert/strict'
import http from 'node:http'
import https from 'node:https'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { siteRegistry } from '../../config/sites.mjs'

const server = new URL(process.argv[2] || 'http://127.0.0.1:4321')
assert.ok(['127.0.0.1', 'localhost'].includes(server.hostname), 'Use a local regression server')
const sites = Object.values(siteRegistry)
const includeRoutes = process.argv.includes('--routes')
const screenshotDir = process.env.QA_SCREENSHOT_DIR

function request(hostname, pathname = '/') {
  return new Promise((resolve, reject) => {
    const transport = server.protocol === 'https:' ? https : http
    const req = transport.get(
      new URL(pathname, server),
      { headers: { Host: `${hostname}${server.port ? `:${server.port}` : ''}` } },
      (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          body += chunk
        })
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }))
      }
    )
    req.setTimeout(120000, () =>
      req.destroy(new Error(`Timed out requesting ${hostname}${pathname}`))
    )
    req.on('error', reject)
  })
}

function assertIdentity(html, site, pathname = '/') {
  assert.match(html, new RegExp(`data-theme=["']${site.siteId}["']`), `${site.siteId} theme`)
  assert.ok(
    html.includes(`href="${new URL(pathname, site.canonicalOrigin).href}"`),
    `${site.siteId} canonical`
  )
  assert.ok(html.includes(site.deployment.label), `${site.siteId} identity`)
  assert.ok(html.includes(site.deployment.themeColor), `${site.siteId} theme metadata`)
}

const published = new Map()
for (const site of sites) {
  const api = new URL(
    `https://${site.cms.projectId}.api.sanity.io/v2024-01-29/data/query/${site.cms.dataset}`
  )
  api.searchParams.set(
    'query',
    '{"home": *[_type == "homePage"][0]{hero{title}}, "policies": *[_type == "policy" && coalesce(status, "adopted") == "adopted"]{_id,title,"slug":slug.current}, "research": *[_type == "researchResource"]{_id,title,"slug":slug.current}}'
  )
  api.searchParams.set('perspective', 'published')
  const response = await fetch(api, { signal: AbortSignal.timeout(30000) })
  assert.ok(response.ok, `${site.siteId} published CMS read: ${response.status}`)
  published.set(site.siteId, (await response.json()).result)
}

// Interleave both hostnames through one process; never boot one server per branch.
await Promise.all(
  [...sites, ...sites, ...sites].map(async (site) => {
    const response = await request(site.hostnames[0])
    assert.equal(response.status, 200, `${site.siteId} home status`)
    assertIdentity(response.body, site)
  })
)
const unknown = await request('unregistered.fusionparty.org.au')
assert.equal(unknown.status, 404, 'Unknown production hostname fails closed')
assert.match(unknown.headers['cache-control'] || '', /no-store/, 'Unknown host is not cached')
assert.ok(!unknown.body.includes('data-theme='), 'Unknown host does not render a branch site')

if (includeRoutes) {
  for (const site of sites) {
    const host = site.hostnames[0]
    const source = published.get(site.siteId)
    const paths = [
      '/policies',
      '/research',
      '/blog',
      '/faq',
      '/electorates',
      '/vision',
      '/manifesto',
      '/contact',
    ]
    await Promise.all(
      paths.map(async (path) => {
        const response = await request(host, path)
        assert.equal(response.status, 200, `${site.siteId} ${path} status`)
        assertIdentity(response.body, site, path)
      })
    )
    for (const [collection, path] of [
      ['policies', '/policies'],
      ['research', '/research'],
    ]) {
      const document = source[collection]?.find((item) => item.slug)
      if (!document) {
        console.log(`SKIP: ${site.siteId} ${collection} detail: no published slug`)
        continue
      }
      const pathname = `${path}/${encodeURIComponent(document.slug)}`
      const response = await request(host, pathname)
      assert.equal(response.status, 200, `${site.siteId} ${pathname} status`)
      assertIdentity(response.body, site, pathname)
      assert.ok(
        response.body.includes(
          document.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        ),
        `${site.siteId} ${collection} title from its dataset`
      )
    }
    const manifest = await request(host, '/site.webmanifest')
    assert.equal(manifest.status, 200)
    const manifestData = JSON.parse(manifest.body)
    assert.equal(manifestData.short_name, site.deployment.label)
    assert.equal(manifestData.theme_color, site.deployment.themeColor)
    assert.ok(
      manifestData.icons.every((icon) => icon.src.startsWith(`/brand-icons/${site.siteId}/`))
    )
    const sw = await request(host, '/sw.js')
    assert.equal(sw.status, 200)
    assert.ok(sw.body.includes(`fusion-${site.siteId}-v`))
    for (const path of [
      '/robots.txt',
      '/llms.txt',
      '/rss.xml',
      '/policy-sitemap.xml',
      '/research-sitemap.xml',
      '/blog-sitemap.xml',
      '/content-sitemap.xml',
      '/news-sitemap.xml',
    ]) {
      const response = await request(host, path)
      assert.equal(response.status, 200, `${site.siteId} ${path} status`)
      if (path.endsWith('sitemap.xml')) {
        for (const match of response.body.matchAll(/<loc>([^<]+)<\/loc>/g))
          assert.equal(new URL(match[1]).origin, site.canonicalOrigin, `${site.siteId} ${path} loc`)
      } else
        assert.ok(response.body.includes(site.canonicalOrigin), `${site.siteId} ${path} origin`)
    }
    for (const [collection, path] of [
      ['policies', '/api/policies.json'],
      ['research', '/api/research.json'],
    ]) {
      const response = await request(host, path)
      assert.equal(response.status, 200, `${site.siteId} ${path} status`)
      const data = JSON.parse(response.body)
      assert.equal(data.organization.canonical_url, site.canonicalOrigin)
      assert.equal(data.organization.name, site.deployment.label)
      const items = data[collection === 'research' ? 'resources' : 'policies']
      assert.deepEqual(
        items.map((item) => item.id).sort(),
        source[collection].map((item) => item._id).sort(),
        `${site.siteId} ${path} exact published dataset IDs`
      )
      assert.ok(items.every((item) => new URL(item.canonical_url).origin === site.canonicalOrigin))
    }
    for (const path of ['/api/policies.txt', '/api/research.txt', '/api/policy-changes.json']) {
      const response = await request(host, path)
      assert.equal(response.status, 200, `${site.siteId} ${path} status`)
      assert.ok(response.body.includes(site.canonicalOrigin), `${site.siteId} ${path} origin`)
    }
    console.log(`PASS: ${site.siteId} route/detail/API/discovery/PWA HTTP matrix`)
  }
}

const browser = await chromium.launch({
  args: [
    '--no-proxy-server',
    `--host-resolver-rules=${sites.map((site) => `MAP ${site.hostnames[0]} 127.0.0.1`).join(', ')}`,
  ],
})
try {
  if (screenshotDir) await mkdir(screenshotDir, { recursive: true })
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport })
    try {
      for (const site of [...sites, ...sites.slice().reverse()]) {
        const page = await context.newPage()
        const url = new URL(server)
        url.hostname = site.hostnames[0]
        const response = await page.goto(url.href, { waitUntil: 'networkidle', timeout: 60000 })
        assert.equal(response.status(), 200)
        await page.locator('main h1').first().waitFor({ state: 'visible' })
        await page.evaluate(() => document.fonts.ready)
        assert.equal(
          await page.locator('main h1').count(),
          1,
          `${site.siteId} has one home heading`
        )
        const heading = (await page.locator('main h1').innerText()).trim().replace(/\s+/g, ' ')
        assert.ok(heading.length > 0, `${site.siteId} home heading is visible`)
        const cmsTitle = published.get(site.siteId)?.home?.hero?.title
        if (cmsTitle)
          assert.equal(
            heading,
            cmsTitle.trim().replace(/\s+/g, ' '),
            `${site.siteId} home reads its published dataset`
          )
        assert.equal(await page.locator('html').getAttribute('data-theme'), site.siteId)
        assert.equal(
          await page.locator('link[rel="canonical"]').first().getAttribute('href'),
          `${site.canonicalOrigin}/`
        )
        assert.equal(
          await page.locator('meta[name="theme-color"]').getAttribute('content'),
          site.deployment.themeColor
        )
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1
        )
        assert.equal(overflow, false, `${site.siteId} ${viewport.width}px horizontal overflow`)
        if (includeRoutes) {
          // Use a visible content link on mobile as the primary navigation may be collapsed.
          if (viewport.width < 1280) {
            const toggle = page.locator('#mobile-menu-toggle')
            await toggle.focus()
            await page.keyboard.press('Enter')
            assert.equal(await toggle.getAttribute('aria-expanded'), 'true')
            await page.keyboard.press('Escape')
            assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
            assert.equal(await toggle.evaluate((el) => document.activeElement === el), true)
            await page.keyboard.press('Enter')
          }
          const policyLink = page
            .locator(
              viewport.width < 1280
                ? '#mobile-nav a[href="/policies"]'
                : '#main-nav a[href="/policies"]'
            )
            .first()
          await policyLink.click()
          await page.waitForURL('**/policies')
          assertIdentity(await page.content(), site, '/policies')
          assert.equal(await page.locator('main h1').count(), 1)
        }
        if (screenshotDir)
          await page.screenshot({
            path: `${screenshotDir}/${site.siteId}-${viewport.width}.png`,
            fullPage: true,
          })
        await page.close()
      }
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
console.log(
  `PASS: same-server VIC/QLD host isolation, published home content, unknown host, desktop/mobile identity${includeRoutes ? ', policies navigation' : ''}.`
)
