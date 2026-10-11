import { describe, expect, it, vi } from 'vitest'
import { resolveSite } from '../../config/sites.mjs'
import { createSiteContext } from './site-context'
import type { ContentOptions } from './content'

function contentClient(
  fetcher: (query: string, params?: Record<string, unknown>) => Promise<unknown>
) {
  return {
    fetch: <T = any>(query: string, params?: Record<string, unknown>) =>
      fetcher(query, params) as Promise<T>,
  }
}

function fakeFactory() {
  const fetch = vi.fn(async (_query: string, _params?: Record<string, unknown>) => [])
  const clientFactory = vi.fn<NonNullable<ContentOptions['clientFactory']>>((_config) =>
    contentClient(fetch)
  )
  return { fetch, clientFactory }
}

describe('request scoped site context', () => {
  it('creates isolated published content sources for concurrent Victoria and Queensland requests', async () => {
    const vic = fakeFactory()
    const qld = fakeFactory()
    const vicSite = resolveSite('https://vic.fusionparty.org.au/policies')
    const qldSite = resolveSite('https://qld.fusionparty.org.au/policies')
    const victoria = createSiteContext(vicSite, { clientFactory: vic.clientFactory })
    const queensland = createSiteContext(qldSite, { clientFactory: qld.clientFactory })
    await Promise.all([victoria.content.getPolicies(), queensland.content.getPolicies()])
    expect(vic.clientFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'qwl3f8jb',
        dataset: 'production',
        perspective: 'published',
        useCdn: false,
      })
    )
    expect(qld.clientFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'qwl3f8jb',
        dataset: 'qld',
        perspective: 'published',
        useCdn: false,
      })
    )
    expect(vic.fetch).toHaveBeenCalledTimes(1)
    expect(qld.fetch).toHaveBeenCalledTimes(1)
    expect(victoria.site).toBe(vicSite)
    expect(victoria.deployment).toBe(vicSite.deployment)
    expect(queensland.deployment.label).toBe('Fusion Party Queensland')
    expect(Object.isFrozen(victoria)).toBe(true)
  })

  it('exposes named content methods and keeps the client and raw fetch internal', () => {
    const { clientFactory } = fakeFactory()
    const context = createSiteContext(resolveSite('https://vic.fusionparty.org.au'), {
      clientFactory,
    })
    for (const name of [
      'getPolicies',
      'getPolicyBySlug',
      'getHomePage',
      'getDocuments',
      'getElectorates',
      'getResearchResources',
      'getSiteConfig',
      'urlFor',
    ] as const) {
      expect(context.content[name]).toBeTypeOf('function')
    }
    expect(context).not.toHaveProperty('client')
    expect(context.content).not.toHaveProperty('client')
    expect(context.content).not.toHaveProperty('fetch')
    expect(clientFactory.mock.calls[0][0]).not.toHaveProperty('token')
  })

  it('keeps identical slug and nested reference reads isolated while responses overlap', async () => {
    const pending: (() => void)[] = []
    const clientFactory = vi.fn<NonNullable<ContentOptions['clientFactory']>>((config) => {
      const fetch = vi.fn(
        () =>
          new Promise((resolve) =>
            pending.push(() =>
              resolve({
                _id: `${config.dataset}:same-slug`,
                title: config.dataset,
                related: [{ _id: `${config.dataset}:reference` }],
              })
            )
          )
      )
      return contentClient(fetch)
    })
    const vic = createSiteContext(resolveSite('https://vic.fusionparty.org.au'), { clientFactory })
    const qld = createSiteContext(resolveSite('https://qld.fusionparty.org.au'), { clientFactory })
    const victoria = vic.content.getPolicyBySlug('same-slug')
    const queensland = qld.content.getPolicyBySlug('same-slug')
    pending[1]()
    expect(await queensland).toMatchObject({
      _id: 'qld:same-slug',
      related: [{ _id: 'qld:reference' }],
    })
    pending[0]()
    expect(await victoria).toMatchObject({
      _id: 'production:same-slug',
      related: [{ _id: 'production:reference' }],
    })
    expect(vic.deployment.slug).toBe('vic')
    expect(qld.deployment.slug).toBe('qld')
  })

  it('propagates content failures without switching datasets or using another site client', async () => {
    const error = new Error('Content Lake unavailable')
    const fetch = vi.fn().mockRejectedValue(error)
    const clientFactory = vi.fn<NonNullable<ContentOptions['clientFactory']>>((_config) =>
      contentClient(fetch)
    )
    const context = createSiteContext(resolveSite('https://qld.fusionparty.org.au'), {
      clientFactory,
    })
    await expect(context.content.getHomePage()).rejects.toBe(error)
    expect(clientFactory).toHaveBeenCalledTimes(1)
    expect(clientFactory).toHaveBeenCalledWith(expect.objectContaining({ dataset: 'qld' }))
  })
})
