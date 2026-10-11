import { loadEnv } from 'vite'
import { resolveDeployment } from './config/deployment.mjs'
import { branchManifest } from './config/branches.mjs'
import { resolveBranch } from './config/branch/resolver.mjs'
import { resolveDeployConfig } from './config/branch/deploy.mjs'
import { resolveBuildTarget } from './config/deployment-target.mjs'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import { agentsSummary } from '@nuasite/agent-summary'
import icon from 'astro-icon'
import cloudflare from '@astrojs/cloudflare'
import node from '@astrojs/node'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import { fileURLToPath } from 'node:url'

const env = {
  ...loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''),
  ...process.env,
}
const deployment = resolveDeployment(env)
const isDev = process.env.NODE_ENV !== 'production'
const buildTarget = resolveBuildTarget(
  env,
  resolveDeployConfig(resolveBranch(branchManifest, env), env)
)

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || deployment.siteUrl,
  integrations: [
    icon({
      include: {
        mdi: ['*'], // Include all Material Design Icons
      },
    }),
    agentsSummary(),

    react(),
    sanity({
      projectId: deployment.projectId,
      dataset: deployment.dataset,
      // Keep Astro's Sanity integration consistent with src/lib/sanity.ts.
      useCdn: false,
      stega: {
        studioUrl: process.env.PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333',
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'astro-icon/components': fileURLToPath(
          new URL('./src/components/ui/Icon.ts', import.meta.url)
        ),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  // Use node adapter locally (avoids Miniflare "module is not defined" errors),
  // switch to cloudflare for production builds.
  adapter: isDev
    ? node({ mode: 'standalone' })
    : (() => {
        return cloudflare({
          // Brand icons use native sharp during prerendering, which requires Node.
          prerenderEnvironment: 'node',
          imageService: 'passthrough',
          configPath: buildTarget.wranglerConfigPath,
          platformProxy: { enabled: false },
        })
      })(),
  output: 'server',
  outDir: buildTarget.outputDirectory,
})
