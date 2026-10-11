import { createClient } from '@sanity/client'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import type { Site } from '../../config/sites.mjs'
import type { OAuthStateStore } from './oauth-flow'
import { issuePreviewSession, safePreviewReturnPath } from './preview-session'

export const PREVIEW_SESSION_COOKIE = '__Host-fusion-preview-session'
export const PREVIEW_BROWSER_COOKIE = '__Host-fusion-preview-browser'
export const PREVIEW_LIFETIME_SECONDS = 1800
export interface PreviewValidationResult {
  isValid: boolean
  redirectTo?: string
}
export interface PreviewAuthOptions {
  token?: string
  signingKey?: string
  store?: OAuthStateStore
  now?: number
  validate?: (site: Site, url: URL, token: string) => Promise<PreviewValidationResult>
}
async function validateSanityHandshake(
  site: Site,
  url: URL,
  token: string
): Promise<PreviewValidationResult> {
  const client = createClient({
    projectId: site.cms.projectId,
    dataset: site.cms.dataset,
    apiVersion: '2025-02-19',
    token,
    useCdn: false,
    perspective: 'published',
  })
  const validatedUrl = new URL('/api/preview/enable', site.canonicalOrigin)
  validatedUrl.searchParams.set(
    'sanity-preview-secret',
    url.searchParams.get('sanity-preview-secret') ?? ''
  )
  validatedUrl.searchParams.set(
    'sanity-preview-pathname',
    safePreviewReturnPath(url.searchParams.get('sanity-preview-pathname') ?? undefined)
  )
  const result = await validatePreviewUrl(client, validatedUrl.href)
  if (!result.isValid) return { isValid: false }
  // Shared-access secrets have no expiry and cannot satisfy a short-lived one-use handshake.
  const privateSecret = await client.withConfig({ perspective: 'raw' }).fetch<{
    _id: string
  } | null>(`*[_type == "sanity.previewUrlSecret" && secret == $secret && dateTime(_updatedAt) > dateTime(now()) - 3600][0]{_id}`, { secret: url.searchParams.get('sanity-preview-secret') })
  return privateSecret ? result : { isValid: false }
}
function randomBrowser() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (value) =>
    value.toString(16).padStart(2, '0')
  ).join('')
}
export async function authenticatePreview(site: Site, url: URL, options: PreviewAuthOptions) {
  const secret = url.searchParams.get('sanity-preview-secret')
  if (!secret || secret.length > 1024) throw new Error('Preview secret is required')
  if (!options.token || !options.signingKey || !options.store)
    throw new Error('Preview credentials and atomic replay store are required')
  const now = options.now ?? Date.now()
  const validation = await (options.validate ?? validateSanityHandshake)(site, url, options.token)
  if (!validation.isValid) throw new Error('Invalid preview handshake')
  const browser = randomBrowser()
  const session = await issuePreviewSession(
    { siteId: site.siteId, browser, now },
    options.signingKey
  )
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`preview:${site.siteId}:${secret}`)
  )
  const state = Array.from(new Uint8Array(digest), (value) =>
    value.toString(16).padStart(2, '0')
  ).join('')
  if (
    !(await options.store.issue({
      state,
      siteId: site.siteId,
      session: browser,
      expiresAt: now + 3660_000,
    }))
  )
    throw new Error('Preview handshake replay rejected')
  return { session, browser, returnPath: safePreviewReturnPath(validation.redirectTo) }
}
