/**
 * Branch-agnostic framework — Verifier (parity + leakage) types.
 * Mirrors verify.mjs. See architecture_blueprint.md §7.
 */

import type { BranchManifest, ResolvedBranch } from './contract.mjs'

/**
 * Assert the resolved descriptor is self-consistent with its manifest entry
 * (slug/key match; theme, assets, analytics and deploy config present).
 * Throws a BranchConfigError with code PARITY_FAILURE naming the offending field.
 */
export declare function verifyParity(resolved: ResolvedBranch, manifest: BranchManifest): void

/**
 * Assert the built output for the resolved branch carries no other Branch's
 * identity label/tagline, OG/hero asset reference, analytics site id or cache
 * namespace. Pure over (descriptor, manifest, output).
 * Throws a BranchConfigError with code LEAKAGE_FAILURE naming the foreign
 * branch and the leaked token.
 */
export declare function verifyLeakage(
  resolved: ResolvedBranch,
  manifest: BranchManifest,
  readBuiltOutput: (resolved: ResolvedBranch) => unknown
): void
