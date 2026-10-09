/**
 * Branch-agnostic framework — asset / analytics / service-worker-cache resolver types.
 * Mirrors assets.mjs. See docs/sparc/branch-agnostic/algorithm_specification.md §4.
 */

import type { AssetSet, AnalyticsBinding, ResolvedAnalytics } from './contract.mjs'

/** The mid-resolution descriptor shape the asset derivation receives. */
export interface AssetResolutionInput {
  identity: { slug: string }
  canonicalOrigin: string
  assets?: Partial<AssetSet>
}

/**
 * Resolved branch assets. Optional inputs (`logo`, `ogTemplate`) resolve to
 * `null` when absent, matching spec §4.1; the other fields are always present.
 */
export interface ResolvedAssets {
  ogDefault: string
  hero: string
  favicon: string
  pwaManifest: string
  logo: string | null
  ogTemplate: string | null
}

/** The mid-resolution descriptor shape the analytics derivation receives. */
export interface AnalyticsResolutionInput {
  identity: { slug: string }
  analytics?: Partial<AnalyticsBinding>
}

/** The minimal descriptor shape the cache derivation receives. */
export interface ServiceWorkerCacheInput {
  identity: { slug: string }
  deploy?: { cacheVersion?: string }
}

/** True when an asset path is namespaced to the branch slug. */
export declare function isBranchOwned(assetPath: unknown, slug: string): boolean

/** Validate and absolutise a branch's raw asset set. Throws ASSET_MISSING / ASSET_LEAKAGE. */
export declare function resolveAssets(resolved: AssetResolutionInput): ResolvedAssets

/** Derive the branch-scoped analytics descriptor. Throws ANALYTICS_SITE_ID_MISSING. */
export declare function resolveAnalytics(resolved: AnalyticsResolutionInput): ResolvedAnalytics

/** Derive the branch-scoped service-worker cache namespace. */
export declare function resolveServiceWorkerCache(resolved: ServiceWorkerCacheInput): string
