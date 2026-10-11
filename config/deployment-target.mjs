import { fileURLToPath } from 'node:url'

export function resolveBuildTarget(env, legacy) {
  if (!env.DEPLOY_TARGET)
    return {
      workerName: legacy.workerName,
      wranglerConfigPath: legacy.wranglerConfigPath,
      outputDirectory: env.ASTRO_BRANCH_BUILD_OUT_DIR || './dist',
    }
  if (env.DEPLOY_TARGET !== 'branch-agnostic-test')
    throw new Error(`Unknown deployment target: ${env.DEPLOY_TARGET}`)
  return {
    workerName: 'branch-agnostic-test',
    wranglerConfigPath: fileURLToPath(
      new URL('../wrangler.branch-agnostic-test.toml', import.meta.url)
    ),
    outputDirectory: './dist-branch-agnostic-test',
  }
}
