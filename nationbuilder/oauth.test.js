// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { getAccessToken, storeTokens } from './oauth.js'

function kv() {
  const data = new Map()
  return {
    get: vi.fn(async (key) => data.get(key) ?? null),
    put: vi.fn(async (key, value) => {
      data.set(key, value)
    }),
    data,
  }
}
describe('Site-scoped NationBuilder tokens', () => {
  it('namespaces tokens and never reuses another Site cache', async () => {
    const store = kv()
    const vic = { SITE_ID: 'vic', NATIONBUILDER_SLUG: 'fusion', NATIONBUILDER_TOKENS: store }
    const qld = { ...vic, SITE_ID: 'qld' }
    await storeTokens(vic, {
      access_token: 'vic-access',
      refresh_token: 'vic-refresh',
      expires_in: 3600,
    })
    await storeTokens(qld, {
      access_token: 'qld-access',
      refresh_token: 'qld-refresh',
      expires_in: 3600,
    })
    expect(await getAccessToken(vic)).toBe('vic-access')
    expect(await getAccessToken(qld)).toBe('qld-access')
    expect(store.data.size).toBe(2)
  })
  it('does not read an unnamespaced legacy token key for any Site', async () => {
    const store = kv()
    store.data.set(
      'nationbuilder:tokens',
      JSON.stringify({
        access_token: 'legacy',
        refresh_token: 'legacy-refresh',
        expires_at: Date.now() + 3600000,
      })
    )
    for (const siteId of ['vic', 'qld']) {
      expect(
        await getAccessToken({
          SITE_ID: siteId,
          NATIONBUILDER_SLUG: siteId,
          NATIONBUILDER_TOKENS: store,
        })
      ).toBeNull()
    }
    expect(store.get).toHaveBeenCalledTimes(2)
    expect(store.get).toHaveBeenNthCalledWith(1, 'site:vic:nationbuilder:vic:tokens')
    expect(store.get).toHaveBeenNthCalledWith(2, 'site:qld:nationbuilder:qld:tokens')
  })
  it('requires explicit Site identity and persistent storage when storing tokens', async () => {
    await expect(getAccessToken({ NATIONBUILDER_API_TOKEN: 'global' })).rejects.toThrow()
    await expect(
      storeTokens(
        { SITE_ID: 'vic', NATIONBUILDER_SLUG: 'vic' },
        { access_token: 'a', refresh_token: 'r' }
      )
    ).rejects.toThrow()
  })
})
