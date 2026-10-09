/**
 * Branch-agnostic framework — branch provisioner types.
 * Mirrors provision.mjs. See algorithm_specification.md §6.
 */
import type {
  AnalyticsBinding,
  AssetSet,
  BranchEntry,
  BranchManifest,
  Credentials,
  DeployBinding,
  Identity,
  PresentationConfig,
  ProvisionResult,
  ThemeReference,
} from './contract.d.mts'

export interface ProvisionOptions {
  /** 'create' provisions a new branch; 'update' reconciles an existing one. */
  mode?: 'create' | 'update'
  /** Permit targeting the manifest default branch; also requires authorizeDefault. */
  allowDefault?: boolean
  /** Explicit authorization required together with allowDefault. */
  authorizeDefault?: boolean
  /** Explicit authorization required together with mode: 'update'. */
  authorizeUpdate?: boolean
  /** Dataset access control mode. */
  aclMode: 'public' | 'private'
  projectId?: string
  dataset?: string
  studioAppId?: string
  identity?: Partial<Identity>
  theme?: ThemeReference
  assets?: AssetSet
  analytics?: AnalyticsBinding
  deploy?: DeployBinding
  presentation?: PresentationConfig
  allowSharedProject?: boolean
}

/** The injected Sanity port plus the atomic manifest writer. */
export interface ProvisionAdapters {
  createProject(label: string, credentials: Credentials): Promise<string> | string
  listDatasets(
    projectId: string,
    credentials: Credentials
  ): Promise<Array<string | { name: string }>> | Array<string | { name: string }>
  createDataset(
    projectId: string,
    dataset: string,
    options: { aclMode: string },
    credentials: Credentials
  ): Promise<unknown> | unknown
  createStudioApp(projectId: string, credentials: Credentials): Promise<string> | string
  deployStudio(
    spec: { projectId: string; dataset: string; studioAppId: string; themeSlug: string },
    credentials: Credentials
  ): Promise<unknown> | unknown
  documentExists(
    projectId: string,
    dataset: string,
    documentId: string,
    credentials: Credentials
  ): Promise<boolean> | boolean
  createIfNotExists(
    projectId: string,
    dataset: string,
    document: Record<string, unknown>,
    credentials: Credentials
  ): Promise<unknown> | unknown
  manifestWriter(
    manifest: BranchManifest,
    slug: string,
    entry: BranchEntry
  ): Promise<BranchManifest> | BranchManifest
}

export declare function provisionBranch(
  manifest: BranchManifest,
  slug: string,
  options?: ProvisionOptions,
  credentials?: Credentials,
  adapters?: ProvisionAdapters
): Promise<ProvisionResult>
