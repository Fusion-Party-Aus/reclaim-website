import type { Site } from '../../config/sites.mjs'
import { createContentService, type ContentOptions } from './content'

export function createSiteContext(site: Site, options: ContentOptions = {}) {
  if (!site.cms) throw new Error('Content Site required')
  return Object.freeze({
    site,
    deployment: site.deployment,
    content: createContentService(site, options),
  })
}
export type SiteContext = ReturnType<typeof createSiteContext>
