import { describe, expect, it, vi } from 'vitest'
import { branchManifest } from '../../config/branches.mjs'
import { deployBranch } from './deploy-branch.mjs'

function commandRunner(buildStatus = 0) {
  const runCommand = vi.fn((_command, _args, options) => ({
    status: options.env.BRANCH === 'build-failure' ? 1 : buildStatus,
  }))
  return runCommand
}

describe('deployBranch', () => {
  it.each(['vic', 'qld'])('builds and deploys the manifest-selected %s config', (slug) => {
    const runCommand = commandRunner()
    const status = deployBranch({ env: { BRANCH: slug }, runCommand })
    const entry = branchManifest.branches[slug]

    expect(status).toBe(0)
    expect(runCommand).toHaveBeenCalledTimes(2)
    expect(runCommand.mock.calls[0][0]).toBe('npm')
    expect(runCommand.mock.calls[0][1]).toEqual(['run', 'build:branch'])
    expect(runCommand.mock.calls[0][2].env).toMatchObject({
      BRANCH: slug,
      PUBLIC_BRANCH: slug,
      PUBLIC_SANITY_DATASET: entry.sanity.dataset,
    })
    expect(runCommand.mock.calls[1][0]).toBe('npx')
    expect(runCommand.mock.calls[1][1]).toEqual([
      'wrangler',
      'deploy',
      '--config',
      expect.stringMatching(new RegExp(`${entry.deploy.wranglerConfig.replace('.', '\\.')}$$`)),
    ])
    expect(runCommand.mock.calls[1][2].shell).toBe(false)
  })

  it('uses the manifest default when no branch environment variable is set', () => {
    const runCommand = commandRunner()
    deployBranch({ env: {}, runCommand })
    expect(runCommand.mock.calls[0][2].env.BRANCH).toBe(branchManifest.defaultBranch)
  })

  it('does not deploy when the build fails and propagates its status', () => {
    const runCommand = vi.fn(() => ({ status: 23 }))
    expect(deployBranch({ env: { BRANCH: 'vic' }, runCommand })).toBe(23)
    expect(runCommand).toHaveBeenCalledTimes(1)
  })

  it('passes --dry-run only when requested, without invoking a shell', () => {
    const runCommand = commandRunner()
    deployBranch({ env: { BRANCH: 'qld' }, args: ['--dry-run'], runCommand })
    expect(runCommand.mock.calls[1][1]).toContain('--dry-run')
    expect(runCommand.mock.calls.every(([, , options]) => options.shell === false)).toBe(true)

    const regularRun = commandRunner()
    deployBranch({ env: { BRANCH: 'vic' }, runCommand: regularRun })
    expect(regularRun.mock.calls[1][1]).not.toContain('--dry-run')
  })
})
