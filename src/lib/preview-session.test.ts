// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { issuePreviewSession, verifyPreviewSession, safePreviewReturnPath } from './preview-session'

const key = 'test-preview-signing-key-with-at-least-32-bytes'
describe('authenticated preview sessions', () => {
  it('signs short-lived sessions for exactly one Site and browser', async () => {
    const token = await issuePreviewSession({ siteId: 'vic', browser: 'browser-a', now: 1000 }, key)
    expect(
      await verifyPreviewSession(token, { siteId: 'vic', browser: 'browser-a', now: 1001 }, key)
    ).toBe(true)
    expect(
      await verifyPreviewSession(token, { siteId: 'qld', browser: 'browser-a', now: 1001 }, key)
    ).toBe(false)
    expect(
      await verifyPreviewSession(token, { siteId: 'vic', browser: 'browser-b', now: 1001 }, key)
    ).toBe(false)
    expect(
      await verifyPreviewSession(
        token,
        { siteId: 'vic', browser: 'browser-a', now: 1000 + 1800001 },
        key
      )
    ).toBe(false)
    expect(
      await verifyPreviewSession(
        token + 'x',
        { siteId: 'vic', browser: 'browser-a', now: 1001 },
        key
      )
    ).toBe(false)
    expect(
      await verifyPreviewSession(
        token,
        { siteId: 'vic', browser: 'browser-a', now: 1001 },
        key + 'wrong'
      )
    ).toBe(false)
  })
  it('rejects external, protocol-relative and preview-handshake return paths', () => {
    for (const path of [
      'https://evil.example/',
      '//evil.example/',
      '/\\evil.example',
      '/api/preview/enable',
      '/foo?sanity-preview-secret=secret',
    ])
      expect(safePreviewReturnPath(path)).toBe('/')
    expect(safePreviewReturnPath('/policies/test?view=full')).toBe('/policies/test?view=full')
  })
})
