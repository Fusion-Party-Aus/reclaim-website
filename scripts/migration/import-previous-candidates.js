/* global process, console */
/* eslint-disable no-console */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN,
})

// ─── Helper: slugify ───────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── 2025 Federal Election candidates ─────────────────────────────────────────
// These are current/active candidates — isArchived is NOT set (defaults to false).
// Senate candidates include their ticket position in `subtitle`.
// Slug format: 2025-federal-{candidate-slug}-{electorate-slug}

const candidates = [
  // ── Senate ────────────────────────────────────────────────────────────────
  {
    candidateName: 'Tamara Alderdice',
    name: 'Senate (WA)',
    house: 'upper',
    subtitle: 'Senate Ticket #2',
  },
  {
    candidateName: 'Andrew Potts',
    name: 'Senate (NSW)',
    house: 'upper',
    subtitle: 'Senate Ticket #2',
  },
  {
    candidateName: 'Frank Jordan',
    name: 'Senate (QLD)',
    house: 'upper',
    subtitle: 'Senate Ticket #2',
  },
  {
    candidateName: 'Kammy Cordner-Hunt',
    name: 'Senate (VIC)',
    house: 'upper',
    subtitle: 'Senate Ticket #1',
  },
  {
    candidateName: 'Drew Wolfendale',
    name: 'Senate (SA)',
    house: 'upper',
    subtitle: 'Senate Ticket #2',
  },
  {
    candidateName: 'Chris Simpson',
    name: 'Senate (QLD)',
    house: 'upper',
    subtitle: 'Senate Ticket #1',
  },
  {
    candidateName: 'Miles Whiticker',
    name: 'Senate (NSW)',
    house: 'upper',
    subtitle: 'Senate Ticket #1',
  },
  {
    candidateName: 'Tian Carrie-Wilson',
    name: 'Senate (WA)',
    house: 'upper',
    subtitle: 'Senate Ticket #1',
  },
  {
    candidateName: 'Imelda Adamson Agars',
    name: 'Senate (SA)',
    house: 'upper',
    subtitle: 'Senate Ticket #1',
  },

  // ── House of Representatives ──────────────────────────────────────────────
  {
    candidateName: 'Edward Palmer',
    name: 'Macarthur (NSW)',
    house: 'lower',
  },
  {
    candidateName: 'Gina Masterton',
    name: 'Ryan (QLD)',
    house: 'lower',
  },
  {
    candidateName: 'Rachael Blackwood',
    name: 'Brisbane (QLD)',
    house: 'lower',
  },
  {
    candidateName: 'Matthew McMillan',
    name: 'Adelaide (SA)',
    house: 'lower',
  },
  {
    candidateName: 'Geoffrey Marlow',
    name: 'Cowper (NSW)',
    house: 'lower',
  },
  {
    candidateName: 'Erin McGrath',
    name: 'McEwen (VIC)',
    house: 'lower',
  },
  {
    candidateName: 'Helen Huang',
    name: 'Melbourne (VIC)',
    house: 'lower',
  },
  {
    candidateName: 'Andrew Gatley',
    name: 'Dunkley (VIC)',
    house: 'lower',
  },
  {
    candidateName: 'John August',
    name: 'Bennelong (NSW)',
    house: 'lower',
  },
  {
    candidateName: 'Adrien Aloe',
    name: 'Hindmarsh (SA)',
    house: 'lower',
  },
  {
    candidateName: 'Brendan Clarke',
    name: 'Berowra (NSW)',
    house: 'lower',
  },
  {
    candidateName: 'Owen Miller',
    name: 'Wills (VIC)',
    house: 'lower',
  },
]

// ─── Import logic ──────────────────────────────────────────────────────────────

async function importCandidates() {
  console.log('🚀 Starting import of 2025 Federal Election candidates to Sanity...\n')
  console.log(`📋 Total candidates to import: ${candidates.length}\n`)

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set')
    console.error('\nTo get a write token:')
    console.error('1. Go to https://www.sanity.io/manage')
    console.error('2. Select your project (fusion)')
    console.error('3. Go to API → Tokens')
    console.error('4. Create a new token with Editor permissions')
    console.error(
      '5. Run: SANITY_WRITE_TOKEN=your_token_here npm run import:previous-candidates\n',
    )
    process.exit(1)
  }

  let successCount = 0
  let errorCount = 0

  for (const candidate of candidates) {
    const candidateSlug = slugify(candidate.candidateName)
    const electorateSlug = slugify(candidate.name)
    const slug = `2025-federal-${candidateSlug}-${electorateSlug}`

    const document = {
      _type: 'electorate',
      name: candidate.name,
      slug: { _type: 'slug', current: slug },
      house: candidate.house,
      candidateName: candidate.candidateName,
      electionGrouping: '2025 Federal Election',
      isArchived: true,
      ...(candidate.subtitle ? { subtitle: candidate.subtitle } : {}),
    }

    try {
      const result = await client.create(document)
      console.log(`✅ ${candidate.candidateName} – ${candidate.name}`)
      console.log(`   ID: ${result._id}`)
      successCount++
    } catch (error) {
      console.error(`❌ Error: ${candidate.candidateName} – ${candidate.name}`)
      console.error(`   ${error.message}`)
      errorCount++
    }
  }

  console.log('\n─────────────────────────────────────────')
  console.log(`✨ Import complete!`)
  console.log(`   ✅ Successful: ${successCount}`)
  if (errorCount > 0) {
    console.log(`   ❌ Failed:     ${errorCount}`)
  }
  console.log('\nNext steps:')
  console.log('1. Visit your Sanity Studio (npm run dev:sanity) to review the records')
  console.log('2. Add candidate photos and bios via the studio')
  console.log('3. Add How To Vote tickets as needed\n')
}

importCandidates()
