import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envContent = fs.readFileSync(path.resolve(__dirname, '../../.env'), 'utf-8')
envContent.split('\n').forEach(line => {
  const eq = line.indexOf('=')
  if (eq > 0) {
    const k = line.slice(0, eq).trim()
    const v = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (k && !process.env[k]) process.env[k] = v
  }
})

const client = createClient({ projectId: 'qwl3f8jb', dataset: 'production', useCdn: false, apiVersion: '2024-11-13', token: process.env.SANITY_WRITE_TOKEN })

// Check 3 key policies
const ids = ['policy-smooth-the-pension-cliff', 'policy-audit-southern-cross', 'policy-abolish-preference-deals']
for (const id of ids) {
  const p = await client.getDocument(id)
  console.log(`\n═══ ${id} ═══`)
  console.log(`designRationale: ${p.designRationale?.slice(0, 200)}`)
  console.log(`economicLogic: ${p.economicLogic?.slice(0, 200)}`)
  console.log(`implementationOutline: ${p.implementationOutline?.slice(0, 200)}`)
  console.log(`evidenceAndPrecedent: ${p.evidenceAndPrecedent?.slice(0, 200)}`)
}
