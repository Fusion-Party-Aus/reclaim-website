export interface SharedBranchBaseContent {
  readonly version: 1
  readonly ownerSiteId: 'national'
  readonly siteIds: readonly string[]
  readonly introduction: string
  readonly values: readonly Readonly<{ name: string; description: string }>[]
  readonly links: Readonly<
    Record<'values' | 'policy' | 'join' | 'volunteer' | 'contact' | 'privacy', string>
  >
}
export const sharedBranchBaseContent: SharedBranchBaseContent
export function getBranchBaseContent(siteId: string): SharedBranchBaseContent
