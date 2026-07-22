import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve('.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const t = line.trim()
    if (!t || t.startsWith('#')) return
    const i = t.indexOf('=')
    if (i > 0) {
      const k = t.substring(0,i).trim()
      const v = t.substring(i+1).trim().replace(/^['"]|['"]$/g,'')
      if (k && !process.env[k]) process.env[k] = v
    }
  })
}

const client = createClient({
  projectId: 'qwl3f8jb', dataset: 'production', useCdn: false,
  apiVersion: '2024-11-13', token: process.env.SANITY_WRITE_TOKEN,
})

// "cost" renders as a short punchy headline (card badge + detail-page text-2xl).
// "funding" carries the longer explanation ("Paid for by: ..."). Shorten cost,
// move the nuance into funding where it isn't already covered.

{
  const id = 'policy-no-single-points-of-failure'
  const doc = await client.getDocument(id)
  await client.patch(id).set({
    cost: '$0 to legislate',
    funding: doc.funding, // already covers backup-infra nuance, no change needed
  }).commit()
  console.log('Shortened cost:', id)
}

{
  const id = 'policy-finish-the-network'
  const doc = await client.getDocument(id)
  await client.patch(id).set({
    cost: 'Requires a parliamentary majority',
    funding:
      "Not deliverable from a single crossbench seat. " + doc.funding,
  }).commit()
  console.log('Shortened cost:', id)
}

// Check Build the Melton Line's current cost/funding state
{
  const doc = await client.getDocument('policy-build-the-melton-line')
  console.log('\nBuild the Melton Line — cost:', JSON.stringify(doc.cost), ' funding:', JSON.stringify(doc.funding))
}
