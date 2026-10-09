import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { branchManifest } from '../../config/branches.mjs'
import { resolveBranch } from '../../config/branch/resolver.mjs'
import { resolveDeployConfig } from '../../config/branch/deploy.mjs'

const repoRoot = process.cwd()

export function runCommand(command, args, options) {
  const result = spawnSync(command, args, { ...options, shell: false, stdio: 'inherit' })
  return { status: result.status, error: result.error, signal: result.signal }
}

export function deployBranch({
  env = process.env,
  args = [],
  runCommand: execute = runCommand,
  manifest = branchManifest,
} = {}) {
  const dryRun = args.includes('--dry-run')
  const unknownArgs = args.filter((arg) => arg !== '--dry-run')
  if (unknownArgs.length) throw new Error(`Unknown deploy option: ${unknownArgs[0]}`)

  const requestedBranch = env.BRANCH || env.PUBLIC_BRANCH || manifest.defaultBranch
  const branch = resolveBranch(manifest, { ...env, BRANCH: requestedBranch })
  const deployConfig = resolveDeployConfig(branch, env)
  const commandEnv = {
    ...env,
    BRANCH: branch.identity.slug,
    PUBLIC_BRANCH: branch.identity.slug,
    PUBLIC_SANITY_DATASET: branch.sanity.dataset,
  }

  const build = execute('npm', ['run', 'build:branch'], {
    cwd: repoRoot,
    env: commandEnv,
    shell: false,
  })
  if (build?.error)
    throw new Error(`Branch build could not start: ${build.error.message}`, { cause: build.error })
  if (build?.status !== 0) return build?.status ?? 1

  const wranglerArgs = ['wrangler', 'deploy', '--config', deployConfig.wranglerConfigPath]
  if (dryRun) wranglerArgs.push('--dry-run')
  const deployed = execute('npx', wranglerArgs, { cwd: repoRoot, env: commandEnv, shell: false })
  if (deployed?.error)
    throw new Error(`Wrangler deploy could not start: ${deployed.error.message}`, {
      cause: deployed.error,
    })
  return deployed?.status ?? 1
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.join(repoRoot, 'scripts/branch/deploy-branch.mjs')
) {
  try {
    process.exitCode = deployBranch({ args: process.argv.slice(2) })
  } catch (error) {
    console.error(error?.message ?? String(error))
    process.exitCode = 1
  }
}
