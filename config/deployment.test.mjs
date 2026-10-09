import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveDeployment } from './deployment.mjs'
import { starterContent } from './starter-content.mjs'

test('existing Victoria deployments retain identity and content source', () => {
  const config = resolveDeployment()
  assert.equal(config.siteUrl, 'https://vic.fusionparty.org.au')
  assert.equal(config.projectId, 'qwl3f8jb')
  assert.equal(config.dataset, 'production')
  assert.equal(config.label, 'Fusion Party Victoria')
})
test('Queensland uses the same project with isolated content', () => {
  const config = resolveDeployment({ PUBLIC_BRANCH: 'qld' })
  assert.equal(config.dataset, 'qld')
  assert.equal(config.projectId, 'qwl3f8jb')
  assert.equal(config.siteUrl, 'https://qld.fusionparty.org.au')
  assert.equal(starterContent(config)[0].movementMetrics.length, 0)
  assert.ok(!JSON.stringify(starterContent(config)).includes('Victoria'))
})
test('Studio and site resolve the same Queensland source', () => {
  assert.deepEqual(
    resolveDeployment({ SANITY_STUDIO_BRANCH: 'qld' }),
    resolveDeployment({ PUBLIC_BRANCH: 'qld' })
  )
})
test('misconfigured branches fail instead of silently publishing Victoria', () => {
  assert.throws(() => resolveDeployment({ PUBLIC_BRANCH: 'ql' }), /Unknown/)
  assert.throws(
    () => resolveDeployment({ PUBLIC_BRANCH: 'qld', PUBLIC_SANITY_DATASET: 'production' }),
    /Victoria production/
  )
})
test('custom canonical origin and a separate project are supported', () => {
  const config = resolveDeployment({
    PUBLIC_BRANCH: 'qld',
    SITE_URL: 'https://example.org/',
    PUBLIC_SANITY_PROJECT_ID: 'other123',
    PUBLIC_SANITY_DATASET: 'production',
  })
  assert.equal(config.siteUrl, 'https://example.org')
  assert.equal(config.dataset, 'production')
})

test('Victoria presentation config preserves the previously hardcoded values', () => {
  const config = resolveDeployment()
  assert.deepEqual(config.navigation.fallback, [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Policies', href: '/policies' },
    { label: 'Vision', href: '/vision' },
    { label: 'Research', href: '/research' },
  ])
  assert.deepEqual(config.navigation.cta, { label: 'Get involved', href: '/get-involved' })
  assert.equal(config.contact.email, 'contact@fusionparty.org.au')
  assert.equal(config.contact.pressEmail, 'press@fusionparty.org.au')
  assert.equal(config.contact.helloEmail, 'hello@fusionparty.org.au')
  assert.equal(config.contact.preselectionEmail, 'preselection@fusionparty.org.au')
  assert.equal(config.contact.techEmail, 'tech@fusionparty.org.au')
  assert.equal(config.contact.phone, '0410 249 574')
  assert.equal(config.contact.address, '254 McLeod Lane\nMansfield VIC 3722\nAustralia')
  assert.equal(config.contact.discord, 'https://www.fusionparty.org.au/discord')
  assert.equal(
    config.analytics.plausibleScriptUrl,
    'https://analytics.fusionparty.org.au/js/pa-HF_gBIYZhzFUGLXpsvgWh.js'
  )
  assert.equal(config.seo.nationalOrganizationUrl, 'https://fusionparty.org.au/#organization')
  assert.equal(config.seo.logoPath, '/logo.png')
  assert.equal(config.seo.defaultOgImage, '/og/default.png')
  assert.deepEqual(config.cta, {
    getInvolved: '/get-involved',
    donate: '/get-involved#donate',
    donateNational: 'https://fusionparty.org.au/donate',
    contact: '/contact',
    costings: '/costings',
    electorates: '/electorate',
    transportScore: 'https://transportscore.fusionparty.org.au',
  })
  assert.equal(config.footer.networkBrandingUrl, 'https://www.fusionparty.org.au')
  assert.equal(config.footer.newsletterEndpoint, '/api/newsletter')
})

test('Queensland presentation config uses its own values, never Victoria copy', () => {
  const victoria = resolveDeployment()
  const config = resolveDeployment({ PUBLIC_BRANCH: 'qld' })
  assert.deepEqual(config.navigation.fallback, [
    { label: 'Home', href: '/' },
    { label: 'Policies', href: '/policies' },
    { label: 'Contact', href: '/contact' },
  ])
  assert.deepEqual(config.navigation.cta, { label: 'Get involved', href: '/contact' })
  assert.notDeepEqual(config.navigation, victoria.navigation)
  assert.equal(config.analytics.plausibleScriptUrl, undefined)
  assert.notEqual(config.analytics.plausibleScriptUrl, victoria.analytics.plausibleScriptUrl)
  assert.equal(config.contact.phone, undefined)
  assert.equal(config.contact.address, undefined)
  assert.equal(config.contact.email, victoria.contact.email)
  assert.equal(config.seo.defaultOgImage, '/og/qld-default.png')
  assert.notEqual(config.seo.defaultOgImage, victoria.seo.defaultOgImage)
  assert.equal(config.cta.getInvolved, '/contact')
  assert.equal(config.cta.donate, 'https://fusionparty.org.au/donate')
  assert.equal(config.cta.electorates, '/electorates')
  assert.equal(config.cta.costings, undefined)
  assert.equal(config.cta.transportScore, undefined)
})

test('a plausible analytics override is available without inventing a Queensland site id', () => {
  const config = resolveDeployment({
    PUBLIC_BRANCH: 'qld',
    PUBLIC_PLAUSIBLE_SRC: 'https://analytics.example.org/js/pa-test.js',
  })
  assert.equal(config.analytics.plausibleScriptUrl, 'https://analytics.example.org/js/pa-test.js')
  const victoria = resolveDeployment({ PUBLIC_PLAUSIBLE_SRC: 'https://analytics.example.org/js/pa-test.js' })
  assert.equal(victoria.analytics.plausibleScriptUrl, 'https://analytics.example.org/js/pa-test.js')
})
