import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { approvedSiteRoster } from '../../config/site-roster.mjs'
import { validOwner, validatePublicationChange } from '../../src/lib/publication-rules.ts'

const isAsset = (doc) => ['sanity.imageAsset', 'sanity.fileAsset'].includes(doc._type)
const assetId = (id) => /^(?:image|file)-/.test(id)
const stable = (value) =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, stable(value[key])])
        )
      : value
const sourceKey = (dataset, id) => `${dataset}:${id}`
const destinationId = (siteId, id) =>
  id.startsWith('drafts.') ? `drafts.${siteId}__${id.slice(7)}` : `${siteId}__${id}`

/** Pure non-destructive planner. Inputs are exports, reviewed owner/scope maps and schema reference declarations. */
export function planSiteMigration({
  sources,
  reviewedOwners = {},
  approvedSharing = {},
  referenceDeclarations = {},
  singletonTypes = [],
}) {
  const issues = []
  const ids = new Map()
  const assets = []
  const rollback = {}
  const sorted = [...sources].sort((a, b) => a.siteId.localeCompare(b.siteId))
  for (const source of sorted) {
    if (!Object.hasOwn(approvedSiteRoster, source.siteId) || !source.dataset)
      issues.push({ code: 'invalid-source', siteId: source.siteId })
    if (!source.backupPath) issues.push({ code: 'missing-backup', siteId: source.siteId })
    if (rollback[source.siteId])
      issues.push({ code: 'duplicate-source-site', siteId: source.siteId })
    rollback[source.siteId] = { dataset: source.dataset, backupPath: source.backupPath }
    for (const doc of source.documents) {
      const key = sourceKey(source.dataset, doc._id)
      if (ids.has(key)) issues.push({ code: 'duplicate-source-id', source: key })
      ids.set(key, isAsset(doc) ? doc._id : destinationId(source.siteId, doc._id))
      if (isAsset(doc))
        assets.push({
          source: key,
          destinationId: doc._id,
          sourceUrl: doc.url ?? null,
          type: doc._type,
        })
    }
  }
  const proposals = []
  const graph = []
  const reconciliation = []
  for (const source of sorted) {
    for (const original of [...source.documents].sort((a, b) => a._id.localeCompare(b._id))) {
      if (isAsset(original)) continue
      const key = sourceKey(source.dataset, original._id)
      const owner = reviewedOwners[key]
      if (!validOwner(owner)) {
        issues.push({ code: 'unresolved-owner', source: key })
        continue
      }
      const doc = structuredClone(original)
      doc._id = ids.get(key)
      delete doc._rev
      doc.owner = structuredClone(owner)
      doc.siteIds = [...(approvedSharing[key] ?? [source.siteId])].sort()
      const references = []
      function remap(value, fieldPath = '') {
        if (!value || typeof value !== 'object') return
        if (Array.isArray(value)) {
          for (const item of value) remap(item, `${fieldPath}[]`)
          return
        }
        if (typeof value._ref === 'string') {
          if (value._projectId && value._projectId !== source.projectId)
            issues.push({
              code: 'unapproved-cross-project-reference',
              source: key,
              path: fieldPath,
            })
          const targetSource = sourceKey(value._dataset ?? source.dataset, value._ref)
          const target = ids.get(targetSource)
          if (!target)
            issues.push({
              code: 'missing-reference',
              source: key,
              path: fieldPath,
              target: targetSource,
            })
          else {
            value._ref = target
            // References now address one destination dataset.
            delete value._dataset
            delete value._projectId
          }
          if (!assetId(value._ref)) {
            const required = referenceDeclarations[original._type]?.[fieldPath]
            if (typeof required !== 'boolean')
              issues.push({ code: 'undeclared-reference', source: key, path: fieldPath })
            else references.push({ key: fieldPath, targetId: target ?? value._ref, required })
          }
        }
        for (const [field, child] of Object.entries(value))
          if (!field.startsWith('_')) remap(child, fieldPath ? `${fieldPath}.${field}` : field)
      }
      remap(doc)
      const node = {
        id: doc._id,
        published: !doc._id.startsWith('drafts.'),
        owner: doc.owner,
        siteIds: doc.siteIds,
        singleton: singletonTypes.includes(doc._type),
        slug: doc.slug?.current,
        references,
      }
      graph.push(node)
      proposals.push({ createOrReplace: doc })
      reconciliation.push({
        source: key,
        destinationId: doc._id,
        owner: doc.owner,
        siteIds: doc.siteIds,
        references,
      })
    }
  }
  for (const after of graph) issues.push(...validatePublicationChange({ after, documents: graph }))
  proposals.sort((a, b) => a.createOrReplace._id.localeCompare(b.createOrReplace._id))
  const mutations = issues.length ? [] : proposals.map(stable)
  return {
    mutations,
    ndjson:
      mutations.map((entry) => JSON.stringify(entry)).join('\n') + (mutations.length ? '\n' : ''),
    report: {
      ready: issues.length === 0,
      issues,
      sourceDocumentCount: sorted.reduce((count, source) => count + source.documents.length, 0),
      editorialDocumentCount: graph.length,
      proposedMutationCount: mutations.length,
      assets,
      reconciliation,
    },
    rollback,
  }
}

/** CLI reads explicit retained exports and writes review artifacts only; no CMS or network adapter exists. */
export function runMigrationPlanner(args) {
  const options = new Map()
  for (let index = 0; index < args.length; index += 2) {
    if (!['--input', '--output'].includes(args[index]) || !args[index + 1])
      throw new Error('Usage: --input reviewed-plan.json [--output new-review-directory]')
    options.set(args[index], args[index + 1])
  }
  if (!options.has('--input')) throw new Error('--input is required')
  const inputPath = path.resolve(options.get('--input'))
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  input.sources = input.sources.map((source) => {
    const backupPath = path.resolve(path.dirname(inputPath), source.backupPath)
    const documents = fs
      .readFileSync(backupPath, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))
    return { ...source, backupPath, documents }
  })
  const result = planSiteMigration(input)
  if (options.has('--output')) {
    const output = path.resolve(options.get('--output'))
    fs.mkdirSync(output, { recursive: false })
    fs.writeFileSync(path.join(output, 'mutations.ndjson'), result.ndjson, { flag: 'wx' })
    fs.writeFileSync(
      path.join(output, 'reconciliation.json'),
      JSON.stringify(result.report, null, 2) + '\n',
      { flag: 'wx' }
    )
    fs.writeFileSync(
      path.join(output, 'rollback.json'),
      JSON.stringify(result.rollback, null, 2) + '\n',
      { flag: 'wx' }
    )
  }
  return result
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = runMigrationPlanner(process.argv.slice(2))
    console.log(JSON.stringify(result.report, null, 2))
    process.exitCode = result.report.ready ? 0 : 1
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
