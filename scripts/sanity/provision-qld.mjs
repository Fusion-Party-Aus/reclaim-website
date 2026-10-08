import { createClient } from '@sanity/client'
import { resolveDeployment } from '../../config/deployment.mjs'
import { starterContent } from '../../config/starter-content.mjs'

try {
  const deployment = resolveDeployment({
    ...process.env,
    PUBLIC_BRANCH: 'qld',
    PUBLIC_SANITY_DATASET: 'qld',
  })
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (!token) throw new Error('Set SANITY_WRITE_TOKEN or SANITY_AUTH_TOKEN')
  const client = createClient({
    projectId: deployment.projectId,
    dataset: 'qld',
    token,
    apiVersion: '2024-01-29',
    useCdn: false,
    timeout: 30000,
  })
  const datasets = await client.datasets.list()
  if (!datasets.some(({ name }) => name === 'qld')) {
    await client.datasets.create('qld', { aclMode: 'public' })
    console.log('Created public qld dataset')
  } else {
    console.log('qld dataset already exists')
  }
  let transaction = client.transaction()
  for (const document of starterContent(deployment))
    transaction = transaction.createIfNotExists(document)
  await transaction.commit()
  console.log('Seeded missing Queensland starter content; existing documents preserved')
  console.log('Dataset document count:', await client.fetch('count(*)'))
} catch (error) {
  console.error(`Sanity operation failed: ${error.statusCode || error.code || error.message}`)
  process.exitCode = 1
}
