export interface BranchCityPhoto {
  readonly city: string
  readonly alt: string
  readonly src: string
  readonly photographer: string
  readonly creditUrl: string
  readonly position: string
}
export const branchCityPhotography: Readonly<Record<string, BranchCityPhoto>>
export function getBranchCityPhotography(siteId: string): BranchCityPhoto
