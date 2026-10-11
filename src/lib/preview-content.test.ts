// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import type { ClientConfig } from '@sanity/client'
import { createContentService } from './content'
import { createDraftContentService } from './preview-content'
import { authenticatedPreviewContent } from './site-preview'
import { issuePreviewSession } from './preview-session'
import { resolveSite } from '../../config/sites.mjs'

describe('separate public and authenticated draft services', () => {
  it('does not allow an authenticated draft token or perspective to alter the public factory', () => {
    const factory = vi.fn((_config: ClientConfig) => ({ fetch: async <T>() => [] as T }))
    const site = resolveSite('https://vic.fusionparty.org.au')
    createContentService(site, { clientFactory: factory })
    expect(factory.mock.calls[0][0]).toMatchObject({
      perspective: 'published',
      dataset: 'production',
    })
    expect(factory.mock.calls[0][0]).not.toHaveProperty('token')
    createDraftContentService(site, 'server-only', { clientFactory: factory })
    expect(factory.mock.calls[1][0]).toMatchObject({
      perspective: 'drafts',
      dataset: 'production',
      token: 'server-only',
      useCdn: false,
    })
    expect(() => createDraftContentService(site, '', { clientFactory: factory })).toThrow()
  })
  it('only substitutes draft content for valid signed Site/browser sessions', async () => {
    const factory = vi.fn((_config: ClientConfig) => ({ fetch: async <T>() => [] as T }))
    const site = resolveSite('https://vic.fusionparty.org.au')
    const signingKey = 'test-preview-signing-key-with-at-least-32-bytes'
    const session = await issuePreviewSession(
      { siteId: 'vic', browser: 'browser', now: 1000 },
      signingKey
    )
    const settings = { signingKey, token: 'server-only' }
    expect(
      await authenticatedPreviewContent(
        site,
        session,
        'wrong-browser',
        settings,
        { clientFactory: factory },
        1001
      )
    ).toBeUndefined()
    expect(
      await authenticatedPreviewContent(
        resolveSite('https://qld.fusionparty.org.au'),
        session,
        'browser',
        settings,
        { clientFactory: factory },
        1001
      )
    ).toBeUndefined()
    expect(
      await authenticatedPreviewContent(
        site,
        session,
        'browser',
        settings,
        { clientFactory: factory },
        1801001
      )
    ).toBeUndefined()
    expect(factory).not.toHaveBeenCalled()
    expect(
      await authenticatedPreviewContent(
        site,
        session,
        'browser',
        settings,
        { clientFactory: factory },
        1001
      )
    ).toBeDefined()
    expect(factory.mock.calls[0][0]).toMatchObject({ perspective: 'drafts', token: 'server-only' })
  })
})
