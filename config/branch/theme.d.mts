/**
 * Branch-agnostic framework — Theme Resolver / Theme Registry types.
 * Mirrors theme.mjs. See architecture_blueprint.md §3.2.
 */

import type { BranchManifest, ResolvedBranch, ResolvedTheme } from './contract.mjs'

export declare const TOKEN_ROLE_CSS_PROPERTIES: Readonly<Record<string, string>>

/** Resolve the theme owned by a branch into an immutable descriptor. */
export declare function resolveTheme(
  manifest: BranchManifest,
  resolved: ResolvedBranch
): ResolvedTheme

/** Validate every branch theme against the manifest token contract. Throws on violation. */
export declare function validateTokenContract(manifest: BranchManifest): void

/** Validate required manifest roles against branch CSS declarations. */
export declare function validateThemeCss(
  manifest: BranchManifest,
  cssBySlug: Record<string, string>
): void

/** Generate the ordered theme `@import` index from the manifest branch keys. */
export declare function buildThemeIndex(manifest: BranchManifest): string
