import process from 'node:process'
import {branchManifest} from '../config/branches.mjs'
import {resolveBranch} from '../config/branch/resolver.mjs'
import {defineCliConfig} from 'sanity/cli'

const resolved = resolveBranch(branchManifest, {
  SANITY_STUDIO_BRANCH: process.env.SANITY_STUDIO_BRANCH,
  SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
  SANITY_STUDIO_APP_ID: process.env.SANITY_STUDIO_APP_ID,
})

export default defineCliConfig({
  api: {
    projectId: resolved.sanity.projectId,
    dataset: resolved.sanity.dataset,
  },
  deployment: {
    appId: resolved.sanity.studioAppId,
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
})
