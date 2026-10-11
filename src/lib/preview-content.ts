import { createClient } from '@sanity/client'
import type { Site } from '../../config/sites.mjs'
import { bindContentService } from './content-service'
import type { ContentOptions } from './content'

/** Server-only caller must establish authenticated Site/browser preview before constructing this service. */
export function createDraftContentService(site: Site, token: string, options: ContentOptions = {}) {
  if (!token) throw new Error('Authenticated preview read token is required')
  return bindContentService(
    site,
    (options.clientFactory ?? createClient)({
      projectId: site.cms.projectId,
      dataset: site.cms.dataset,
      apiVersion: '2024-01-29',
      useCdn: false,
      perspective: 'drafts',
      token,
      stega: { enabled: false },
    })
  )
}
