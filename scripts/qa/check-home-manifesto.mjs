import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { resolveDeployment } from '../../config/deployment.mjs'

// Usage: node scripts/qa/check-home-manifesto.mjs http://localhost:4321
// For another branch, set BRANCH and its PUBLIC_SANITY_DATASET as in dev:branch.
const deployment = resolveDeployment(process.env)
const query = '*[_type == "homePage"][0].manifestoSection'
const api = new URL(
  `https://${deployment.projectId}.api.sanity.io/v2025-01-01/data/query/${deployment.dataset}`
)
api.searchParams.set('query', query)
api.searchParams.set('perspective', 'published')
const response = await fetch(api)
assert.ok(response.ok, `CMS query failed: ${response.status}`)
const { result } = await response.json()
const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.goto(process.argv[2] || 'http://localhost:4321/', { waitUntil: 'networkidle' })
  const section = page.locator('section[aria-labelledby="home-approach-title"]')
  if (!result?.heading) {
    assert.equal(await section.count(), 0)
  } else {
    assert.equal((await section.locator('h2').innerText()).trim(), result.heading.trim())
    if (result.description) assert.ok((await section.innerText()).includes(result.description))
    assert.deepEqual(
      await section.locator('.home-manifesto-highlights dd').allTextContents(),
      (result.stats || []).map((stat) => stat.number)
    )
    assert.deepEqual(
      await section.locator('.home-manifesto-highlights dt').allTextContents(),
      (result.stats || []).map((stat) => stat.label)
    )
  }
  console.log('Manifesto heading, description and highlights match the published CMS content.')
} finally {
  await browser.close()
}
