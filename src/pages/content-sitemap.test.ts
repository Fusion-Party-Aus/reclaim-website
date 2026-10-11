// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getDocuments: vi.fn(),
  getElectorates: vi.fn(),
  getArchivedElectorates: vi.fn(),
  getPages: vi.fn(),
  getInvestigations: vi.fn(),
}))
import { siteRegistry } from '../../config/sites.mjs'
import { GET } from './content-sitemap.xml'

async function sitemap(siteId: 'vic' | 'qld' = 'vic') {
  return (
    await GET({
      locals: {
        siteContext: {
          site: siteRegistry[siteId],
          deployment: siteRegistry[siteId].deployment,
          content: mocks,
        },
      },
    } as unknown as Parameters<typeof GET>[0])
  ).text()
}

describe('live content sitemap', () => {
  it('includes fresh CMS paths, nested pages and safe dates without duplicate entries', async () => {
    mocks.getDocuments.mockImplementation(async (type: string) =>
      type === 'blogPost'
        ? [
            { slug: { current: 'new-article' }, _updatedAt: '2026-10-04T10:00:00Z' },
            { title: 'Unroutable document' },
          ]
        : [{ slug: { current: 'why-fusion' }, _updatedAt: 'invalid' }]
    )
    mocks.getElectorates.mockResolvedValue([{ slug: { current: 'melton' } }])
    mocks.getArchivedElectorates.mockResolvedValue([{ slug: { current: 'melton' } }])
    mocks.getPages.mockResolvedValue([
      { slug: { current: 'rights&results' }, parent: { slug: { current: 'about' } } },
    ])
    const xml = await sitemap()
    expect(xml).toContain('/blog/new-article</loc><lastmod>2026-10-04T10:00:00.000Z</lastmod>')
    expect(xml).toContain('/faq/why-fusion</loc></url>')
    expect(xml).toContain('/about/rights&amp;results</loc>')
    expect(xml.match(/\/electorates\/melton<\/loc>/g)).toHaveLength(1)
    expect(xml).not.toContain('/undefined')
    expect(xml).not.toContain('/login')
    mocks.getDocuments.mockResolvedValue([{ slug: { current: 'just-published' } }])
    expect(await sitemap()).toContain('/blog/just-published</loc>')
  })
})

it('includes only enabled investigation routes and live electorate detail paths', async () => {
  mocks.getDocuments.mockResolvedValue([])
  mocks.getElectorates.mockResolvedValue([{ slug: { current: 'current-seat' } }])
  mocks.getArchivedElectorates.mockResolvedValue([{ slug: { current: 'archived-seat' } }])
  mocks.getPages.mockResolvedValue([])
  mocks.getInvestigations.mockResolvedValue([
    { slug: { current: 'new-investigation' }, _updatedAt: 'invalid' },
    { title: 'No route' },
  ])
  const disabledId = Object.values(siteRegistry).find(
    (site) => !site.deployment.features.investigations
  )!.siteId as 'vic' | 'qld'
  const enabledId = Object.values(siteRegistry).find(
    (site) => site.deployment.features.investigations
  )!.siteId as 'vic' | 'qld'
  const disabled = await sitemap(disabledId)
  expect(disabled).not.toContain('/investigations')
  expect(disabled).not.toContain('/electorates/archived-seat')
  expect(disabled).toContain('/electorates/current-seat')
  expect(disabled).toContain('/past-candidates')
  const enabled = await sitemap(enabledId)
  expect(enabled).toContain('/investigations</loc>')
  expect(enabled).toContain('/investigations/new-investigation</loc>')
  expect(enabled).not.toContain('invalid')
  expect(enabled).not.toContain('undefined')
})
