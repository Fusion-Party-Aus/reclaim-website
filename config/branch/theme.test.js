import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import branchManifest from '../branches.mjs'
import { BranchConfigError, ERROR_CODES } from './contract.mjs'
import { resolveTheme, validateTokenContract, validateThemeCss, buildThemeIndex } from './theme.mjs'

const TOKEN_CONTRACT = {
  requiredRoles: ['magenta', 'mint', 'yellow', 'fg', 'muted', 'surface-base', 'branch-primary'],
  kinds: {
    magenta: 'color',
    'magenta-dark': 'color',
    mint: 'color',
    'mint-dark': 'color',
    yellow: 'color',
    fg: 'color',
    muted: 'color',
    'surface-base': 'color',
    'surface-raised': 'color',
    'branch-primary': 'color',
    'branch-secondary': 'color',
    'space-sm': 'space',
    'radius-card': 'radius',
    'shadow-brutal': 'shadow',
    'font-display': 'font',
  },
}

function makeTokens(overrides = {}) {
  return {
    magenta: '#d428d4',
    'magenta-dark': '#a81fa8',
    mint: '#00ddb8',
    'mint-dark': '#00b897',
    yellow: '#ffd400',
    fg: '#f7f3f8',
    muted: 'rgba(247, 243, 248, 0.72)',
    'surface-base': '#100d13',
    'surface-raised': '#1b1720',
    'branch-primary': '#d428d4',
    'branch-secondary': '#00ddb8',
    'space-sm': '0.5rem',
    'radius-card': '0.25rem',
    'shadow-brutal': '0 10px 30px rgba(0, 0, 0, 0.1)',
    'font-display': 'Barlow Condensed',
    ...overrides,
  }
}

function makeManifest() {
  return {
    schemaVersion: 1,
    defaultBranch: 'vic',
    tokenContract: globalThis.structuredClone(TOKEN_CONTRACT),
    branches: {
      vic: {
        identity: { slug: 'vic', state: 'Victoria' },
        theme: { slug: 'vic', tokens: makeTokens() },
      },
      qld: {
        identity: { slug: 'qld', state: 'Queensland' },
        theme: {
          slug: 'qld',
          tokens: makeTokens({ magenta: '#731e32', mint: '#233d3a', 'surface-base': '#fff7ec' }),
        },
      },
    },
  }
}

function resolvedFor(manifest, slug) {
  return { identity: { slug }, theme: manifest.branches[slug].theme }
}

function codeOf(fn) {
  try {
    fn()
  } catch (error) {
    return error
  }
  throw new Error('expected the call to throw, but it returned')
}

describe('resolveTheme', () => {
  it('resolves a Victorian theme with selector, tokens and contract', () => {
    const manifest = makeManifest()
    const theme = resolveTheme(manifest, resolvedFor(manifest, 'vic'))

    expect(theme.slug).toBe('vic')
    expect(theme.selector).toBe(":root[data-theme='vic']")
    expect(theme.tokens).toEqual(manifest.branches.vic.theme.tokens)
    expect(theme.contract).toEqual(manifest.tokenContract)
  })

  it('resolves a Queensland theme with selector, tokens and contract', () => {
    const manifest = makeManifest()
    const theme = resolveTheme(manifest, resolvedFor(manifest, 'qld'))

    expect(theme.slug).toBe('qld')
    expect(theme.selector).toBe(":root[data-theme='qld']")
    expect(theme.tokens.magenta).toBe('#731e32')
    expect(theme.contract).toEqual(manifest.tokenContract)
  })

  it('rejects a theme slug that is not a registered branch (THEME_UNKNOWN)', () => {
    const manifest = makeManifest()
    const resolved = { identity: { slug: 'vic' }, theme: { slug: 'nsw', tokens: makeTokens() } }

    const error = codeOf(() => resolveTheme(manifest, resolved))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.THEME_UNKNOWN)
  })

  it('rejects a theme that is not owned by the branch (THEME_SLUG_MISMATCH)', () => {
    const manifest = makeManifest()
    const resolved = { identity: { slug: 'vic' }, theme: manifest.branches.qld.theme }

    const error = codeOf(() => resolveTheme(manifest, resolved))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.THEME_SLUG_MISMATCH)
  })

  it('rejects a branch whose tokens violate the contract (THEME_CONTRACT_VIOLATION)', () => {
    const manifest = makeManifest()
    delete manifest.branches.vic.theme.tokens.mint
    const resolved = resolvedFor(manifest, 'vic')

    const error = codeOf(() => resolveTheme(manifest, resolved))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.THEME_CONTRACT_VIOLATION)
  })
})

describe('validateTokenContract', () => {
  it('accepts a manifest where every branch satisfies the contract', () => {
    expect(() => validateTokenContract(makeManifest())).not.toThrow()
  })

  it('fails when a branch omits a required role (THEME_TOKEN_MISSING)', () => {
    const manifest = makeManifest()
    delete manifest.branches.vic.theme.tokens.mint

    const error = codeOf(() => validateTokenContract(manifest))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.THEME_TOKEN_MISSING)
    expect(error.context.errors.map((e) => e.code)).toContain(ERROR_CODES.THEME_TOKEN_MISSING)
  })

  it('fails when a colour token is not a colour (THEME_TOKEN_INVALID)', () => {
    const manifest = makeManifest()
    manifest.branches.qld.theme.tokens.mint = 'not-a-colour'

    const error = codeOf(() => validateTokenContract(manifest))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.THEME_TOKEN_INVALID)
  })

  it('fails when a branch declares a token absent from the contract (THEME_TOKEN_UNKNOWN)', () => {
    const manifest = makeManifest()
    manifest.branches.vic.theme.tokens.mystery = '#ffffff'

    const error = codeOf(() => validateTokenContract(manifest))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.THEME_TOKEN_UNKNOWN)
  })

  it('rejects a manifest with no token contract', () => {
    const manifest = makeManifest()
    delete manifest.tokenContract

    const error = codeOf(() => validateTokenContract(manifest))
    expect(error).toBeInstanceOf(BranchConfigError)
    expect(error.code).toBe(ERROR_CODES.TOKEN_CONTRACT_MISSING)
  })
})

describe('buildThemeIndex', () => {
  it('emits an ordered import for every branch key', () => {
    const output = buildThemeIndex(makeManifest())

    expect(output).toBe("@import './vic.css';\n@import './qld.css';\n")
    expect(output.indexOf('./vic.css')).toBeLessThan(output.indexOf('./qld.css'))
  })

  it('derives imports from the keys, with no hardcoded qld special-case', () => {
    const manifest = makeManifest()
    delete manifest.branches.qld
    manifest.branches.nsw = {
      identity: { slug: 'nsw', state: 'New South Wales' },
      theme: { slug: 'nsw', tokens: makeTokens() },
    }

    const output = buildThemeIndex(manifest)
    expect(output).toContain("@import './vic.css';")
    expect(output).toContain("@import './nsw.css';")
    expect(output).not.toContain('qld')
  })
})

describe('manifest and CSS theme integration', () => {
  const cssBySlug = Object.fromEntries(
    Object.keys(branchManifest.branches).map((slug) => [
      slug,
      readFileSync(`src/styles/themes/${slug}.css`, 'utf8'),
    ])
  )

  it('validates real manifest tokens and every mapped property in registered branch themes', () => {
    expect(() => validateTokenContract(branchManifest)).not.toThrow()
    expect(() => validateThemeCss(branchManifest, cssBySlug)).not.toThrow()
    expect(buildThemeIndex(branchManifest)).toBe("@import './vic.css';\n@import './qld.css';\n")
  })

  it('fails when a manifest branch has no corresponding theme file', () => {
    const manifest = globalThis.structuredClone(branchManifest)
    manifest.branches.nsw = {
      ...globalThis.structuredClone(manifest.branches.vic),
      identity: { slug: 'nsw' },
      theme: { ...manifest.branches.vic.theme, slug: 'nsw' },
    }

    expect(() => validateThemeCss(manifest, cssBySlug)).toThrow(/CSS for branch 'nsw' is missing/)
  })

  it('fails when a branch theme omits a property mapped from a required token role', () => {
    const altered = {
      ...cssBySlug,
      vic: cssBySlug.vic.replaceAll('--color-magenta:', '--removed-magenta:'),
    }

    expect(() => validateThemeCss(branchManifest, altered)).toThrow(/--color-magenta/)
  })

  it('fails on manifest theme-slug drift', () => {
    const manifest = globalThis.structuredClone(branchManifest)
    manifest.branches.vic.theme.slug = 'other'

    expect(() => validateThemeCss(manifest, cssBySlug)).toThrow(
      /does not match manifest branch 'vic'/
    )
  })
})
