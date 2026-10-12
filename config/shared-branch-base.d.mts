export interface SharedBranchBaseContent {
  readonly version: 1
  readonly ownerSiteId: 'national'
  readonly heroSlogan: string
  readonly missionHeading: string
  readonly policyAreas: readonly Readonly<{
    title: string
    description: string
    href: string
    photography: Readonly<{ src: string; alt: string; photographer: string; creditUrl: string }>
  }>[]
  readonly siteIds: readonly string[]
  readonly introduction: string
  readonly values: readonly Readonly<{
    name: string
    description: string
    photography: Readonly<{ src: string; alt: string; photographer: string; creditUrl: string }>
  }>[]
  readonly links: Readonly<
    Record<'values' | 'policy' | 'join' | 'volunteer' | 'contact' | 'privacy', string>
  >
}
export const sharedBranchBaseContent: SharedBranchBaseContent
export function getBranchBaseContent(siteId: string): SharedBranchBaseContent
