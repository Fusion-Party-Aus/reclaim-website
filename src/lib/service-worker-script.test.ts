import { describe, expect, it } from 'vitest'
import { createServiceWorkerScript } from './service-worker-script'

describe('createServiceWorkerScript', () => {
  it('rejects invalid branch slugs', () => {
    for (const branch of ['../vic', 'vic?x=1', 'Vic', 'vic/']) {
      expect(() => createServiceWorkerScript(branch)).toThrow('Invalid service worker branch slug')
    }
  })

  it('uses branch-unique cache names', () => {
    expect(createServiceWorkerScript('vic')).toContain("const CACHE_NAME = 'fusion-vic-v1'")
    expect(createServiceWorkerScript('qld')).toContain("const CACHE_NAME = 'fusion-qld-v1'")
  })

  it('limits obsolete cache cleanup to the current branch prefix', () => {
    const script = createServiceWorkerScript('vic')

    expect(script).toContain("const CACHE_PREFIX = 'fusion-vic-'")
    expect(script).toContain('cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME')
    expect(script).not.toContain('new URL(self.location.href)')
    expect(script).not.toContain("searchParams.get('branch')")
    expect(script).not.toContain('branch=')
  })
})
