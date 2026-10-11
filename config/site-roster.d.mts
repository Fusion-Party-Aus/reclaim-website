export interface ApprovedSiteRecord {
  readonly siteId: string
  readonly branchId?: string
  readonly canonicalOrigin: string
  readonly aliases: readonly string[]
}
export const approvedSiteRoster: Readonly<Record<string, ApprovedSiteRecord>>
