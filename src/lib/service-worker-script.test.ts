// @vitest-environment node
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'
import { createServiceWorkerScript } from './service-worker-script'

describe('createServiceWorkerScript', () => {
  it('rejects invalid branch slugs', () => {
    for (const branch of ['../vic', 'vic?x=1', 'Vic', 'vic/']) {
      expect(() => createServiceWorkerScript(branch)).toThrow('Invalid service worker branch slug')
    }
  })

  it('uses branch-unique cache names', () => {
    expect(createServiceWorkerScript('vic')).toContain("const CACHE_NAME = 'fusion-vic-v2'")
    expect(createServiceWorkerScript('qld')).toContain("const CACHE_NAME = 'fusion-qld-v2'")
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

describe('service worker install privacy', () => {
  it('never precaches private, no-store or noindex HTML during authenticated installation', async () => {
    const handlers = new Map<
      string,
      (event: { waitUntil: (value: Promise<unknown>) => void }) => void
    >()
    const cached: string[] = []
    const cache = {
      addAll: async (urls: string[]) => {
        cached.push(...urls)
      },
      put: async (url: string) => {
        cached.push(url)
      },
    }
    const caches = { open: async () => cache, delete: async () => true }
    const self = {
      addEventListener: (
        name: string,
        handler: (event: { waitUntil: (value: Promise<unknown>) => void }) => void
      ) => handlers.set(name, handler),
      skipWaiting: async () => {},
      location: { origin: 'https://vic.fusionparty.org.au' },
    }
    runInNewContext(createServiceWorkerScript('vic'), {
      self,
      caches,
      Promise,
      Response,
      URL,
      fetch: async (url: string) =>
        new Response('document', {
          status: 200,
          headers:
            url === '/'
              ? { 'Cache-Control': 'private, no-store' }
              : url === '/offline'
                ? { 'X-Robots-Tag': 'noindex' }
                : {},
        }),
    })
    let install: Promise<unknown> = Promise.resolve()
    handlers.get('install')!({
      waitUntil: (value) => {
        install = value
      },
    })
    await install
    expect(cached).not.toContain('/')
    expect(cached).not.toContain('/offline')
    expect(cached).toContain('/solo-full-colour.svg')
  })
})
