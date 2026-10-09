import { describe, expect, it } from 'vitest'
import { BranchConfigError, ERROR_CODES, NEUTRAL } from './contract.mjs'
import { resolvePresentation } from './presentation.mjs'

const resolvedFor = (slug, presentation = null) => ({
  identity: {
    slug,
    state: slug === 'vic' ? 'Victoria' : 'Queensland',
    adjective: slug === 'vic' ? 'Victorian' : 'Queensland',
    label: slug === 'vic' ? 'Fusion Party Victoria' : 'Fusion Party Queensland',
    tagline: 'Reignite Democracy',
    themeColor: '#123456',
    siteUrl: `https://${slug}.fusionparty.org.au`,
  },
  description: `Fusion Party ${slug} — Reignite Democracy.`,
  presentation,
})

const manifestPresentation = () => ({
  navigation: [{ label: 'Manifest Policies', href: '/policies' }],
  contact: { email: 'manifest@example.org', phone: '0400 000 000', address: '1 Manifest St' },
  social: [{ platform: 'mastodon', url: 'https://mastodon.example/@manifest' }],
  seo: { description: 'Manifest SEO description', sameAs: ['https://example.org/manifest'] },
  ctas: [{ label: 'Manifest CTA', href: '/manifest-cta' }],
})

const contentFixture = () => ({
  navigation: [{ label: 'Content Policies', href: '/content-policies' }],
  contact: { email: 'content@example.org' },
  social: [{ platform: 'facebook', url: 'https://facebook.example/content' }],
  seo: { description: 'Content SEO description', sameAs: ['https://example.org/content'] },
  ctas: [{ label: 'Content CTA', href: '/content-cta' }],
})

const captureError = (fn) => {
  try {
    fn()
  } catch (error) {
    return error
  }
  throw new Error('expected resolvePresentation to throw')
}

describe('resolvePresentation precedence', () => {
  it('resolves Sanity content ahead of the manifest presentation', () => {
    const result = resolvePresentation(resolvedFor('qld', manifestPresentation()), contentFixture())

    expect(result.navigation).toEqual([{ label: 'Content Policies', href: '/content-policies' }])
    expect(result.contact).toEqual({ email: 'content@example.org' })
    expect(result.social).toEqual([
      { platform: 'facebook', url: 'https://facebook.example/content' },
    ])
    expect(result.seo).toEqual({
      description: 'Content SEO description',
      sameAs: ['https://example.org/content'],
    })
    expect(result.ctas).toEqual([{ label: 'Content CTA', href: '/content-cta' }])
  })

  it('resolves the manifest presentation ahead of NEUTRAL when content is absent', () => {
    const result = resolvePresentation(resolvedFor('qld', manifestPresentation()), null)

    expect(result.navigation).toEqual([{ label: 'Manifest Policies', href: '/policies' }])
    expect(result.contact.email).toBe('manifest@example.org')
    expect(result.social).toEqual([
      { platform: 'mastodon', url: 'https://mastodon.example/@manifest' },
    ])
    expect(result.seo.description).toBe('Manifest SEO description')
    expect(result.ctas).toEqual([{ label: 'Manifest CTA', href: '/manifest-cta' }])
    expect(result).not.toEqual(NEUTRAL)
  })

  it('resolves per-field, letting content fill gaps the manifest leaves', () => {
    const result = resolvePresentation(resolvedFor('qld', manifestPresentation()), {
      contact: { email: 'content@example.org' },
    })

    expect(result.contact).toEqual({ email: 'content@example.org' })
    expect(result.navigation).toEqual([{ label: 'Manifest Policies', href: '/policies' }])
    expect(result.social).toEqual([
      { platform: 'mastodon', url: 'https://mastodon.example/@manifest' },
    ])
  })
})

describe('resolvePresentation NEUTRAL', () => {
  it('yields exactly NEUTRAL when both content and manifest presentation are absent', () => {
    expect(resolvePresentation(resolvedFor('qld', null), null)).toEqual(NEUTRAL)
    expect(resolvePresentation(resolvedFor('qld'), null)).toEqual(NEUTRAL)
    expect(resolvePresentation(resolvedFor('qld', {}), null)).toEqual(NEUTRAL)
  })

  it('uses a branch-free two-item navigation and empty social/ctas', () => {
    const result = resolvePresentation(resolvedFor('qld', null), null)

    expect(result.navigation).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contact' },
    ])
    expect(result.social).toEqual([])
    expect(result.ctas).toEqual([])
    expect(result.contact).toEqual({})
  })

  it('never gives a non-vic branch a Victoria value when presentation is absent', () => {
    const victoria = resolvePresentation(
      resolvedFor('vic', {
        navigation: [{ label: 'Victorian Policies', href: '/victorian-policies' }],
        contact: { email: 'victoria@example.org' },
        social: [{ platform: 'facebook', url: 'https://facebook.example/victoria' }],
        ctas: [{ label: 'Victorian CTA', href: '/victorian-cta' }],
      }),
      null
    )
    const queensland = resolvePresentation(resolvedFor('qld', null), null)

    expect(JSON.stringify(queensland)).not.toMatch(/Victoria/i)
    expect(queensland.navigation).toEqual(NEUTRAL.navigation)
    expect(queensland.contact).toEqual(NEUTRAL.contact)
    expect(queensland.social).toEqual(NEUTRAL.social)
    expect(queensland.ctas).toEqual(NEUTRAL.ctas)
    expect(queensland).not.toEqual(victoria)
  })
})

describe('resolvePresentation validation', () => {
  it('throws PRESENTATION_INVALID for a malformed social URL', () => {
    const error = captureError(() =>
      resolvePresentation(resolvedFor('qld', null), {
        social: [{ platform: 'facebook', url: 'not-a-url' }],
      })
    )

    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.PRESENTATION_INVALID)
    expect(error.field).toContain('url')
    expect(error.context.slug).toBe('qld')
  })

  it('rejects a relative social URL as malformed', () => {
    const error = captureError(() =>
      resolvePresentation(resolvedFor('nsw', null), {
        social: [{ platform: 'facebook', url: '/facebook' }],
      })
    )

    expect(error.code).toBe(ERROR_CODES.PRESENTATION_INVALID)
  })

  it('throws PRESENTATION_INVALID for a CTA missing a label or href', () => {
    const malformed = [
      { label: '', href: '/x' },
      { label: 'Go', href: '   ' },
      { label: 'Go' },
      { href: '/x' },
    ]

    for (const cta of malformed) {
      const error = captureError(() =>
        resolvePresentation(resolvedFor('qld', null), { ctas: [cta] })
      )

      expect(error).toBeInstanceOf(BranchConfigError)
      expect(error.code).toBe(ERROR_CODES.PRESENTATION_INVALID)
      expect(error.field).toContain('ctas')
    }
  })

  it('throws PRESENTATION_INVALID for navigation items missing a label or href', () => {
    const error = captureError(() =>
      resolvePresentation(resolvedFor('qld', null), {
        navigation: [{ label: 'Policies', href: '' }],
      })
    )

    expect(error.code).toBe(ERROR_CODES.PRESENTATION_INVALID)
    expect(error.field).toContain('href')
  })

  it.each([
    'javascript:alert(1)',
    'data:text/html,hi',
    'vbscript:msgbox(1)',
    '//evil.example/path',
    '/x\nunsafe',
  ])('rejects unsafe navigation and CTA href %s', (href) => {
    for (const input of [
      { navigation: [{ label: 'Go', href }] },
      { ctas: [{ label: 'Go', href }] },
    ]) {
      expect(captureError(() => resolvePresentation(resolvedFor('vic', null), input)).code).toBe(
        ERROR_CODES.PRESENTATION_INVALID
      )
    }
  })

  it('allows root-relative and absolute HTTPS navigation, CTA, and social URLs', () => {
    const result = resolvePresentation(resolvedFor('vic', null), {
      navigation: [
        { label: 'Local', href: '/policies' },
        { label: 'External', href: 'https://example.org/path' },
      ],
      ctas: [
        { label: 'Local', href: '/join' },
        { label: 'External', href: 'https://example.org/join' },
      ],
      social: [{ platform: 'x', url: 'https://example.org/@fusion' }],
    })
    expect(result.navigation).toHaveLength(2)
    expect(result.ctas).toHaveLength(2)
    expect(result.social[0].url).toBe('https://example.org/@fusion')
  })
})
