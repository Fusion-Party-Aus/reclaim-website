/**
 * Branch-agnostic framework — singleton document registry.
 *
 * The `_type` values the site reads as single documents. This is the one place
 * the set is declared: `provisionBranch` iterates it and `buildStarterContent`
 * emits one document per entry, so adding a singleton is a data-only change.
 *
 * Derived from the singleton queries in `src/lib/sanity.ts` and the fixed
 * document IDs in `studio/sanity.config.ts` (homePage, navigation, footer,
 * siteConfig). See architecture_blueprint.md §3.1 and system_diagram.mmd.
 *
 * Frozen: consumers must not mutate the registry.
 */
export const SINGLETON_TYPES = Object.freeze(['homePage', 'navigation', 'footer', 'siteConfig'])
