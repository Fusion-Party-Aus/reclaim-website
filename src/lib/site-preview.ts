import type { Site } from '../../config/sites.mjs'
import { verifyPreviewSession } from './preview-session'
import { createDraftContentService } from './preview-content'
import type { ContentOptions } from './content'

/** Called only by server middleware; public requests retain their published service. */
export async function authenticatedPreviewContent(
  site: Site,
  session: string | undefined,
  browser: string | undefined,
  settings: { token?: string; signingKey?: string },
  options: ContentOptions = {},
  now = Date.now()
) {
  if (!session || !browser || !settings.token || !settings.signingKey) return undefined
  if (
    !(await verifyPreviewSession(
      session,
      { siteId: site.siteId, browser, now },
      settings.signingKey
    ))
  )
    return undefined
  return createDraftContentService(site, settings.token, options)
}
