export interface SiteBranding {
  readonly accent: string
  readonly accentInk: string
  readonly accentDark: string
  readonly accentSoft: string
  readonly accentDisplay: string
}
export const siteBranding: Readonly<Record<string, SiteBranding>>
export function getSiteBranding(siteId: string): SiteBranding
