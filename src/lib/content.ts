import { createClient, type ClientConfig } from '@sanity/client'
import type { Site } from '../../config/sites.mjs'
import { bindContentService } from './content-service'

export interface ContentClient {
  fetch<T = any>(query: string, params?: Record<string, unknown>): Promise<T>
}
export interface ContentOptions {
  clientFactory?: (config: ClientConfig) => ContentClient
}

/** Public content is always published. Credentials and perspective overrides are not accepted. */
export function createContentService(site: Site, options: ContentOptions = {}) {
  const client = (options.clientFactory ?? createClient)({
    projectId: site.cms.projectId,
    dataset: site.cms.dataset,
    apiVersion: '2024-01-29',
    useCdn: false,
    perspective: 'published',
    stega: { enabled: false },
  })
  return bindContentService(site, client)
}
export type ContentService = ReturnType<typeof createContentService>
