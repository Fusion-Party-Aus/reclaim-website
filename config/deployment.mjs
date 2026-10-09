/**
 * Deployment facade.
 *
 * The branch manifest (`config/branches.mjs`) is the single source of truth.
 * This module is a thin compatibility adapter: it resolves the requested
 * Branch through the fail-closed `resolveBranch` and maps the resulting
 * descriptor into the exact `Deployment` object shape that components and
 * `astro.config.mjs` consume today.
 *
 * There is no `slug === 'qld'` / `slug === 'vic'` special-casing and no silent
 * fallback: an unknown or incomplete Branch throws from the resolver.
 *
 * See docs/sparc/branch-agnostic/architecture_blueprint.md §5.2 and §9.
 */

import { branchManifest } from './branches.mjs'
import { resolveBranch } from './branch/resolver.mjs'

/** @param {import('./branch/contract.mjs').BranchEntry} entry */
function runtimeView(resolved) {
  const runtime = resolved.runtime
  if (!runtime) {
    throw new Error(
      `Branch '${resolved.identity.slug}' declares no runtime presentation configuration.`
    )
  }
  return runtime
}

/**
 * Runtime branch map derived from the manifest. Retained so
 * `config/deployment.d.mts` keeps typechecking and any legacy consumer keeps
 * working; the values are the manifest's resolved presentation shape.
 */
export const branches = Object.fromEntries(
  Object.entries(branchManifest.branches).map(([slug, entry]) => {
    const resolved = resolveBranch(branchManifest, { PUBLIC_BRANCH: slug })
    const runtime = runtimeView(resolved)
    return [
      slug,
      {
        contentProfile: runtime.contentProfile ?? 'branch-neutral',
        policyCallouts: runtime.policyCallouts ?? {},
        slug: entry.identity.slug,
        state: entry.identity.state,
        adjective: entry.identity.adjective,
        label: entry.identity.label,
        tagline: entry.identity.tagline,
        themeColor: entry.identity.themeColor,
        siteUrl: resolved.canonicalOrigin,
        navigation: runtime.navigation,
        contact: runtime.contact,
        analytics: runtime.analytics,
        socialAccounts: runtime.socialAccounts ?? [],
        assets: resolved.assets.resolved,
        seo: runtime.seo,
        cta: runtime.cta,
        footer: runtime.footer,
      },
    ]
  })
)

/**
 * Resolve the active deployment from the manifest and environment.
 *
 * @param {Record<string, string | boolean | undefined>} [env]
 * @returns {import('./deployment.d.mts').Deployment}
 */
export function resolveDeployment(env = {}) {
  const resolved = resolveBranch(branchManifest, env)
  const runtime = runtimeView(resolved)

  const analytics = {
    ...(resolved.analytics.resolved.enabled
      ? {
          plausibleScriptUrl:
            typeof env.PUBLIC_PLAUSIBLE_SRC === 'string' && env.PUBLIC_PLAUSIBLE_SRC.trim()
              ? env.PUBLIC_PLAUSIBLE_SRC.trim()
              : resolved.analytics.resolved.scriptUrl,
        }
      : {}),
  }

  return {
    contentProfile: runtime.contentProfile ?? 'branch-neutral',
    policyCallouts: runtime.policyCallouts ?? {},
    slug: resolved.identity.slug,
    state: resolved.identity.state,
    adjective: resolved.identity.adjective,
    label: resolved.identity.label,
    tagline: resolved.identity.tagline,
    themeColor: resolved.identity.themeColor,
    themeTokens: resolved.theme.tokens,
    siteUrl: resolved.canonicalOrigin,
    projectId: resolved.sanity.projectId,
    dataset: resolved.sanity.dataset,
    jurisdiction: resolved.jurisdiction,
    description: resolved.description,
    navigation: runtime.navigation,
    contact: runtime.contact,
    analytics,
    socialAccounts: runtime.socialAccounts ?? [],
    assets: resolved.assets.resolved,
    seo: runtime.seo,
    cta: runtime.cta,
    footer: runtime.footer,
  }
}
