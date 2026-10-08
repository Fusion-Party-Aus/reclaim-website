/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  /** Branch theme slug for this deployment (see config/deployment.mjs). Defaults to 'vic'. */
  readonly PUBLIC_BRANCH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
