import { describe, expect, it, vi } from 'vitest'
import { SINGLETON_TYPES } from '../../config/branch/singletons.mjs'
import { provisionBranchDataset } from './provision-branch.mjs'

function makeAdapter({ datasets = [], documents = [] } = {}) {
  const knownDatasets = new Set(datasets)
  const knownDocuments = new Map(documents.map((document) => [document._id, document]))
  const calls = { list: vi.fn(), createDataset: vi.fn(), seed: vi.fn() }
  return {
    calls,
    adapter: {
      listDatasets: async (projectId) => {
        calls.list(projectId)
        return [...knownDatasets].map((name) => ({ name }))
      },
      createDataset: async (projectId, dataset, acl) => {
        calls.createDataset(projectId, dataset, acl)
        knownDatasets.add(dataset)
      },
      seedSingletons: async (projectId, dataset, docs) => {
        calls.seed(projectId, dataset, docs)
        for (const document of docs)
          if (!knownDocuments.has(document._id)) knownDocuments.set(document._id, document)
      },
      knownDocuments,
    },
  }
}

const validEnv = { BRANCH: 'qld', SANITY_WRITE_TOKEN: 'test-token' }

describe('provisionBranchDataset', () => {
  it('requires a write token before contacting the adapter', async () => {
    const { adapter, calls } = makeAdapter()
    await expect(
      provisionBranchDataset({ env: { BRANCH: 'qld' }, args: ['--acl', 'public'], adapter })
    ).rejects.toThrow('SANITY_WRITE_TOKEN or SANITY_AUTH_TOKEN')
    expect(calls.list).not.toHaveBeenCalled()
    expect(calls.createDataset).not.toHaveBeenCalled()
    expect(calls.seed).not.toHaveBeenCalled()
  })

  it.each([[], ['--acl'], ['--acl', 'shared']])(
    'rejects missing or invalid ACL arguments %j before contacting the adapter',
    async (args) => {
      const { adapter, calls } = makeAdapter()
      await expect(provisionBranchDataset({ env: validEnv, args, adapter })).rejects.toThrow()
      expect(calls.list).not.toHaveBeenCalled()
      expect(calls.createDataset).not.toHaveBeenCalled()
      expect(calls.seed).not.toHaveBeenCalled()
    }
  )

  it('creates the manifest dataset with explicit ACL and seeds every singleton', async () => {
    const { adapter, calls } = makeAdapter()
    const result = await provisionBranchDataset({
      env: validEnv,
      args: ['--acl', 'private'],
      adapter,
      log: vi.fn(),
    })

    expect(result).toMatchObject({
      slug: 'qld',
      projectId: 'qwl3f8jb',
      dataset: 'qld',
      acl: 'private',
    })
    expect(calls.list).toHaveBeenCalledWith('qwl3f8jb')
    expect(calls.createDataset).toHaveBeenCalledWith('qwl3f8jb', 'qld', 'private')
    const [, dataset, docs] = calls.seed.mock.calls[0]
    expect(dataset).toBe('qld')
    expect(docs.map(({ _type }) => _type)).toEqual(SINGLETON_TYPES)
  })

  it('does not recreate an existing dataset and repeated seeding remains create-if-absent', async () => {
    const authoredHome = { _id: 'homePage', _type: 'homePage', title: 'Authored home' }
    const { adapter, calls } = makeAdapter({ datasets: ['qld'], documents: [authoredHome] })
    await provisionBranchDataset({
      env: validEnv,
      args: ['--acl', 'public'],
      adapter,
      log: vi.fn(),
    })
    const seededHome = adapter.knownDocuments.get('homePage')
    await provisionBranchDataset({
      env: validEnv,
      args: ['--acl', 'public'],
      adapter,
      log: vi.fn(),
    })

    expect(calls.createDataset).not.toHaveBeenCalled()
    expect(calls.seed).toHaveBeenCalledTimes(2)
    expect(calls.seed.mock.calls[0][2].map(({ _id }) => _id)).toEqual(SINGLETON_TYPES)
    expect(calls.seed.mock.calls[1][2].map(({ _id }) => _id)).toEqual(SINGLETON_TYPES)
    expect(seededHome).toBe(authoredHome)
    expect(adapter.knownDocuments.get('homePage')).toBe(authoredHome)
    expect([...adapter.knownDocuments.keys()].sort()).toEqual([...SINGLETON_TYPES].sort())
  })

  it('accepts an explicit dataset ACL from the environment', async () => {
    const { adapter, calls } = makeAdapter()
    await provisionBranchDataset({
      env: { ...validEnv, DATASET_ACL: 'public' },
      adapter,
      log: vi.fn(),
    })
    expect(calls.createDataset).toHaveBeenCalledWith('qwl3f8jb', 'qld', 'public')
  })
})
