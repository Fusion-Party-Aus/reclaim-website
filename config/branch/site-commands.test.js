import { describe, expect, it } from 'vitest'
import { branchRuntimeEnvironment } from '../../scripts/branch/runtime-environment.mjs'

describe('branch command Site selection', () => {
  it.each(['vic', 'qld'])('binds %s commands to the explicitly selected Site', (branch) => {
    expect(branchRuntimeEnvironment({ SITE_ID: 'wrong-site' }, branch)).toEqual({
      SITE_ID: branch,
      SITE_RUNTIME_MODE: 'production',
    })
  })
  it('requires development mode for the local dev command', () => {
    expect(branchRuntimeEnvironment({}, 'qld', ['npx', 'astro', 'dev'])).toEqual({
      SITE_ID: 'qld',
      SITE_RUNTIME_MODE: 'development',
    })
  })
  it('retains an explicit configured preview mode', () => {
    expect(branchRuntimeEnvironment({ SITE_RUNTIME_MODE: 'preview' }, 'vic')).toEqual({
      SITE_ID: 'vic',
      SITE_RUNTIME_MODE: 'preview',
    })
  })
})
