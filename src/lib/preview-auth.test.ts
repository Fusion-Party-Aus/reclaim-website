// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { authenticatePreview } from './preview-auth'
import { resolveSite } from '../../config/sites.mjs'
import { verifyPreviewSession } from './preview-session'

const signingKey = 'test-preview-signing-key-with-at-least-32-bytes'
function fixture() {
  const states = new Set<string>()
  const store = {
    issue: vi.fn(async (record: { state: string }) => {
      if (states.has(record.state)) return false
      states.add(record.state)
      return true
    }),
    consume: vi.fn(),
  }
  const validate = vi.fn(
    async (): Promise<{ isValid: boolean; redirectTo?: string }> => ({
      isValid: true,
      redirectTo: '/policies/test',
    })
  )
  return { store, validate, token: 'server-token', signingKey, now: 1000 }
}
describe('Sanity authenticated preview handshake', () => {
  it('issues a signed Site/browser session after supported secret validation and atomic claim', async () => {
    const f = fixture()
    const site = resolveSite('https://vic.fusionparty.org.au')
    const result = await authenticatePreview(
      site,
      new URL('https://vic.fusionparty.org.au/api/preview/enable?sanity-preview-secret=handshake'),
      f
    )
    expect(result.returnPath).toBe('/policies/test')
    expect(
      await verifyPreviewSession(
        result.session,
        { siteId: 'vic', browser: result.browser, now: 1001 },
        signingKey
      )
    ).toBe(true)
    expect(
      await verifyPreviewSession(
        result.session,
        { siteId: 'qld', browser: result.browser, now: 1001 },
        signingKey
      )
    ).toBe(false)
    expect(f.store.issue).toHaveBeenCalledTimes(1)
  })
  it.each(['arbitrary', 'origin-only', 'missing-store', 'missing-token', 'missing-signing-key'])(
    'rejects %s input before issuing credentials',
    async (reason) => {
      const f = fixture()
      let url = new URL(
        'https://vic.fusionparty.org.au/api/preview/enable?sanity-preview-secret=handshake'
      )
      if (reason === 'arbitrary')
        f.validate.mockResolvedValue({ isValid: false, redirectTo: undefined })
      if (reason === 'origin-only')
        url = new URL('https://vic.fusionparty.org.au/api/preview/enable')
      const options = {
        ...f,
        store: reason === 'missing-store' ? undefined : f.store,
        token: reason === 'missing-token' ? undefined : f.token,
        signingKey: reason === 'missing-signing-key' ? undefined : f.signingKey,
      }
      await expect(
        authenticatePreview(resolveSite('https://vic.fusionparty.org.au'), url, options)
      ).rejects.toThrow()
    }
  )
  it('rejects repeated handshake use and ignores unsafe return URLs', async () => {
    const f = fixture()
    f.validate.mockResolvedValue({ isValid: true, redirectTo: 'https://evil.example' })
    const site = resolveSite('https://vic.fusionparty.org.au')
    const url = new URL(
      'https://vic.fusionparty.org.au/api/preview/enable?sanity-preview-secret=handshake'
    )
    expect((await authenticatePreview(site, url, f)).returnPath).toBe('/')
    await expect(authenticatePreview(site, url, f)).rejects.toThrow(/replay/i)
  })
})
