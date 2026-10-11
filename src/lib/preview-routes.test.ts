// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resolveContentSite as resolveSite } from '../test/site-fixtures'

const fake = vi.hoisted(() => ({
  secrets: {} as Record<string, string>,
  validate: vi.fn(async () => ({ isValid: true, redirectTo: '/policies/test' })),
  client: vi.fn(),
}))
vi.mock('astro:env/server', () => ({ getSecret: (name: string) => fake.secrets[name] }))
vi.mock('@sanity/preview-url-secret', () => ({ validatePreviewUrl: fake.validate }))
vi.mock('@sanity/client', () => ({
  createClient: (config: unknown) => {
    fake.client(config)
    return {
      withConfig() {
        return this
      },
      fetch: async () => ({ _id: 'private-secret' }),
    }
  },
}))
import { GET as enable } from '../pages/api/preview/enable'
import { POST as exit } from '../pages/api/preview/exit'

function context(siteId = 'vic', secret = 'handshake') {
  const states = new Set<string>()
  const binding = {
    fetch: vi.fn(async (request: Request) => {
      const record = (await request.json()) as { state: string }
      if (states.has(record.state)) return new Response(null, { status: 409 })
      states.add(record.state)
      return new Response(null, { status: 201 })
    }),
  }
  return {
    url: new URL(
      `https://${siteId}.fusionparty.org.au/api/preview/enable${secret ? `?sanity-preview-secret=${secret}` : ''}`
    ),
    request: new Request(`https://${siteId}.fusionparty.org.au/api/preview/enable`, {
      headers: { Origin: 'https://studio.sanity.studio' },
    }),
    locals: {
      siteContext: { site: resolveSite(`https://${siteId}.fusionparty.org.au`) },
      runtime: { env: { VIC_PREVIEW_STATE_STORE: binding } },
    },
    cookies: { set: vi.fn(), delete: vi.fn() },
  } as any
}
beforeEach(() => {
  vi.clearAllMocks()
  fake.secrets = {
    SANITY_API_READ_TOKEN: 'server-token',
    VIC_PREVIEW_SESSION_SECRET: 'test-preview-signing-key-with-at-least-32-bytes',
  }
  fake.validate.mockResolvedValue({ isValid: true, redirectTo: '/policies/test' })
})
describe('authenticated preview HTTP boundary', () => {
  it('uses supported server validation and private one-use cookies, then rejects replay', async () => {
    const ctx = context()
    const response = await enable(ctx)
    expect(response.status).toBe(303)
    expect(response.headers.get('Location')).toBe('/policies/test')
    expect(response.headers.get('Cache-Control')).toContain('no-store')
    expect(response.headers.get('X-Robots-Tag')).toContain('noindex')
    expect(fake.validate).toHaveBeenCalledTimes(1)
    expect(fake.client).toHaveBeenCalledWith(
      expect.objectContaining({ dataset: 'production', token: 'server-token' })
    )
    expect(ctx.cookies.set).toHaveBeenCalledTimes(2)
    expect(ctx.cookies.set.mock.calls[0][2]).toMatchObject({
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1800,
    })
    expect((await enable(ctx)).status).toBe(401)
  })
  it('rejects an Origin-only request and invalid secret without setting cookies', async () => {
    const origin = context('vic', '')
    expect((await enable(origin)).status).toBe(401)
    expect(origin.cookies.set).not.toHaveBeenCalled()
    fake.validate.mockResolvedValue({ isValid: false, redirectTo: '/ignored' })
    const invalid = context()
    expect((await enable(invalid)).status).toBe(401)
    expect(invalid.cookies.set).not.toHaveBeenCalled()
  })
  it('does not grant QLD preview through VIC credentials or binding', async () => {
    const ctx = context('qld')
    expect((await enable(ctx)).status).toBe(503)
    expect(ctx.cookies.set).not.toHaveBeenCalled()
    expect(fake.validate).not.toHaveBeenCalled()
  })
  it('requires same-origin exit and clears both host-only preview cookies', async () => {
    const ctx = context()
    expect((await exit(ctx)).status).toBe(403)
    expect(ctx.cookies.delete).not.toHaveBeenCalled()
    ctx.request = new Request('https://vic.fusionparty.org.au/api/preview/exit', {
      method: 'POST',
      headers: { Origin: 'https://vic.fusionparty.org.au' },
    })
    expect((await exit(ctx)).status).toBe(303)
    expect(ctx.cookies.delete).toHaveBeenCalledTimes(2)
  })
})
