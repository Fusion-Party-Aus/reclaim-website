import { describe, it } from 'vitest'
import assert from 'node:assert/strict'
import { siteRegistry, resolveSite, validateSiteRegistry, UnknownSiteHostError } from './sites.mjs'
import { resolveDeployment } from './deployment.mjs'

function assertDeepFrozen(value) {
  if (!value || typeof value !== 'object') return
  assert.ok(Object.isFrozen(value))
  for (const child of Object.values(value)) assertDeepFrozen(child)
}

const cloneRegistry = () => structuredClone(siteRegistry)

describe('site registry and host resolution', () => {
  it('registers only existing Victoria and Queensland hosts with unchanged presentation', () => {
    assert.deepEqual(Object.keys(siteRegistry).sort(), ['qld', 'vic'])
    for (const [siteId, dataset] of [
      ['vic', 'production'],
      ['qld', 'qld'],
    ]) {
      const site = resolveSite(`https://${siteId}.fusionparty.org.au/policies`)
      assert.equal(site.siteId, siteId)
      assert.equal(site.branchId, siteId)
      assert.equal(site.canonicalOrigin, `https://${siteId}.fusionparty.org.au`)
      assert.deepEqual(site.hostnames, [`${siteId}.fusionparty.org.au`])
      assert.deepEqual(site.cms, { projectId: 'qwl3f8jb', dataset })
      assert.deepEqual(site.deployment, resolveDeployment({ PUBLIC_BRANCH: siteId }))
      assertDeepFrozen(site)
    }
    assertDeepFrozen(siteRegistry)
  })

  it('normalizes URL host case and ignores paths, query parameters, and ports', () => {
    assert.equal(
      resolveSite(new URL('https://QLD.fusionparty.org.au:8443/contact?siteId=vic')).siteId,
      'qld'
    )
  })

  it('fails closed for unknown production hosts and cannot override a real host', () => {
    for (const hostname of [
      'localhost',
      'fusionparty.org.au',
      'www.fusionparty.org.au',
      'vic.fusionparty.org.au.evil.example',
    ]) {
      assert.throws(
        () => resolveSite(`https://${hostname}/`, { mode: 'production', siteId: 'vic' }),
        UnknownSiteHostError
      )
    }
    assert.equal(
      resolveSite('https://qld.fusionparty.org.au/', { mode: 'production', siteId: 'vic' }).siteId,
      'qld'
    )
    assert.equal(
      resolveSite('https://vic.fusionparty.org.au/', { mode: 'production', siteId: 'unknown' })
        .siteId,
      'vic'
    )
  })

  it('requires explicit valid site selection in development and preview', () => {
    for (const mode of ['development', 'preview']) {
      assert.throws(() => resolveSite('http://localhost:4321/', { mode }))
      assert.throws(() => resolveSite('https://vic.fusionparty.org.au/', { mode }))
      assert.throws(() => resolveSite('http://localhost:4321/', { mode, siteId: 'national' }))
      assert.equal(resolveSite('http://localhost:4321/', { mode, siteId: 'qld' }).siteId, 'qld')
    }
    assert.throws(() => resolveSite('https://vic.fusionparty.org.au/', { mode: 'staging' }))
  })

  it('validates stable IDs and prevents ambiguous hosts', () => {
    assert.doesNotThrow(() => validateSiteRegistry(siteRegistry))
    const duplicateHost = cloneRegistry()
    duplicateHost.qld.hostnames.push('vic.fusionparty.org.au')
    assert.throws(() => validateSiteRegistry(duplicateHost))
    const wrongId = cloneRegistry()
    wrongId.vic.siteId = 'qld'
    assert.throws(() => validateSiteRegistry(wrongId))
  })

  it('permits distinct Sites to associate with the same organisational Branch', () => {
    const registry = cloneRegistry()
    registry['vic-public'] = structuredClone(registry.vic)
    registry['vic-public'].siteId = 'vic-public'
    registry['vic-public'].canonicalOrigin = 'https://preview-vic.example.org'
    registry['vic-public'].hostnames = ['preview-vic.example.org']
    registry['vic-public'].deployment.siteUrl = 'https://preview-vic.example.org'
    assert.doesNotThrow(() => validateSiteRegistry(registry))
  })

  it('rejects unsafe or mismatched canonical URLs', () => {
    for (const canonicalOrigin of [
      'http://vic.fusionparty.org.au',
      'https://user:password@vic.fusionparty.org.au',
      'https://vic.fusionparty.org.au/path',
      'https://vic.fusionparty.org.au/?x=1',
      'https://evil.example',
    ]) {
      const registry = cloneRegistry()
      registry.vic.canonicalOrigin = canonicalOrigin
      assert.throws(() => validateSiteRegistry(registry))
    }
  })

  it('keeps deployment bindings and credentials out of the runtime registry', () => {
    for (const key of ['deploy', 'workerName', 'kvNamespaces', 'token', 'apiToken', 'bindings']) {
      const registry = cloneRegistry()
      registry.vic[key] = 'forbidden-runtime-value'
      assert.throws(() => validateSiteRegistry(registry))
    }
    const operational = cloneRegistry()
    operational.vic.deployment.kvNamespaces = []
    assert.throws(() => validateSiteRegistry(operational))
    const registry = cloneRegistry()
    registry.vic.cms.token = 'forbidden-runtime-value'
    assert.throws(() => validateSiteRegistry(registry))
  })
})
