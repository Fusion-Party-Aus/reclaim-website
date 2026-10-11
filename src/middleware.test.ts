// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { issuePreviewSession } from './lib/preview-session'
import { GET as manifest } from './pages/site.webmanifest'
import { GET as robots } from './pages/robots.txt'
import { GET as policySitemap } from './pages/policy-sitemap.xml'

const { clientConfigs } = vi.hoisted(() => ({ clientConfigs: [] as { dataset: string }[] }))
vi.mock('@sanity/client', () => ({
  createClient: (config: { dataset: string }) => {
    clientConfigs.push(config)
    return {
      fetch: async () => [
        { slug: { current: config.dataset === 'qld' ? 'qld-policy' : 'vic-policy' } },
      ],
    }
  },
}))

const signingKey = 'test-preview-signing-key-with-at-least-32-bytes'
vi.mock('astro:middleware', () => ({ defineMiddleware: (callback: unknown) => callback }))
vi.mock('astro:env/server', () => ({
  getSecret: (name: string) =>
    name === 'SANITY_API_READ_TOKEN'
      ? 'server-token'
      : name === 'VIC_PREVIEW_SESSION_SECRET'
        ? signingKey
        : undefined,
}))
import { onRequest } from './middleware'

beforeEach(() => vi.stubEnv('SITE_RUNTIME_MODE', 'production'))
afterEach(() => vi.unstubAllEnvs())

describe('authenticated preview middleware', () => {
  it('marks valid preview HTML private and noindex while creating a draft service', async () => {
    const now = Date.now()
    const token = await issuePreviewSession({ siteId: 'vic', browser: 'browser', now }, signingKey)
    const context = {
      url: new URL('https://vic.fusionparty.org.au/policies'),
      isPrerendered: false,
      locals: {},
      cookies: {
        get: (name: string) => ({ value: name.includes('session') ? token : 'browser' }),
        delete: vi.fn(),
      },
    } as any
    const response = await (onRequest as any)(context, async () => new Response('HTML'))
    expect(context.locals.preview).toBe(true)
    expect(response.headers.get('Cache-Control')).toContain('private')
    expect(response.headers.get('Cache-Control')).toContain('no-store')
    expect(response.headers.get('X-Robots-Tag')).toContain('noindex')
  })
  it('leaves unauthenticated public content published and rejects forged preview cookies', async () => {
    const context = {
      url: new URL('https://vic.fusionparty.org.au/policies'),
      isPrerendered: false,
      locals: {},
      cookies: { get: () => ({ value: 'forged' }), delete: vi.fn() },
    } as any
    const response = await (onRequest as any)(context, async () => new Response('public HTML'))
    expect(context.locals.preview).not.toBe(true)
    expect(response.headers.get('Cache-Control') ?? '').not.toContain('private')
  })
})

describe('host-bound public output', () => {
  it('serves Site metadata, discovery URLs and content for the request host, not forwarded host headers', async () => {
    for (const [host, otherHost, expectedLabel, expectedOrigin, otherOrigin, expectedSlug] of [
      [
        'vic.fusionparty.org.au',
        'qld.fusionparty.org.au',
        'Fusion Party Victoria',
        'https://vic.fusionparty.org.au',
        'https://qld.fusionparty.org.au',
        'vic-policy',
      ],
      [
        'qld.fusionparty.org.au',
        'vic.fusionparty.org.au',
        'Fusion Party Queensland',
        'https://qld.fusionparty.org.au',
        'https://vic.fusionparty.org.au',
        'qld-policy',
      ],
    ] as const) {
      const runRoute = async (
        route: typeof manifest | typeof robots | typeof policySitemap,
        pathname: string
      ) => {
        const context = {
          url: new URL(`https://${host}${pathname}`),
          request: new Request(`https://${host}${pathname}`, {
            headers: { 'x-forwarded-host': otherHost },
          }),
          isPrerendered: false,
          locals: {},
          cookies: { get: () => undefined, delete: vi.fn() },
        } as any
        const response = await (onRequest as any)(context, () => route(context))
        return response.text()
      }

      const [manifestOutput, robotsOutput, sitemapOutput] = await Promise.all([
        runRoute(manifest, '/site.webmanifest'),
        runRoute(robots, '/robots.txt'),
        runRoute(policySitemap, '/policy-sitemap.xml'),
      ])
      expect(manifestOutput).toContain(expectedLabel)
      expect(robotsOutput).toContain(`${expectedOrigin}/sitemap-index.xml`)
      expect(robotsOutput).not.toContain(otherOrigin)
      expect(sitemapOutput).toContain(`${expectedOrigin}/policies/${expectedSlug}`)
      expect(sitemapOutput).not.toContain(otherOrigin)
    }
    expect(clientConfigs).toContainEqual(expect.objectContaining({ dataset: 'production' }))
    expect(clientConfigs).toContainEqual(expect.objectContaining({ dataset: 'qld' }))
  })
})
