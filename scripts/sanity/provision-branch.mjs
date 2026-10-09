import { createClient } from '@sanity/client'
import { pathToFileURL } from 'node:url'
import { branchManifest } from '../../config/branches.mjs'
import { resolveBranch } from '../../config/branch/resolver.mjs'
import { SINGLETON_TYPES } from '../../config/branch/singletons.mjs'
import { buildStarterContent } from '../../config/branch/starter-content.mjs'

function parseAcl(args, env) {
  let acl = env.DATASET_ACL
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--acl') {
      acl = args[index + 1]
      index += 1
    } else {
      throw new Error(`Unknown option '${args[index]}'. Use --acl public|private.`)
    }
  }
  if (acl !== 'public' && acl !== 'private') {
    throw new Error('Set DATASET_ACL=public|private or pass --acl public|private.')
  }
  return acl
}

function createSanityAdapter(client) {
  return {
    listDatasets: async (_projectId) => client.datasets.list(),
    createDataset: async (_projectId, dataset, aclMode) =>
      client.datasets.create(dataset, { aclMode }),
    seedSingletons: async (_projectId, _dataset, documents) => {
      let transaction = client.transaction()
      for (const document of documents) transaction = transaction.createIfNotExists(document)
      return transaction.commit()
    },
  }
}

/** Provision a registered branch's manifest dataset and absent singleton documents. */
export async function provisionBranchDataset({
  env = process.env,
  args = [],
  adapter,
  log = console.log,
}) {
  const acl = parseAcl(args, env)
  const token = env.SANITY_WRITE_TOKEN || env.SANITY_AUTH_TOKEN
  if (!token) throw new Error('Set SANITY_WRITE_TOKEN or SANITY_AUTH_TOKEN.')

  const branch = resolveBranch(branchManifest, {
    ...(env.BRANCH ? { BRANCH: env.BRANCH } : {}),
    ...(env.PUBLIC_BRANCH ? { PUBLIC_BRANCH: env.PUBLIC_BRANCH } : {}),
  })
  const { projectId, dataset } = branch.sanity
  const sanity =
    adapter ??
    createSanityAdapter(
      createClient({
        projectId,
        dataset,
        token,
        apiVersion: '2024-01-29',
        useCdn: false,
        timeout: 30000,
      })
    )

  const datasets = await sanity.listDatasets(projectId)
  if (!datasets.some(({ name }) => name === dataset)) {
    await sanity.createDataset(projectId, dataset, acl)
    log(`Created ${acl} ${branch.identity.slug} dataset`)
  } else {
    log(`${branch.identity.slug} dataset already exists`)
  }

  const documents = buildStarterContent(branch)
  if (documents.length !== SINGLETON_TYPES.length) {
    throw new Error('Starter content does not match the registered singleton types.')
  }
  await sanity.seedSingletons(projectId, dataset, documents)
  log(`Seeded missing ${branch.identity.slug} starter content; existing documents preserved`)
  return { slug: branch.identity.slug, projectId, dataset, acl, documents }
}

export async function main(options = {}) {
  try {
    return await provisionBranchDataset({ ...options, args: options.args ?? process.argv.slice(2) })
  } catch (error) {
    console.error(`Sanity operation failed: ${error.statusCode || error.code || error.message}`)
    process.exitCode = 1
    return null
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
