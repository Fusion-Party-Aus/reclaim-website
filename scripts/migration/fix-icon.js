/* eslint-disable */
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
    const [key, value] = line.split('=')
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value.trim()
    }
  })
}

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN
})

async function fixIcon () {
  console.log('🚀 Fixing invalid icon in Sanity...\\n')

  const fixes = [
    { from: 'mdi:train-fast', to: 'mdi:train-variant' },
    { from: 'mdi:cash-search', to: 'mdi:magnify' }, // Expose Political Donations
  ]

  for (const fix of fixes) {
    try {
      const query = `*[_type == "policy" && icon == "${fix.from}"][0]`
      const policy = await client.fetch(query)

      if (policy) {
        console.log(`Found policy: ${policy.title} with invalid icon ${fix.from}`)

        await client
          .patch(policy._id)
          .set({ icon: fix.to })
          .commit()

        console.log(`✅ Updated icon from ${fix.from} to ${fix.to}`)
      } else {
         console.log(`✅ No policy found for ${fix.from}`)
      }
    } catch (err) {
      console.error(`Error fixing ${fix.from}:`, err.message)
    }
  }
}

fixIcon()
