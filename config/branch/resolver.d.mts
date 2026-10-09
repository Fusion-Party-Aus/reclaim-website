/**
 * Branch-agnostic framework — BranchResolver types.
 * Mirrors resolver.mjs. See architecture_blueprint.md §4.3.
 */

import type { BranchManifest, ResolvedBranch } from './contract.mjs'

export declare function resolveBranch(
  manifest: BranchManifest,
  env?: Record<string, string | boolean | undefined>
): ResolvedBranch
