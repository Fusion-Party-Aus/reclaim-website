/**
 * Branch-agnostic framework — Theme Resolver / Theme Registry.
 *
 * Derives a branch theme from the manifest and a resolved branch, validates the
 * branch tokens against the manifest token contract, and generates the ordered
 * theme `@import` index. Fail-closed: every violation throws a BranchConfigError
 * carrying a code from the frozen contract.
 *
 * See docs/sparc/branch-agnostic/algorithm_specification.md §3 and §8,
 * and architecture_blueprint.md §3.2.
 */

import { BranchConfigError, ERROR_CODES, makeError } from './contract.mjs'

/**
 * Manifest roles intentionally map onto the established CSS vocabulary. Values
 * are not required to be equal: legacy theme palettes (notably VIC) predate the
 * manifest contract and retain their independently curated visual values.
 */
export const TOKEN_ROLE_CSS_PROPERTIES = Object.freeze({
  primary: '--color-magenta',
  'primary-dark': '--color-magenta-dark',
  'on-primary': '--color-on-primary',
  secondary: '--color-mint',
  'on-secondary': '--color-on-secondary',
  'surface-base': '--color-surface-base',
  'surface-raised': '--color-surface-raised',
  fg: '--color-fg',
  muted: '--color-muted',
  line: '--color-line',
  focus: '--color-focus',
})

/** Matches `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, functional colours and keywords. */
const COLOR_PATTERN =
  /^(?:#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\([^)]*\)|hsla?\([^)]*\)|transparent|currentColor|var\(--[^)]*\))$/

/** Matches CSS lengths (with or without units) plus `var()`, `calc()` and `clamp()`. */
const LENGTH_PATTERN =
  /^(?:0|-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw|vmin|vmax|ch|pt|ex)?|var\([^)]*\)|calc\([^)]*\)|clamp\([^)]*\))$/

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isBlank(value) {
  return typeof value !== 'string' || value.trim() === ''
}

/**
 * Infer a token kind from its name when the contract does not declare one.
 * @param {string} name
 * @returns {string}
 */
function inferKind(name) {
  if (
    /(color|colour|magenta|mint|yellow|lavender|violet|grey|gray|black|white|red|orange|blue|green|fg|muted|surface|line|chalk|focus|primary|secondary|tertiary|accent|ink|panel|base)/.test(
      name
    )
  ) {
    return 'color'
  }
  if (/shadow/.test(name)) return 'shadow'
  if (/(space|gap|size|width|height|inset|padding|margin)/.test(name)) return 'space'
  if (/radius/.test(name)) return 'radius'
  if (/font/.test(name)) return 'font'
  return 'other'
}

/**
 * @param {string} value
 * @param {string} kind
 * @returns {boolean}
 */
function isValidTokenValue(value, kind) {
  if (isBlank(value)) return false
  const candidate = value.trim()
  switch (kind) {
    case 'color':
      return COLOR_PATTERN.test(candidate)
    case 'space':
    case 'radius':
      return LENGTH_PATTERN.test(candidate)
    case 'font':
    case 'shadow':
    case 'other':
    default:
      return true
  }
}

/**
 * Collect every token-contract violation for a single branch theme.
 * @param {Record<string, string>} tokens
 * @param {{ requiredRoles?: string[], kinds?: Record<string, string> }} contract
 * @param {string} themeSlug
 * @returns {import('./contract.mjs').BranchError[]}
 */
function collectTokenErrors(tokens, contract, themeSlug) {
  const errors = []
  const safeTokens = tokens && typeof tokens === 'object' ? tokens : {}
  const requiredRoles = Array.isArray(contract?.requiredRoles) ? contract.requiredRoles : []
  const kinds = contract?.kinds && typeof contract.kinds === 'object' ? contract.kinds : {}

  for (const role of requiredRoles) {
    if (isBlank(safeTokens[role])) {
      errors.push(
        makeError(
          ERROR_CODES.THEME_TOKEN_MISSING,
          `theme.tokens.${role}`,
          `Branch theme '${themeSlug}' omits required role '${role}'.`,
          { themeSlug, role }
        )
      )
    }
  }

  for (const [name, value] of Object.entries(safeTokens)) {
    const kind = Object.hasOwn(kinds, name) ? kinds[name] : inferKind(name)
    if (!isValidTokenValue(value, kind)) {
      errors.push(
        makeError(
          ERROR_CODES.THEME_TOKEN_INVALID,
          `theme.tokens.${name}`,
          `Token '${name}' is not a valid ${kind} value.`,
          { themeSlug, name, kind, value }
        )
      )
    }
  }

  for (const name of Object.keys(safeTokens)) {
    if (!Object.hasOwn(kinds, name)) {
      errors.push(
        makeError(
          ERROR_CODES.THEME_TOKEN_UNKNOWN,
          `theme.tokens.${name}`,
          `Token '${name}' is not declared in the token contract.`,
          { themeSlug, name }
        )
      )
    }
  }

  return errors
}

/**
 * Validate every branch theme against the manifest token contract.
 * Fail-closed: throws on the first violating branch.
 * @param {import('./contract.mjs').BranchManifest} manifest
 * @returns {void}
 */
export function validateTokenContract(manifest) {
  if (!manifest || !manifest.tokenContract) {
    throw new BranchConfigError(
      ERROR_CODES.TOKEN_CONTRACT_MISSING,
      'tokenContract',
      'Branch manifest declares no theme token contract.'
    )
  }

  const branches =
    manifest.branches && typeof manifest.branches === 'object' ? manifest.branches : {}
  const errors = []

  for (const [slug, entry] of Object.entries(branches)) {
    const tokens = entry?.theme?.tokens
    errors.push(...collectTokenErrors(tokens, manifest.tokenContract, slug))
  }

  if (errors.length > 0) {
    const first = errors[0]
    throw new BranchConfigError(first.code, first.field, first.message, {
      errors,
      branches: Object.keys(branches),
    })
  }
}

/**
 * Resolve the theme owned by a branch into an immutable descriptor.
 * @param {import('./contract.mjs').BranchManifest} manifest
 * @param {import('./contract.mjs').ResolvedBranch} resolved
 * @returns {import('./contract.mjs').ResolvedTheme}
 */
export function resolveTheme(manifest, resolved) {
  const branchSlug = resolved?.identity?.slug
  const entry = manifest?.branches?.[branchSlug]
  const themeRef = resolved?.theme ?? entry?.theme
  const themeSlug = themeRef?.slug

  if (isBlank(themeSlug)) {
    throw new BranchConfigError(
      ERROR_CODES.THEME_UNKNOWN,
      'theme.slug',
      `No theme is registered for Branch '${branchSlug}'.`,
      { slug: branchSlug }
    )
  }

  if (!manifest?.branches || !Object.hasOwn(manifest.branches, themeSlug)) {
    throw new BranchConfigError(
      ERROR_CODES.THEME_UNKNOWN,
      'theme.slug',
      `Theme '${themeSlug}' is not a registered Branch theme.`,
      { themeSlug, known: manifest?.branches ? Object.keys(manifest.branches) : [] }
    )
  }

  if (themeSlug !== branchSlug) {
    throw new BranchConfigError(
      ERROR_CODES.THEME_SLUG_MISMATCH,
      'theme.slug',
      `Theme '${themeSlug}' is not owned by Branch '${branchSlug}'.`,
      { themeSlug, branch: branchSlug }
    )
  }

  const tokens = themeRef?.tokens ?? entry?.theme?.tokens
  if (!tokens) {
    throw new BranchConfigError(
      ERROR_CODES.THEME_UNKNOWN,
      'theme.tokens',
      `Theme '${themeSlug}' declares no tokens.`,
      { themeSlug }
    )
  }

  const errors = collectTokenErrors(tokens, manifest.tokenContract, themeSlug)
  if (errors.length > 0) {
    throw new BranchConfigError(
      ERROR_CODES.THEME_CONTRACT_VIOLATION,
      `theme.tokens`,
      `Theme '${themeSlug}' does not satisfy the token contract (${errors.length} problem(s)).`,
      { themeSlug, errors }
    )
  }

  return {
    slug: themeSlug,
    selector: `:root[data-theme='${themeSlug}']`,
    tokens,
    contract: manifest.tokenContract,
  }
}

/**
 * Generate the ordered theme `@import` index from the manifest branch keys.
 * @param {import('./contract.mjs').BranchManifest} manifest
 * @returns {string}
 */
export function buildThemeIndex(manifest) {
  const branches =
    manifest?.branches && typeof manifest.branches === 'object' ? manifest.branches : {}
  return Object.keys(branches)
    .map((slug) => `@import './${slug}.css';`)
    .join('\n')
    .concat(Object.keys(branches).length > 0 ? '\n' : '')
}

/**
 * Validate required manifest roles against declarations in each branch theme.
 * @param {import('./contract.mjs').BranchManifest} manifest
 * @param {Record<string, string>} cssBySlug
 * @returns {void}
 */
export function validateThemeCss(manifest, cssBySlug) {
  const branches =
    manifest?.branches && typeof manifest.branches === 'object' ? manifest.branches : {}
  const errors = []

  for (const [slug, entry] of Object.entries(branches)) {
    const css = cssBySlug?.[slug]
    if (typeof css !== 'string') {
      errors.push({ slug, property: null, message: `Theme CSS for branch '${slug}' is missing.` })
      continue
    }
    const selector = `:root[data-theme='${slug}']`
    const selectorStart = css.indexOf(`${selector} {`)
    const blockStart = selectorStart < 0 ? -1 : css.indexOf('{', selectorStart)
    let depth = 0
    let blockEnd = -1
    for (let index = blockStart; blockStart >= 0 && index < css.length; index += 1) {
      if (css[index] === '{') depth += 1
      if (css[index] === '}' && --depth === 0) {
        blockEnd = index
        break
      }
    }
    const block = blockEnd < 0 ? '' : css.slice(blockStart + 1, blockEnd)

    for (const role of manifest.tokenContract?.requiredRoles ?? []) {
      const property = TOKEN_ROLE_CSS_PROPERTIES[role]
      if (!property) {
        errors.push({
          slug,
          role,
          property: null,
          message: `No CSS property is mapped for token role '${role}'.`,
        })
      } else if (!block.includes(`${property}:`)) {
        errors.push({
          slug,
          role,
          property,
          message: `Theme '${slug}' does not declare mapped CSS property '${property}'.`,
        })
      }
    }
    if (entry?.theme?.slug !== slug) {
      errors.push({
        slug,
        role: null,
        property: null,
        message: `Theme slug '${entry?.theme?.slug}' does not match manifest branch '${slug}'.`,
      })
    }
  }

  if (errors.length) {
    throw new BranchConfigError(
      ERROR_CODES.THEME_CONTRACT_VIOLATION,
      'theme.css',
      `Branch theme CSS does not satisfy the token contract (${errors.length} problem(s)): ${errors[0].message}`,
      { errors }
    )
  }
}
