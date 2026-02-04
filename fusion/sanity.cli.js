import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'qwl3f8jb',
    dataset: 'production',
  },
  deployment: {
    appId: 'b1vkw1bmcrkhlb4no5vyzdlg',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
})
