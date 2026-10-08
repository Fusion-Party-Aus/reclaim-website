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
