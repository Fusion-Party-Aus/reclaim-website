/* global process, console */
/* eslint-disable no-console */
/**
 * Populates cost/funding fields on policy documents, sourced from
 * docs/policy/POLICY_LIBRARY_REFERENCE.md, docs/policy/Democratic Civic Access
 * Framework DCAF.md, and docs/policy/Democratic Participation Party Principles
 * Statement June 2026.md.
 *
 * Deliberately skips: Abolish Preference Deals, Build the Melton Line,
 * Communities Set Policy — no clean source figure found in docs/policy/.
 *
 * Run: node scripts/migration/add-policy-costings.js
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.resolve(__dirname, '../../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim()
      const val = trimmed.substring(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key && !process.env[key]) process.env[key] = val
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

const updates = [
  {
    id: 'policy-ban-corporate-fundraisers',
    cost: '$0',
    funding:
      'No expenditure required. Implements the DCAF rule barring corporations, multinationals, and major foundations from donating directly to candidates — donations must go to the Democratic Campaign Equalisation Trust instead — plus the requirement that at least 50% of seats at any donor-funded event go to community representatives.',
  },
  {
    id: 'policy-count-your-volunteer-hours',
    cost: '$0 direct budget cost',
    funding:
      "Not government expenditure — funded through the Democratic Campaign Equalisation Trust's matching pool (capitalised by capped donations: $500/individual, $2,000/local business, $5,000/community org annually). Volunteer hours convert to Participation Credits at twice minimum wage (e.g. $25/hr minimum wage → $50 credit/hour), which unlock Trust matching at ratios up to 3:1. No cash is paid to volunteers.",
  },
  {
    id: 'policy-citizens-in-every-room',
    cost: '$0',
    funding:
      "No expenditure required. Mandates at least 50% community-representative seating at any donor-funded access event, bans private/exclusive lobbying, and funds the community seats from the donor's own contribution — not new public money.",
  },
  {
    id: 'policy-nothing-without-the-people',
    cost: '$0',
    funding:
      "No expenditure required — this is the party's governing test applied across all policy and decision-making, not a program with its own budget line.",
  },
  {
    id: 'policy-build-the-sovereign-fund',
    cost: '$0 to general government (off-balance-sheet)',
    funding:
      "Financed via the Victorian Wealth & Housing Fund's own asset-backed Social Infrastructure Bonds and a retail Victorian Savings Bond deposit channel, ring-fenced from general government net debt. A mature fund plausibly reaches a $100–250B asset base, generating $2.0–7.5B/year in distributable surplus.",
  },
  {
    id: 'policy-pay-every-victorian',
    cost: '$0 to general government',
    funding:
      "Paid only from the VWHF's own post-debt-service surplus, never from consolidated revenue. Starts narrow — VWHF tenants and precinct businesses — at an estimated $112–418/week per person, scaling toward a wider base as the portfolio matures. A universal $800/week for all Victorians is a long-term north star, not a first-term commitment.",
  },
  {
    id: 'policy-fix-transit-deserts',
    cost: '~$197M/yr funding gap to close (VAGO estimate), inside a $10B+ backlog',
    funding:
      "Closed through Transit Capital Fund revenue — car park and land-banking surcharges, plus a prospective employer transport levy — rather than general revenue, addressing the recurrent bus-service funding gap VAGO's Bus Plan audit confirms is worsening.",
  },
  {
    id: 'policy-fund-the-outer-suburbs',
    cost: '$0 net new tax',
    funding:
      "Layers a Transit Development District (Tax Increment Financing) overlay on top of the existing Growth Areas Infrastructure Contribution, which already raises around $225M/year. The overlay captures the ongoing year-on-year growth in property and payroll tax above a frozen baseline for 20–30 years to fund growth-area transit specifically.",
  },
  {
    id: 'policy-audit-southern-cross',
    cost: '$0',
    funding:
      "Letting the Civic Nexus contract lapse naturally ends the CPI-indexed Core Service Payment while capturing an estimated $28M/year in retail, parking, and advertising revenue that currently goes to Civic Nexus — with no increase in general government spending.",
  },
  {
    id: 'policy-unmask-transurban-s-discount',
    cost: '$0',
    funding:
      "Consumer-scrutiny and disclosure only — no costed fiscal mechanism. Highlights Transurban/Linkt's 26c/litre fuel discount, which requires 10 toll trips to unlock, as an example of monopoly rent-seeking under the CityLink concession.",
  },
  {
    id: 'drafts.policy-unmask-transurban-s-discount',
    cost: '$0 in scrutiny cost',
    funding:
      "Uses the proposed PPP Renegotiation Unit's existing step-in and termination rights rather than paying early-termination compensation. Targets value in Transurban's CityLink concession, which has cleared roughly $2M/day since at least 2018.",
  },
  {
    id: 'policy-expose-the-tunnel-deal',
    cost: '$0',
    funding:
      "Scrutiny and disclosure only — the Cross Yarra Partnership agreement runs to around 2050 and early modification would likely trigger compensation exceeding any gain, so this is a PAEC transparency push on availability payments, not a claw-back, alongside directing land-value uplift near the five new stations into the VWHF now.",
  },
  {
    id: 'policy-build-housing-at-stations',
    cost: '$0 to general government (VWHF-financed)',
    funding:
      "30,000 mixed-income homes over 5 years, scaling to 100,000–180,000 over 2–3 decades, funded through the VWHF's asset-backed Social Infrastructure Bonds — ring-fenced from general government net debt — plus mandatory inclusionary zoning offset by density and height bonuses for developers.",
  },
  {
    id: 'policy-charge-the-car-parks',
    cost: '$0 (revenue-raising surcharge, not an expenditure)',
    funding:
      "A cumulative surcharge on commercial surface car parks and single-use sites within 1km of stations, starting at 2% of unimproved land value and rising 2 percentage points a year to 20% by year 10. Revenue flows into the Transit Capital Fund.",
  },
  {
    id: 'policy-take-back-public-assets',
    cost: '$0',
    funding:
      "Runs existing contracts (Metro Trains, Yarra Trams, bus operators, PPP road and rail concessions) out to natural expiry rather than paying early-termination compensation, using a standing PPP Renegotiation Unit to audit for step-in and termination value as part of the wider Transport Efficiency Audit.",
  },
]

async function run() {
  for (const { id, cost, funding } of updates) {
    try {
      const result = await client.patch(id).set({ cost, funding }).commit()
      console.log(`  ✅ Updated ${id} (${result._id})`)
    } catch (error) {
      console.error(`  ❌ Failed ${id}: ${error.message}`)
    }
  }
  console.log('\n✨ Policy costings import complete!')
}

run().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
