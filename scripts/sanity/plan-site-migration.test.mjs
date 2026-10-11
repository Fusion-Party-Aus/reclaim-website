// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { planSiteMigration, runMigrationPlanner } from './plan-site-migration.mjs'

const sources = [
  {
    siteId: 'vic',
    dataset: 'production',
    backupPath: '/backups/vic.ndjson',
    documents: [
      {
        _id: 'same',
        _type: 'policy',
        slug: { current: 'same' },
        child: { _ref: 'child' },
        image: { asset: { _ref: 'image-abc-100x100-png' } },
      },
      { _id: 'child', _type: 'researchResource' },
      { _id: 'drafts.same', _type: 'policy' },
      {
        _id: 'image-abc-100x100-png',
        _type: 'sanity.imageAsset',
        url: 'https://cdn.sanity.io/images/project/production/abc-100x100.png',
      },
    ],
  },
  {
    siteId: 'qld',
    dataset: 'qld',
    backupPath: '/backups/qld.ndjson',
    documents: [{ _id: 'same', _type: 'policy' }],
  },
]
const owners = Object.fromEntries(
  sources.flatMap((source) =>
    source.documents
      .filter((doc) => !doc._type.startsWith('sanity.'))
      .map((doc) => [`${source.dataset}:${doc._id}`, { type: 'branch', branchId: source.siteId }])
  )
)
const input = {
  sources,
  reviewedOwners: owners,
  referenceDeclarations: { policy: { child: true } },
}

describe('offline shared CMS migration plan', () => {
  it('is deterministic, preserves sources/drafts, remaps collisions and references and retains assets', () => {
    const snapshot = JSON.stringify(sources)
    const result = planSiteMigration(input)
    expect(result.report.ready).toBe(true)
    expect(planSiteMigration(input).ndjson).toBe(result.ndjson)
    expect(JSON.stringify(sources)).toBe(snapshot)
    const docs = result.mutations.map((entry) => entry.createOrReplace)
    expect(docs.find((doc) => doc._id === 'vic__same').child._ref).toBe('vic__child')
    expect(docs.some((doc) => doc._id === 'drafts.vic__same')).toBe(true)
    expect(docs.some((doc) => doc._id === 'qld__same')).toBe(true)
    expect(docs.find((doc) => doc._id === 'vic__same').image.asset._ref).toBe(
      'image-abc-100x100-png'
    )
    expect(result.report.assets[0].sourceUrl).toContain('/production/')
    expect(result.rollback).toEqual({
      vic: { dataset: 'production', backupPath: '/backups/vic.ndjson' },
      qld: { dataset: 'qld', backupPath: '/backups/qld.ndjson' },
    })
  })
  it('blocks unresolved ownership without inferring it from a source dataset', () => {
    const result = planSiteMigration({ ...input, reviewedOwners: {} })
    expect(result.report.ready).toBe(false)
    expect(result.report.issues.some((issue) => issue.code === 'unresolved-owner')).toBe(true)
    expect(result.mutations).toEqual([])
  })
  it('blocks invalid publication scopes and unavailable or undeclared references', () => {
    expect(
      planSiteMigration({ ...input, approvedSharing: { 'production:same': ['unknown'] } }).report
        .ready
    ).toBe(false)
    expect(
      planSiteMigration({
        ...input,
        approvedSharing: { 'production:same': ['vic', 'qld'] },
      }).report.issues.some((issue) => issue.code === 'required-reference-unavailable')
    ).toBe(true)
    expect(
      planSiteMigration({ ...input, referenceDeclarations: {} }).report.issues.some(
        (issue) => issue.code === 'undeclared-reference'
      )
    ).toBe(true)
  })
  it('requires retained export paths and reports missing reference targets', () => {
    const broken = structuredClone(sources)
    broken[0].backupPath = ''
    broken[0].documents[0].child._ref = 'missing'
    const result = planSiteMigration({ ...input, sources: broken })
    expect(result.report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['missing-backup', 'missing-reference'])
    )
    expect(result.report.ready).toBe(false)
  })
})

it('reads retained NDJSON backups and writes review artifacts without rewriting sources or replacing reviews', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fusion-migration-plan-'))
  try {
    const backups = sources.map((source) => {
      const backupPath = `${source.siteId}.ndjson`
      fs.writeFileSync(
        path.join(root, backupPath),
        source.documents.map((doc) => JSON.stringify(doc)).join('\n')
      )
      return { siteId: source.siteId, dataset: source.dataset, backupPath }
    })
    const inputPath = path.join(root, 'review.json')
    fs.writeFileSync(inputPath, JSON.stringify({ ...input, sources: backups }))
    const before = fs.readFileSync(path.join(root, 'vic.ndjson'), 'utf8')
    const output = path.join(root, 'output')
    const result = runMigrationPlanner(['--input', inputPath, '--output', output])
    expect(result.report.ready).toBe(true)
    expect(fs.readFileSync(path.join(root, 'vic.ndjson'), 'utf8')).toBe(before)
    expect(fs.readFileSync(path.join(output, 'mutations.ndjson'), 'utf8')).toBe(result.ndjson)
    expect(() => runMigrationPlanner(['--input', inputPath, '--output', output])).toThrow()
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

it('blocks unapproved cross-project references instead of silently reassigning them', () => {
  const crossProject = structuredClone(sources)
  crossProject[0].documents[0].child._projectId = 'unapproved-project'
  const result = planSiteMigration({ ...input, sources: crossProject })
  expect(result.report.issues.map((issue) => issue.code)).toContain(
    'unapproved-cross-project-reference'
  )
  expect(result.mutations).toEqual([])
})
