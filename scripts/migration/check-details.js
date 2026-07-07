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
const policies = await client.fetch(`*[_type == "policy"] | order(_id asc) { _id, title, designRationale, economicLogic, implementationOutline, pillar, category }`)
console.log(`Total policies: ${policies.length}\n`)
policies.forEach(p => {
  const hasDetail = p.designRationale || p.economicLogic || p.implementationOutline
  console.log(`${hasDetail ? '✅' : '❌'} ${p._id}`)
})
