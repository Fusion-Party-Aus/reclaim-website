/* global process, console */
/* eslint-disable no-console */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env file manually
const envPath = path.resolve(__dirname, '../../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) return
    const eqIdx = trimmedLine.indexOf('=')
    if (eqIdx > 0) {
      const key = trimmedLine.substring(0, eqIdx).trim()
      const value = trimmedLine.substring(eqIdx + 1).trim()
      // Remove optional quotes around value
      const cleanValue = value.replace(/^['"]|['"]$/g, '')
      if (key && !process.env[key]) {
        process.env[key] = cleanValue
      }
    }
  })
}

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN,
})

async function deletePolicies() {
  console.log('🚀 Starting deletion of all policies from Sanity...\n')

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set')
    console.error('\nRun: SANITY_WRITE_TOKEN=<token> node scripts/migration/delete-policies.js')
    process.exit(1)
  }

  try {
    // Query all policy documents
    console.log('🔍 Querying policies from dataset...')
    const query = '*[_type == "policy"] { _id, title }'
    const policies = await client.fetch(query)

    if (policies.length === 0) {
      console.log('ℹ️  No policies found in Sanity. Nothing to delete.')
      return
    }

    console.log(`📋 Found ${policies.length} policies to delete.`)

    // Delete policies using a transaction so we can track what was deleted
    const transaction = client.transaction()
    policies.forEach(policy => {
      console.log(`🗑️  Queueing deletion for: "${policy.title}" (${policy._id})`)
      transaction.delete(policy._id)
    })

    console.log('\n⏳ Sending delete transaction to Sanity...')
    await transaction.commit()
    console.log('✨ All policies deleted successfully!')

  } catch (error) {
    console.error('❌ Error deleting policies:', error.message)
    process.exit(1)
  }
}

deletePolicies()
