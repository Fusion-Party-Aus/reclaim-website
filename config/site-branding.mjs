/** Approved brand roster. This does not activate hosts or modify existing VIC/QLD deployments. */
const palette = {
  national: ['#00C9D2', '#32105A', '#006A70', '#E4F9FA', '#00C9D2'],
  vic: ['#A8A8AD', '#32105A', '#5D5D65', '#F2F2F4', '#A8A8AD'],
  nsw: ['#FFE6EA', '#32105A', '#96334C', '#FFF6F8', '#FFE6EA'],
  qld: ['#912D35', '#FFFFFF', '#912D35', '#FBEDEF', '#EF8F9B'],
  wa: ['#FFD600', '#32105A', '#806B00', '#FFF9DA', '#FFD600'],
  sa: ['#ED174B', '#08040F', '#CC0C3A', '#FFF0F4', '#FF8FA8'],
  tas: ['#008344', '#FFFFFF', '#008344', '#EAF7F1', '#60C69A'],
  act: ['#472D8C', '#FFFFFF', '#472D8C', '#F2EEFA', '#C9B8F0'],
  nt: ['#E88700', '#32105A', '#965000', '#FFF2DF', '#E88700'],
}
export const siteBranding = Object.freeze(
  Object.fromEntries(
    Object.entries(palette).map(
      ([id, [accent, accentInk, accentDark, accentSoft, accentDisplay]]) => [
        id,
        Object.freeze({ accent, accentInk, accentDark, accentSoft, accentDisplay }),
      ]
    )
  )
)
export function getSiteBranding(siteId) {
  if (!Object.hasOwn(siteBranding, siteId)) throw new Error('Unknown site branding')
  return siteBranding[siteId]
}
