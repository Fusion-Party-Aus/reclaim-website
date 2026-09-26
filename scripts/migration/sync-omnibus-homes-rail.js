/* global process, console */
/**
 * Read-only verification for the omnibus-led CMS reconciliation.
 * The initial PR #12 migration proposed replacing whole policy sections with
 * unadopted research and did not cover vision, index metadata or proof stats.
 * The six revisions were instead read, patched with revision guards and
 * published through the authorised Sanity connection. Keep this as a drift
 * check; never replay old copy against a newer CMS revision.
 *
 * Run: node scripts/migration/sync-omnibus-homes-rail.js
 */
import { createClient } from '@sanity/client'

if (process.argv.includes('--apply')) {
  throw new Error('This audit is read-only. Review current CMS revisions before any further edit.')
}
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'qwl3f8jb',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-13',
  useCdn: false,
  perspective: 'published',
})
const ids = [
  'policy-build-housing-at-stations',
  'policy-claw-back-franchise-profits',
  'policy-take-back-public-assets',
  'policy-abolish-preference-deals',
  'visionPage',
  'ecbaJWLxgJ3RQQWE55BWiZ',
]
const documents = await client.fetch(
  '*[_id in $ids]{_id,_rev,title,summary,cost,proofStat,proofStats,manifesto,seoDescription}',
  { ids },
)
for (const id of ids) {
  const doc = documents.find((item) => item._id === id)
  if (!doc) throw new Error(`Missing published document: ${id}`)
  console.log(JSON.stringify(doc))
}
console.log('Read-only verification complete. Inspect the published pages after deployment.')
