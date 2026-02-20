/**
 * Centralized Type Definitions for Sanity CMS Schema
 *
 * This file contains all TypeScript interfaces for Sanity document types.
 * Benefits:
 * - Single source of truth for types
 * - Easier refactoring when schemas change
 * - Better type safety across the application
 * - Reduced code duplication
 */

import type { PortableTextBlock } from '../lib/portableText'

/**
 * Common Sanity Types
 */
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt?: string
  _updatedAt?: string
  _rev?: string
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityImageAsset {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface SanityReference {
  _type: 'reference'
  _ref: string
}

/**
 * SEO Metadata
 */
export interface SEOMetadata {
  metaTitle?: string
  metaDescription?: string
  openGraphImage?: SanityImageAsset
}

/**
 * Policy Document
 */
export interface PolicyKeyPoint {
  _key?: string
  point: string
  description?: string
}

export interface Policy extends SanityDocument {
  _type: 'policy'
  pillar?:
    | 'RECLAIM OUR ECONOMY'
    | 'SOLVE THE HOUSING CRISIS'
    | 'FIX THE TAX EXPLOITS'
    | 'RECLAIM OUR FUTURE'
  category?: string
  title: string
  slug: SanitySlug
  icon?: string // MDI icon name (e.g., 'mdi:home')
  summary: string
  keyPoints?: PolicyKeyPoint[]
  // Further Detail fields
  designRationale?: string
  systemInteraction?: string
  economicLogic?: string
  riskAndFailureModes?: string
  evidenceAndPrecedent?: string
  implementationOutline?: string
  // Metadata
  cost?: string
  funding?: string
  body?: PortableTextBlock[]
  publishedAt?: string
  seo?: SEOMetadata
}

/**
 * Electorate Document
 */
export interface CommitmentDetail {
  detail: string
}

export interface Commitment {
  icon: string // Emoji or MDI icon
  title: string
  highlight: string
  details?: CommitmentDetail[]
}

export interface HTVCandidate {
  candidateName: string
  candidateParty: string
  candidateTier: 'magenta' | 'green' | 'orange' | 'red'
  ballotOrder?: number
  suggestedVote?: number
}

export interface Electorate extends SanityDocument {
  _type: 'electorate'
  name: string
  slug: SanitySlug
  isArchived?: boolean
  electionGrouping?: string
  house?: 'lower' | 'upper'
  subtitle?: string
  candidateName?: string
  candidateImage?: SanityImageAsset
  candidateBio?: string
  commitments?: Commitment[]
  htv?: HTVCandidate[]
  body?: PortableTextBlock[]
  region?: string
  publishedAt?: string
  seo?: SEOMetadata
}

/**
 * FAQ Document
 */
export interface FAQ extends SanityDocument {
  _type: 'faq'
  question: string
  answer: PortableTextBlock[]
  category?: 'General' | 'Policies' | 'Membership' | 'Elections' | 'Tech' | 'About'
  order?: number
  slug: SanitySlug
  tags?: string[]
}

/**
 * Page Document (Generic)
 */
export interface Page extends SanityDocument {
  _type: 'page'
  title: string
  slug: SanitySlug
  parent?: SanityReference
  pageType?: 'standard' | 'bio' | 'landing'
  profileImage?: SanityImageAsset
  role?: string
  socialLinks?: Array<{
    platform: string
    url: string
  }>
  subtitle?: string
  showSidebar?: boolean
  sidebarPosition?: 'left' | 'right'
  body?: PortableTextBlock[]
  sidebar?: PortableTextBlock[]
  publishedAt?: string
  seo?: SEOMetadata
}

/**
 * Home Page Document
 */
export interface TheftCard {
  title: string
  description: string
  icon?: string // MDI icon name
}

export interface ManifestoStat {
  value: string
  label: string
  icon?: string // MDI icon name
}

export interface JoinCard {
  title: string
  description: string
  ctaText: string
  ctaLink: string
  icon?: string // MDI icon name
}

export interface HomePage extends SanityDocument {
  _type: 'homePage'
  title: string
  heroTitle: string
  heroSubtitle: string
  theftSection: {
    title: string
    subtitle: string
    cards: TheftCard[]
  }
  manifestoSection: {
    title: string
    subtitle: string
    description: string
    stats: ManifestoStat[]
  }
  joinSection: {
    title: string
    subtitle: string
    cards: JoinCard[]
  }
  seo?: SEOMetadata
}

/**
 * Navigation
 */
export interface NavigationLink {
  label: string
  url: string
  external?: boolean
}

export interface Navigation extends SanityDocument {
  _type: 'navigation'
  title: string
  primaryLinks?: NavigationLink[]
  secondaryLinks?: NavigationLink[]
}

/**
 * Footer
 */
export interface SocialLink {
  platform: string
  url: string
  icon?: string // MDI icon name
  ariaLabel?: string
}

export interface FooterSection {
  title: string
  links?: NavigationLink[]
}

export interface Footer extends SanityDocument {
  _type: 'footer'
  tagline?: string
  description?: string
  socialLinks?: SocialLink[]
  sections?: FooterSection[]
  legalLinks?: NavigationLink[]
  copyrightText?: string
}

/**
 * Sidebar Configuration
 */
export interface SidebarSection {
  id: string
  title: string
  level?: number
}

export interface Sidebar extends SanityDocument {
  _type: 'sidebar'
  title: string
  sections: SidebarSection[]
}

/**
 * Type Guards
 */
export function isPolicy(doc: SanityDocument): doc is Policy {
  return doc._type === 'policy'
}

export function isElectorate(doc: SanityDocument): doc is Electorate {
  return doc._type === 'electorate'
}

export function isFAQ(doc: SanityDocument): doc is FAQ {
  return doc._type === 'faq'
}

export function isPage(doc: SanityDocument): doc is Page {
  return doc._type === 'page'
}
