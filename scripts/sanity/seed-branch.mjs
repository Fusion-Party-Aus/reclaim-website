import { createClient } from '@sanity/client'
import { resolveDeployment } from '../../config/deployment.mjs'
import { starterContent } from '../../config/starter-content.mjs'

try {
  const deployment = resolveDeployment(process.env)
  if (deployment.slug === 'vic') throw new Error('Starter content is for new branches only')
  const documents = starterContent(deployment)
  if (!process.argv.includes('--write')) {
    console.log(
      JSON.stringify(
        { projectId: deployment.projectId, dataset: deployment.dataset, documents },
        null,
        2
      )
    )
  } else {
    const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
    if (!token) throw new Error('Set SANITY_WRITE_TOKEN or SANITY_AUTH_TOKEN')
    const client = createClient({
      projectId: deployment.projectId,
      dataset: deployment.dataset,
      token,
      apiVersion: '2024-01-29',
      useCdn: false,
    })
    let transaction = client.transaction()
    for (const document of documents) transaction = transaction.createIfNotExists(document)
    await transaction.commit()
    console.log(
      `Created missing starter documents in ${deployment.dataset}; existing content preserved.`
    )
  }
} catch (error) {
  console.error(`Sanity operation failed: ${error.statusCode || error.code || error.message}`)
  process.exitCode = 1
}
