/**
 * Component Library Index
 *
 * Centralized exports for all UI components.
 * Import from this file for convenience:
 *
 * import { BrutalCard, BrutalButton, Grid } from '@/components/ui';
 */

// Core Components
export { default as BrutalCard } from './BrutalCard.astro'
export { default as BrutalButton } from './BrutalButton.astro'
export { default as BrutalBadge } from './BrutalBadge.astro'

// Layout Components
export { default as Section } from './Section.astro'
export { default as Grid } from './Grid.astro'

// Feature Components
export { default as CTA } from './CTA.astro'
export { default as StatCard } from './StatCard.astro'
export { default as IconBadge } from './IconBadge.astro'
export { default as FloatingIcon } from './FloatingIcon.astro'
export { default as MovementMetrics } from './MovementMetrics.astro'

// Navigation Components
export { default as Breadcrumb } from './Breadcrumb.astro'

/**
 * Type exports for TypeScript support
 *
 * import type { CardProps, ButtonProps } from '@/components/ui';
 */

// Re-export types when needed
// export type { Props as CardProps } from './BrutalCard.astro';
// export type { Props as ButtonProps } from './BrutalButton.astro';
// ... (Add as TypeScript support improves in Astro)
