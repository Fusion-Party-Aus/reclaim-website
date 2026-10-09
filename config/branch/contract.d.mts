/**
 * Branch-agnostic framework — shared contract types.
 * FROZEN. Mirrors contract.mjs. See architecture_blueprint.md §4.
 */

export type BranchSlug = string
export type ErrorCode = keyof typeof ERROR_CODES
export type TokenName = string
export type TokenValue = string
export type TokenKind = 'color' | 'font' | 'space' | 'radius' | 'shadow' | 'other'

export interface BranchError {
  code: ErrorCode
  field: string | null
  message: string
  context: Record<string, unknown>
}

export interface Result<T> {
  ok: boolean
  value: T | null
  errors: BranchError[]
}

export interface Identity {
  slug: BranchSlug
  state: string
  adjective: string
  label: string
  tagline: string
  themeColor: string
  siteUrl: string
}

export interface SanityBinding {
  projectId: string
  dataset: string
  studioAppId: string
  allowSharedProject?: boolean
}

export interface ThemeReference {
  slug: string
  tokens: Record<TokenName, TokenValue>
}

export interface TokenContract {
  requiredRoles: TokenName[]
  kinds: Record<TokenName, TokenKind>
}

export interface AssetSet {
  ogDefault: string
  hero: string
  favicon: string
  pwaManifest: string
  logo?: string
  ogTemplate?: string
}

export interface AnalyticsBinding {
  siteId: string
  plausibleScriptUrl?: string
}

export interface KvNamespace {
  binding: string
  id: string
}

export interface DeployBinding {
  workerName: string
  wranglerConfig: string
  kvNamespaces: KvNamespace[]
  compatibilityFlags?: string[]
  compatibilityDate?: string
  cacheVersion?: string
}

export interface NavigationItem {
  label: string
  href: string
}

export interface ContactConfig {
  email?: string
  pressEmail?: string
  helloEmail?: string
  preselectionEmail?: string
  techEmail?: string
  discord?: string
  phone?: string
  address?: string
}

export interface SocialAccount {
  platform: string
  url: string
}

export interface CtaConfig {
  label: string
  href: string
}

export interface CtaLinks {
  getInvolved: string
  donate: string
  donateNational: string
  contact: string
  electorates: string
  costings?: string
  transportScore?: string
}

export interface FooterConfig {
  networkBrandingUrl: string
  newsletterEndpoint: string
}

export interface SeoConfig {
  description?: string
  sameAs?: string[]
  nationalOrganizationUrl?: string
  logoPath?: string
  defaultOgImage?: string
}

export interface PresentationConfig {
  navigation?: NavigationItem[]
  contact?: ContactConfig
  social: SocialAccount[]
  seo?: SeoConfig
  ctas: CtaConfig[]
}

export interface RuntimeAnalytics {
  plausibleScriptUrl?: string
}

export interface RuntimeNavigation {
  fallback: NavigationItem[]
  cta: NavigationItem
}

/**
 * The legacy runtime presentation surface. Carried through the resolver as an
 * opaque passthrough so the DeploymentFacade can reproduce the object shape
 * components read today without re-validating it as PresentationConfig.
 */
export interface RuntimeConfig {
  navigation: RuntimeNavigation
  contact: ContactConfig
  analytics: RuntimeAnalytics
  seo: SeoConfig
  cta: CtaLinks
  footer: FooterConfig
}

export interface BranchEntry {
  identity: Identity
  sanity: SanityBinding
  theme: ThemeReference
  assets: AssetSet
  analytics: AnalyticsBinding
  deploy: DeployBinding
  presentation?: PresentationConfig
  runtime?: RuntimeConfig
}

export interface BranchManifest {
  schemaVersion: number
  defaultBranch: BranchSlug
  branches: Record<BranchSlug, BranchEntry>
  tokenContract: TokenContract
}

export interface ResolvedTheme {
  slug: string
  selector: string
  tokens: Record<TokenName, TokenValue>
  contract: TokenContract
}

export interface ResolvedAssets {
  ogDefault: string
  hero: string
  favicon: string
  pwaManifest: string
  logo: string
  ogTemplate: string
}

export interface ResolvedAnalytics {
  siteId: string
  scriptUrl: string
  initPath: string
}

export interface ResolvedPresentation {
  navigation: NavigationItem[]
  contact: ContactConfig
  social: SocialAccount[]
  seo: SeoConfig
  ctas: CtaConfig[]
}

export interface ResolvedBranch {
  identity: Identity
  sanity: SanityBinding
  theme: ResolvedTheme
  assets: { raw: AssetSet; resolved: ResolvedAssets }
  analytics: { raw: AnalyticsBinding; resolved: ResolvedAnalytics }
  deploy: DeployBinding
  presentation: ResolvedPresentation
  runtime?: RuntimeConfig
  jurisdiction: string
  description: string
  canonicalOrigin: string
  serviceWorkerCache: string
}

export interface DeployConfig {
  workerName: string
  wranglerConfigPath: string
  kvNamespaces: KvNamespace[]
  compatibilityFlags: string[]
  compatibilityDate?: string
}

export interface ProvisionResult {
  slug: BranchSlug
  projectId: string
  dataset: string
  studioAppId: string
  seeded: string[]
  skipped: string[]
  manifestUpdated: boolean
}

export interface Credentials {
  writeToken: string
  session?: string
}

/** A resolved branch plus the presenting branch's content, for presentation resolution. */
export interface PresentationContent {
  navigation?: NavigationItem[]
  contact?: ContactConfig
  social?: SocialAccount[]
  seo?: SeoConfig
  ctas?: CtaConfig[]
}

export declare const ERROR_CODES: Readonly<Record<ErrorCode, ErrorCode>>
export declare const SLUG_PATTERN: RegExp
export declare const RESERVED_SLUGS: readonly string[]
export declare const NEUTRAL: Readonly<ResolvedPresentation>

export declare class BranchConfigError extends Error {
  constructor(
    code: ErrorCode,
    field: string | null,
    message: string,
    context?: Record<string, unknown>
  )
  code: ErrorCode
  field: string | null
  context: Record<string, unknown>
}

export declare function assert(
  condition: unknown,
  code: ErrorCode,
  field: string | null,
  message: string,
  context?: Record<string, unknown>
): void
export declare function makeError(
  code: ErrorCode,
  field: string | null,
  message: string,
  context?: Record<string, unknown>
): BranchError
export declare function ok<T>(value: T): Result<T>
export declare function fail<T = never>(errors: BranchError[]): Result<T>
export declare function assertSlug(slug: unknown, field?: string): BranchSlug
