import {resolveDeployment} from '../config/deployment.mjs'
const deployment = resolveDeployment({
  SANITY_STUDIO_BRANCH: process.env.SANITY_STUDIO_BRANCH,
  SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
})
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: deployment.projectId,
    dataset: deployment.dataset,
  },
  deployment: {
    ...(process.env.SANITY_STUDIO_APP_ID
      ? {appId: process.env.SANITY_STUDIO_APP_ID}
      : deployment.slug === 'vic'
        ? {appId: 'b1vkw1bmcrkhlb4no5vyzdlg'}
        : {}),
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
})
