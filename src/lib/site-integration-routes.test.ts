// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resolveContentSite as resolveSite } from '../test/site-fixtures'

const fakes = vi.hoisted(() => ({
  secrets: {} as Record<string, string>,
  subscribe: vi.fn(async () => ({ ok: true })),
}))
vi.mock('astro:env/server', () => ({ getSecret: (name: string) => fakes.secrets[name] }))
vi.mock('../../nationbuilder/nationbuilder.js', () => ({ subscribeToNewsletter: fakes.subscribe }))
import { GET as start } from '../pages/api/oauth/nationbuilder/start'
import { GET as callback } from '../pages/api/oauth/nationbuilder/callback'
import { POST as newsletter } from '../pages/api/newsletter'
import { POST as members } from '../pages/api/members'

function context(
  siteId = 'vic',
  url = `https://${siteId}.fusionparty.org.au/api/oauth/nationbuilder/start`
) {
  const site = resolveSite(`https://${siteId}.fusionparty.org.au`)
  const cookies = { set: vi.fn(), get: vi.fn(), delete: vi.fn() }
  return {
    url: new URL(url),
    locals: { siteContext: { site }, runtime: { env: {} } },
    cookies,
    redirect: (location: string, status: number) =>
      new Response(null, { status, headers: { Location: location } }),
  } as any
}
beforeEach(() => {
  fakes.secrets = {}
  vi.clearAllMocks()
})
describe('Site integration HTTP boundaries', () => {
  it('redirects an approved alias OAuth start to canonical start, without carrying query input', async () => {
    const ctx = context(
      'vic',
      'https://alias.example/api/oauth/nationbuilder/start?redirect_uri=https://evil.example'
    )
    const response = await start(ctx)
    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe(
      'https://vic.fusionparty.org.au/api/oauth/nationbuilder/start'
    )
    expect(ctx.cookies.set).not.toHaveBeenCalled()
  })
  it('fails closed when atomic state service is absent', async () => {
    fakes.secrets = {
      NATIONBUILDER_SLUG: 'victoria',
      NATIONBUILDER_CLIENT_ID: 'id',
      NATIONBUILDER_CLIENT_SECRET: 'secret',
    }
    const ctx = context()
    ctx.locals.runtime.env.NATIONBUILDER_TOKENS = { put: vi.fn() }
    const response = await start(ctx)
    expect(response.status).toBe(503)
    expect(ctx.cookies.set).not.toHaveBeenCalled()
  })
  it('rejects callback at an alias before token exchange', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const response = await callback(
      context('vic', 'https://alias.example/api/oauth/nationbuilder/callback?code=code&state=state')
    )
    expect(response.status).toBe(400)
    expect(fetch).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
  it('does not subscribe QLD with only legacy VIC configuration', async () => {
    fakes.secrets = { NATIONBUILDER_SLUG: 'victoria', NATIONBUILDER_API_TOKEN: 'vic-token' }
    const ctx = context('qld')
    ctx.request = new Request('https://qld.fusionparty.org.au/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'person@example.test' }),
    })
    expect((await newsletter(ctx)).status).toBe(503)
    expect(fakes.subscribe).not.toHaveBeenCalled()
  })
  it('does not submit QLD membership with only legacy VIC configuration', async () => {
    fakes.secrets = { AEC_CRM_API_URL: 'https://vic-crm.example', AEC_CRM_API_KEY: 'vic-key' }
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const ctx = context('qld')
    ctx.request = new Request('https://qld.fusionparty.org.au/api/members', {
      method: 'POST',
      body: '{}',
    })
    expect((await members(ctx)).status).toBe(503)
    expect(fetch).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
  it('rejects whitespace email and null membership payloads without provider calls', async () => {
    const news = context('vic')
    news.request = new Request('https://vic.fusionparty.org.au/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'bad space@example.test' }),
    })
    expect((await newsletter(news)).status).toBe(422)
    fakes.secrets = { AEC_CRM_API_URL: 'https://vic-crm.example' }
    const member = context('vic')
    member.request = new Request('https://vic.fusionparty.org.au/api/members', {
      method: 'POST',
      body: 'null',
    })
    expect((await members(member)).status).toBe(422)
    expect(fakes.subscribe).not.toHaveBeenCalled()
  })
})
