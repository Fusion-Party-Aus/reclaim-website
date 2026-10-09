import { describe, expect, it } from 'vitest'
import { buildBranchInfo } from './branch.json'
import { resolveDeployment } from '../../../config/deployment.mjs'

describe('/api/branch.json', () => {
  it('returns public QLD jurisdiction and catalogue metadata without private config', () => {
    const branch = buildBranchInfo(resolveDeployment({ PUBLIC_BRANCH: 'qld' }))
    expect(branch).toEqual({
      slug: 'qld',
      label: 'Fusion Party Queensland',
      state: 'Queensland',
      jurisdiction: 'Queensland, Australia',
      canonicalUrl: 'https://qld.fusionparty.org.au',
      tagline: 'A better future for Queensland',
      socialAccounts: [],
      policyUrl: 'https://qld.fusionparty.org.au/policies',
      policyApiUrl: 'https://qld.fusionparty.org.au/api/policies.json',
    })
    expect(JSON.stringify(branch)).not.toContain('projectId')
    expect(JSON.stringify(branch)).not.toContain('dataset')
  })
})
