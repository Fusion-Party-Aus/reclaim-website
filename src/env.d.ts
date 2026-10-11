/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare namespace App {
  interface Locals {
    preview: boolean
    siteContext: import('./lib/site-context').SiteContext
  }
}

interface ImportMetaEnv {
  readonly SITE_ID?: string
  readonly SITE_RUNTIME_MODE?: 'production' | 'development' | 'preview'
  /** Branch theme slug for this deployment (see config/deployment.mjs). Defaults to 'vic'. */
  readonly PUBLIC_BRANCH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
