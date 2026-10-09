export interface NavFallbackItem {
  label: string
  href: string
}

export interface NavigationConfig {
  fallback: NavFallbackItem[]
  cta: { label: string; href: string }
}

export interface ContactConfig {
  email: string
  pressEmail: string
  helloEmail: string
  preselectionEmail: string
  techEmail: string
  discord: string
  phone?: string
  address?: string
}

export interface AnalyticsConfig {
  plausibleScriptUrl?: string
}

export interface SocialAccount {
  platform: string
  url: string
}

export interface BranchAssets {
  ogDefault: string
  hero: string
  favicon: string
  pwaManifest: string
  logo: string | null
  ogTemplate: string | null
}

export interface SeoConfig {
  nationalOrganizationUrl: string
  logoPath: string
  defaultOgImage: string
}

export interface CtaConfig {
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

export interface Deployment {
  contentProfile: 'victoria-campaign' | 'branch-neutral'
  features: { investigations: boolean }
  policyCallouts: { housing?: boolean; transportScore?: boolean }
  slug: string
  state: string
  adjective: string
  label: string
  tagline: string
  themeColor: string
  themeTokens: Record<string, string>
  siteUrl: string
  projectId: string
  dataset: string
  jurisdiction: string
  description: string
  navigation: NavigationConfig
  contact: ContactConfig
  analytics: AnalyticsConfig
  socialAccounts: SocialAccount[]
  assets: BranchAssets
  seo: SeoConfig
  cta: CtaConfig
  footer: FooterConfig
}
export const branches: Record<
  string,
  Omit<Deployment, 'projectId' | 'dataset' | 'jurisdiction' | 'description'>
>
export function resolveDeployment(env?: Record<string, string | boolean | undefined>): Deployment
