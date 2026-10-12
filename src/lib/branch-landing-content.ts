import {
  getBranchBaseContent,
  type SharedBranchBaseContent,
} from '../../config/shared-branch-base.mjs'
import {
  getBranchCityPhotography,
  type BranchCityPhoto,
} from '../../config/branch-city-photography.mjs'

/** Published, site-scoped content. A future CMS adapter must return this shape after validation. */
export interface BranchLandingContent {
  readonly siteId: string
  readonly base: SharedBranchBaseContent
  readonly photography: BranchCityPhoto
}

export function getStaticBranchLandingContent(siteId: string): BranchLandingContent {
  return Object.freeze({
    siteId,
    base: getBranchBaseContent(siteId),
    photography: getBranchCityPhotography(siteId),
  })
}

function assertDestination(value: string, host: string): void {
  const url = new URL(value)
  if (
    url.protocol !== 'https:' ||
    url.hostname !== host ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new Error('Unapproved branch content destination')
  }
}

/** Also enforce scope when a future external adapter bypasses TypeScript's guarantees. */
export function assertBranchLandingContent(siteId: string, content: BranchLandingContent): void {
  if (
    content.siteId !== siteId ||
    content.base.ownerSiteId !== 'national' ||
    !content.base.siteIds.includes(siteId)
  ) {
    throw new Error('Branch landing content scope mismatch')
  }
  for (const href of Object.values(content.base.links))
    assertDestination(href, 'www.fusionparty.org.au')
  for (const value of content.base.values) {
    assertDestination(value.photography.src, 'images.unsplash.com')
    assertDestination(value.photography.creditUrl, 'unsplash.com')
    if (!value.photography.alt.trim() || !value.photography.photographer.trim())
      throw new Error('Missing values photograph description or credit')
  }
  for (const area of content.base.policyAreas) {
    assertDestination(area.href, 'www.fusionparty.org.au')
    assertDestination(area.photography.src, 'images.unsplash.com')
    assertDestination(area.photography.creditUrl, 'unsplash.com')
  }
  assertDestination(content.photography.src, 'images.unsplash.com')
  assertDestination(content.photography.creditUrl, 'unsplash.com')
  if (
    !/^\d+(?:\.\d+)?% \d+(?:\.\d+)?%$/.test(content.photography.position) ||
    content.photography.position.split(' ').some((value) => Number.parseFloat(value) > 100)
  ) {
    throw new Error('Invalid photograph crop position')
  }
}
