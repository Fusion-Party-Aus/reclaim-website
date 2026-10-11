// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import {
  beginOAuth,
  completeOAuth,
  type OAuthStateStore,
  type OAuthStateRecord,
} from './oauth-flow'

function fixture() {
  let now = 1_000_000
  const records = new Map<string, OAuthStateRecord>()
  const store: OAuthStateStore = {
    issue: vi.fn(async (record) => {
      if (records.has(record.state)) return false
      records.set(record.state, record)
      return true
    }),
    consume: vi.fn(async (state, expected) => {
      const record = records.get(state)
      if (
        !record ||
        record.expiresAt <= expected.now ||
        record.siteId !== expected.siteId ||
        record.session !== expected.session
      )
        return false
      records.delete(state)
      return true
    }),
  }
  const exchange = vi.fn(async () => ({
    access_token: 'access',
    refresh_token: 'refresh',
    expires_in: 3600,
  }))
  const save = vi.fn(async () => {})
  const config = {
    siteId: 'vic',
    canonicalOrigin: 'https://vic.fusionparty.org.au',
    slug: 'victoria',
    clientId: 'client',
    clientSecret: 'secret',
    store,
  }
  return {
    config,
    records,
    store,
    exchange,
    save,
    now: () => now,
    advance: () => {
      now += 600_001
    },
  }
}

describe('OAuth flow', () => {
  it('uses canonical endpoints and random browser-bound state for a valid single-use flow', async () => {
    const f = fixture()
    const start = await beginOAuth(f.config, f.now())
    const url = new URL(start.authorizeUrl)
    expect(url.searchParams.get('redirect_uri')).toBe(
      `${f.config.canonicalOrigin}/api/oauth/nationbuilder/callback`
    )
    expect(start.state).toMatch(/^[a-f0-9]{64}$/)
    expect(start.session).toMatch(/^[a-f0-9]{64}$/)
    expect(start.state).not.toBe(start.session)
    expect((await beginOAuth(f.config, f.now())).state).not.toBe(start.state)
    await completeOAuth(
      f.config,
      { state: start.state, session: start.session, code: 'code' },
      { now: f.now(), exchange: f.exchange, save: f.save }
    )
    expect(f.exchange).toHaveBeenCalledTimes(1)
    expect(f.save).toHaveBeenCalledTimes(1)
    await expect(
      completeOAuth(
        f.config,
        { state: start.state, session: start.session, code: 'code' },
        { now: f.now(), exchange: f.exchange, save: f.save }
      )
    ).rejects.toThrow()
    expect(f.exchange).toHaveBeenCalledTimes(1)
  })
  it.each([
    'missing-state',
    'missing-session',
    'missing-code',
    'expired',
    'wrong-session',
    'wrong-site',
  ])('rejects %s before exchange', async (reason) => {
    const f = fixture()
    const start = await beginOAuth(f.config, f.now())
    const input = { state: start.state, session: start.session, code: 'code' }
    if (reason === 'missing-state') input.state = ''
    if (reason === 'missing-session') input.session = ''
    if (reason === 'missing-code') input.code = ''
    if (reason === 'expired') f.advance()
    if (reason === 'wrong-session') input.session = 'different'
    if (reason === 'wrong-site') f.config.siteId = 'qld'
    await expect(
      completeOAuth(f.config, input, { now: f.now(), exchange: f.exchange, save: f.save })
    ).rejects.toThrow()
    expect(f.exchange).not.toHaveBeenCalled()
    expect(f.save).not.toHaveBeenCalled()
  })
  it('fails closed without an atomic store', async () => {
    const f = fixture()
    await expect(beginOAuth({ ...f.config, store: undefined }, f.now())).rejects.toThrow(/atomic/i)
  })
  it('consumes state before exchange even when exchange fails', async () => {
    const f = fixture()
    const start = await beginOAuth(f.config, f.now())
    f.exchange.mockRejectedValueOnce(new Error('exchange failed'))
    const input = { state: start.state, session: start.session, code: 'code' }
    await expect(
      completeOAuth(f.config, input, { now: f.now(), exchange: f.exchange, save: f.save })
    ).rejects.toThrow()
    await expect(
      completeOAuth(f.config, input, { now: f.now(), exchange: f.exchange, save: f.save })
    ).rejects.toThrow()
    expect(f.exchange).toHaveBeenCalledTimes(1)
  })
  it('allows only one overlapping callback to exchange a code', async () => {
    const f = fixture()
    const start = await beginOAuth(f.config, f.now())
    const input = { state: start.state, session: start.session, code: 'code' }
    const result = await Promise.allSettled([
      completeOAuth(f.config, input, { now: f.now(), exchange: f.exchange, save: f.save }),
      completeOAuth(f.config, input, { now: f.now(), exchange: f.exchange, save: f.save }),
    ])
    expect(result.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    expect(f.exchange).toHaveBeenCalledTimes(1)
  })
})
