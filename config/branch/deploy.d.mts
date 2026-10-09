/**
 * Branch-agnostic framework — deploy config resolver and build orchestrator types.
 * Mirrors deploy.mjs. See architecture_blueprint.md §4 and algorithm_specification.md §7.
 */

import type { BranchManifest, DeployConfig, ResolvedBranch } from './contract.mjs'

export type BranchEnv = Record<string, string | boolean | undefined>

export interface DeployResolverDeps {
  /** Existence predicate for the resolved wrangler config path. Defaults to fs.existsSync. */
  fileExists?: (path: string) => boolean
}

export interface BranchBuildResult {
  slug: string
  status: 'ok' | 'error'
  error: { code: string | null; field: string | null; message: string } | null
}

export interface BuildAllBranchesDeps {
  resolveBranch: (manifest: BranchManifest, env: BranchEnv) => ResolvedBranch
  buildBranch: (resolved: ResolvedBranch, deploy: DeployConfig, env: BranchEnv) => void
  verify: (resolved: ResolvedBranch, manifest: BranchManifest, env: BranchEnv) => void
  fileExists?: (path: string) => boolean
}

/**
 * Resolve a Branch's deploy configuration. Fail-closed with DEPLOY_CONFIG_MISSING
 * when the Worker name, wrangler config, config file or KV bindings are absent.
 */
export declare function resolveDeployConfig(
  resolved: Pick<ResolvedBranch, 'identity' | 'deploy'>,
  env?: BranchEnv,
  deps?: DeployResolverDeps
): DeployConfig

/**
 * CI matrix primitive: resolve, build and verify every registered Branch,
 * returning a per-Branch result and never stopping at the first failure.
 */
export declare function buildAllBranches(
  manifest: BranchManifest,
  env?: BranchEnv,
  deps?: BuildAllBranchesDeps
): BranchBuildResult[]
