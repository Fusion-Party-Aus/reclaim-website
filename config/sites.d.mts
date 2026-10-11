import type { Deployment } from './deployment.mjs'
export interface Site {
  readonly siteId: string
  readonly branchId?: string
  readonly canonicalOrigin: string
  readonly hostnames: readonly string[]
  readonly cms: { readonly projectId: string; readonly dataset: string }
  readonly deployment: Deployment
}
export type SiteRuntimeMode = 'production' | 'development' | 'preview'
export const siteRegistry: Readonly<Record<string, Site>>
export class UnknownSiteHostError extends Error {
  constructor(hostname: string)
}
export function validateSiteRegistry<T extends Record<string, Site>>(registry: T): T
export function resolveSite(
  requestUrl: string | URL,
  options?: { mode?: SiteRuntimeMode; siteId?: string }
): Site
