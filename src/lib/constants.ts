/**
 * Application Constants
 *
 * Centralized constants for colors, sizes, and other magic values
 * used throughout the application.
 */

/**
 * Brand Colors
 * Official Fusion Party brand colors + design system additions
 */
export const BRAND_COLORS = {
  // Primary brand colors
  MAGENTA: '#C926F2',
  MINT: '#5EFFD8',

  // Design system additions (see DESIGN_RATIONALE.md)
  YELLOW: '#FFED00',
  LAVENDER: '#E5D4FF',

  // Base colors
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  LIGHT_GREY: '#E5E5E5',

  // Semantic colors
  SUCCESS: '#5EFFD8', // Mint
  WARNING: '#FFED00', // Yellow
  ERROR: '#FF6B6B',
  INFO: '#C926F2', // Magenta
} as const

/**
 * Card Rotations
 * Subtle rotations for neo-brutalist aesthetic
 */
export const CARD_ROTATIONS = [-2, -1, -0.5, 0, 0.5, 1, 2, 3] as const

/**
 * Card Variants
 * Available color variants for cards and components
 */
export const CARD_VARIANTS = ['white', 'magenta', 'mint', 'yellow', 'lavender', 'black'] as const

/**
 * Shadow Sizes
 * Brutal shadow offsets in pixels
 */
export const SHADOW_SIZES = {
  none: '0',
  sm: '4',
  md: '6',
  lg: '8',
  xl: '12',
  '2xl': '16',
} as const

/**
 * Border Widths
 * Neo-brutalist border thicknesses
 */
export const BORDER_WIDTHS = {
  sm: '4px',
  md: '6px',
  lg: '8px',
} as const

/**
 * Animation Durations
 */
export const ANIMATION_DURATION = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const

/**
 * Breakpoints
 * Matches Tailwind CSS default breakpoints
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Z-Index Layers
 * Consistent z-index values for layering
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const

/**
 * FAQ Categories
 */
export const FAQ_CATEGORIES = [
  'All',
  'General',
  'Policies',
  'Membership',
  'Elections',
  'Tech',
  'About',
] as const

/**
 * External Links
 * Common external URLs used across the site
 */
export const EXTERNAL_LINKS = {
  FUSION_MAIN: 'https://fusionparty.org.au',
  FUSION_COSTINGS: 'https://fusionparty.org.au/costings',
  FACEBOOK: 'https://www.facebook.com/FusionPartyAus',
  TWITTER: 'https://twitter.com/FusionPartyAus',
  INSTAGRAM: 'https://www.instagram.com/fusionpartyaus',
  TIKTOK: 'https://www.tiktok.com/@fusionpartyaus',
  MASTODON: 'https://mastodon.au/@FusionPartyAus',
} as const

/**
 * Type helpers
 */
export type BrandColor = keyof typeof BRAND_COLORS
export type CardVariant = (typeof CARD_VARIANTS)[number]
export type CardRotation = (typeof CARD_ROTATIONS)[number]
export type ShadowSize = keyof typeof SHADOW_SIZES
export type BorderWidth = keyof typeof BORDER_WIDTHS
export type FAQCategory = (typeof FAQ_CATEGORIES)[number]
