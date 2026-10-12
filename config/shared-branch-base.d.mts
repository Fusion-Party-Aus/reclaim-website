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
  readonly footer: Readonly<{
    tagline: string
    bannerText: string
    newsletter: Readonly<{ heading: string; description: string; buttonText: string }>
    navColumns: readonly Readonly<{
      badgeLabel: string
      badgeVariant: 'mint' | 'yellow' | 'white' | 'magenta'
      links: readonly Readonly<{ label: string; url: string; external: boolean }>[]
    }>[]
    resourceLinksLabel: string
    resourceLinks: readonly Readonly<{ label: string; url: string }>[]
  }>
}
export const sharedBranchBaseContent: SharedBranchBaseContent
export function getBranchBaseContent(siteId: string): SharedBranchBaseContent
