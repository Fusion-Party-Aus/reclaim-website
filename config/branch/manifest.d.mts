/**
 * Branch-agnostic framework — manifest loader types.
 * Mirrors manifest.mjs. See architecture_blueprint.md §4.2.
 */

import type { BranchManifest } from './contract.mjs'

export declare const SUPPORTED_SCHEMA_VERSION: 1

export declare function validateManifestShape(manifest: unknown): void

export type ManifestSource =
  | BranchManifest
  | { default?: BranchManifest; branchManifest?: BranchManifest }
  | null
  | undefined

export declare function loadManifest(source: ManifestSource): BranchManifest
