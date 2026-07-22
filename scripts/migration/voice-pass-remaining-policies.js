/* global process, console */
/* eslint-disable no-console */
/**
 * Voice-rule cleanup for the remaining pre-existing policies (everything not touched
 * by voice-pass-batch1.js). Removes em dashes and the "--" ASCII substitute, replacing
 * with periods, commas, or colons depending on the sentence. Flattens one "not X but Y"
 * rhetorical construction. Fetches current field values and does targeted string
 * replacement rather than re-typing whole fields, so only the flagged spans change.
 *
 * Run: node scripts/migration/voice-pass-remaining-policies.js
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

// Each entry: docId -> { fieldPath: [[oldSubstring, newSubstring], ...] }
// fieldPath supports dot notation for nested fields (proofStat.label)
const edits = {
  'policy-abolish-preference-deals': {
    'proofStat.label': [
      [
        'Primary vote that won a federal Senate seat via preference harvesting in 2013 -- the same mechanism Victorian upper house rules still permit',
        'Primary vote that won a federal Senate seat via preference harvesting in 2013, the same mechanism Victorian upper house rules still permit',
      ],
    ],
  },
  'policy-audit-southern-cross': {
    villain: [
      [
        'Retail rents, advertising revenue, commercial income — all of it flows to the operator',
        'Retail rents, advertising revenue, commercial income: all of it flows to the operator',
      ],
    ],
    seoDescription: [
      ['flowing to the private operator — and take it back.', 'flowing to the private operator, and take it back.'],
    ],
    funding: [
      [
        'that currently goes to Civic Nexus — with no increase in general government spending.',
        'that currently goes to Civic Nexus, with no increase in general government spending.',
      ],
    ],
  },
  'policy-audit-the-fake-surplus': {
    'proofStat.label': [
      [
        'One-off lottery licence payment propping up the 2026-27 surplus — locked in for 42 years',
        'One-off lottery licence payment propping up the 2026-27 surplus, locked in for 42 years',
      ],
    ],
  },
  'policy-ban-corporate-fundraisers': {
    'proofStat.label': [
      [
        'Cost of a corporate table at major-party fundraising events — private access to ministers included',
        'Cost of a corporate table at major-party fundraising events, private access to ministers included',
      ],
    ],
    funding: [
      [
        'from donating directly to candidates — donations must go to the Democratic Campaign Equalisation Trust instead — plus the requirement',
        'from donating directly to candidates (donations must go to the Democratic Campaign Equalisation Trust instead), plus the requirement',
      ],
    ],
    villain: [
      [
        'What gets discussed, what is asked for, what is agreed to — none of it is required to be disclosed.',
        'What gets discussed, what is asked for, what is agreed to: none of it is required to be disclosed.',
      ],
    ],
  },
  'policy-build-housing-at-stations': {
    hook: [
      [
        'five underground Metro Tunnel stations -- then left the precincts',
        'five underground Metro Tunnel stations, then left the precincts',
      ],
    ],
    funding: [
      [
        'ring-fenced from general government net debt — plus mandatory inclusionary zoning',
        'ring-fenced from general government net debt, plus mandatory inclusionary zoning',
      ],
    ],
    'proofStat.label': [
      [
        'New Metro Tunnel underground stations opened under a 25-year private PPP — precinct revenue not yet secured for public benefit',
        'New Metro Tunnel underground stations opened under a 25-year private PPP, precinct revenue not yet secured for public benefit',
      ],
    ],
    shareableQuote: [
      [
        "We should own what's above them — and the income they generate.",
        "We should own what's above them, and the income they generate.",
      ],
    ],
    villain: [
      [
        'The retail and commercial precincts above them — built on public land — risk following the Southern Cross playbook: private operators collect the long-term commercial revenue while the public carries the infrastructure debt.',
        'The retail and commercial precincts above them, built on public land, risk following the Southern Cross playbook: private operators collect the long-term commercial revenue while the public carries the infrastructure debt.',
      ],
    ],
  },
  'policy-build-the-sovereign-fund': {
    'proofStat.label': [
      [
        'Of Victorian lottery revenue sold to a private operator — gone until 2068',
        'Of Victorian lottery revenue sold to a private operator, gone until 2068',
      ],
    ],
  },
  'policy-charge-the-car-parks': {
    hook: [
      [
        'some of the most valuable land in Victoria — holding it idle as a revenue stream',
        'some of the most valuable land in Victoria, holding it idle as a revenue stream',
      ],
    ],
    villain: [
      [
        'A compounding annual surcharge — rising every year the site stays single-use — makes land-banking more expensive',
        'A compounding annual surcharge, rising every year the site stays single-use, makes land-banking more expensive',
      ],
    ],
    shareableQuote: [
      [
        'you pay for the privilege — and the levy funds transit for people',
        'you pay for the privilege, and the levy funds transit for people',
      ],
    ],
  },
  'policy-citizens-in-every-room': {
    funding: [
      [
        "funds the community seats from the donor's own contribution — not new public money.",
        "funds the community seats from the donor's own contribution, not new public money.",
      ],
    ],
  },
  'policy-claw-back-franchise-profits': {
    funding: [['N/A — the policy generates recovery, not expenditure.', 'N/A. The policy generates recovery, not expenditure.']],
    'proofStat.label': [
      [
        'Combined annual franchise payments to Metro Trains Melbourne and Yarra Trams -- the payment base from which any efficiency saving is drawn',
        'Combined annual franchise payments to Metro Trains Melbourne and Yarra Trams, the payment base from which any efficiency saving is drawn',
      ],
    ],
  },
  'policy-count-your-volunteer-hours': {
    funding: [["Not government expenditure — funded through", "Not government expenditure. Funded through"]],
    villain: [
      [
        'So companies can run de facto campaign operations — seconded staff, in-kind logistics, data support — without any of it appearing in disclosures.',
        'So companies can run de facto campaign operations (seconded staff, in-kind logistics, data support) without any of it appearing in disclosures.',
      ],
    ],
    seoDescription: [
      [
        "Victorian electoral law doesn't require disclosure of in-kind volunteer labour — allowing corporations to fund campaigns through seconded staff.",
        "Victorian electoral law doesn't require disclosure of in-kind volunteer labour, allowing corporations to fund campaigns through seconded staff.",
      ],
    ],
  },
  'policy-expose-the-tunnel-deal': {
    funding: [['Scrutiny and disclosure only — the Cross Yarra Partnership', 'Scrutiny and disclosure only. The Cross Yarra Partnership']],
    'proofStat.label': [
      [
        "Year the CityLink toll monopoly finally expires — locked in a secret contract you can't read",
        "Year the CityLink toll monopoly finally expires, locked in a secret contract you can't read",
      ],
    ],
    seoDescription: [
      [
        'Fusion Party Victoria will declassify and publish all toll road agreements — so voters can see what the state committed to.',
        'Fusion Party Victoria will declassify and publish all toll road agreements, so voters can see what the state committed to.',
      ],
    ],
    villain: [
      [
        'The toll escalation formulas, the traffic volume guarantees, the state liability clauses — all of it is locked behind commercial-in-confidence rules.',
        'The toll escalation formulas, the traffic volume guarantees, the state liability clauses: all of it is locked behind commercial-in-confidence rules.',
      ],
    ],
  },
  'policy-fix-transit-deserts': {
    designRationale: [
      [
        'across large sections of their footprint — the same pattern repeats in Casey',
        'across large sections of their footprint. The same pattern repeats in Casey',
      ],
    ],
    hook: [
      [
        "They're not choosing to drive — the state has left them with no alternative.",
        "They're not choosing to drive. The state has left them with no alternative.",
      ],
    ],
    funding: [
      [
        'Closed through Transit Capital Fund revenue — car park and land-banking surcharges, plus a prospective employer transport levy — rather than general revenue',
        'Closed through Transit Capital Fund revenue (car park and land-banking surcharges, plus a prospective employer transport levy) rather than general revenue',
      ],
    ],
    shareableQuote: [
      [
        "We'll build that first — with dedicated lanes so it actually runs on time.",
        "We'll build that first, with dedicated lanes so it actually runs on time.",
      ],
    ],
    villain: [
      [
        'Outer suburban growth corridors — Wyndham, Melton, Casey, Cardinia — get bus routes',
        'Outer suburban growth corridors (Wyndham, Melton, Casey, Cardinia) get bus routes',
      ],
    ],
  },
  'policy-fund-the-outer-suburbs': {
    shareableQuote: [
      [
        "We'll fund where the people are — 30% of the major project budget directed to outer suburbs.",
        "We'll fund where the people are: 30% of the major project budget directed to outer suburbs.",
      ],
    ],
  },
  'policy-nothing-without-the-people': {
    funding: [
      [
        "No expenditure required — this is the party's governing test",
        "No expenditure required. This is the party's governing test",
      ],
    ],
    'proofStat.label': [
      [
        'Of lottery revenue committed to a private operator — with no public consultation required',
        'Of lottery revenue committed to a private operator, with no public consultation required',
      ],
    ],
  },
  'policy-pay-every-victorian': {
    hook: [
      [
        'Almost none of it comes back to the Victorians who built it — it flows to shareholders and private operators.',
        'Almost none of it comes back to the Victorians who built it. It flows to shareholders and private operators.',
      ],
    ],
    funding: [
      [
        'Starts narrow — VWHF tenants and precinct businesses — at an estimated $112–418/week per person',
        'Starts narrow, with VWHF tenants and precinct businesses, at an estimated $112–418/week per person',
      ],
    ],
    shareableQuote: [
      [
        'Victorians can receive one from the assets they already own — once we stop giving the income away.',
        'Victorians can receive one from the assets they already own, once we stop giving the income away.',
      ],
    ],
    villain: [
      [
        'The state owns the land and carries the debt — the operators collect the income.',
        'The state owns the land and carries the debt. The operators collect the income.',
      ],
    ],
  },
  'policy-smooth-the-pension-cliff': {
    villain: [
      [
        'in unfunded defined-benefit super liability — a legacy obligation to public servants',
        'in unfunded defined-benefit super liability, a legacy obligation to public servants',
      ],
      [
        'smooth the amortisation schedule to 2041 — reducing near-term debt issuance',
        'smooth the amortisation schedule to 2041, reducing near-term debt issuance',
      ],
    ],
  },
  'policy-tax-the-land-windfalls': {
    hook: [
      [
        'The land values around the new stations increased — not because the owners did anything, but because the state built a train underneath.',
        "The land values around the new stations increased, not because the owners did anything, but because the state built a train underneath.",
      ],
    ],
    villain: [
      [
        'That mechanism — not a one-off rezoning windfall but an indefinitely deferred one — is what this policy closes.',
        'That mechanism, an ongoing deferred windfall rather than a one-off rezoning gain, is what this policy closes.',
      ],
    ],
    designRationale: [
      [
        'taper band — stronger than any new proposal needs to invent.',
        'taper band, stronger than any new proposal needs to invent.',
      ],
    ],
    systemInteraction: [
      [
        "Those instruments don't interact with the surcharge — they fire at different events.",
        "Those instruments don't interact with the surcharge. They fire at different events.",
      ],
    ],
    economicLogic: [
      [
        'A compounding structure — rather than a flat levy — is the key design choice.',
        'A compounding structure, rather than a flat levy, is the key design choice.',
      ],
    ],
    riskAndFailureModes: [
      [
        'land currently held idle suppresses supply more directly — the surcharge makes holding cost punitive enough to force a decision.',
        'land currently held idle suppresses supply more directly. The surcharge makes holding cost punitive enough to force a decision.',
      ],
    ],
    evidenceAndPrecedent: [
      [
        "came from property rather than fares — a direct consequence of capturing the uplift the infrastructure itself created.",
        "came from property rather than fares, a direct consequence of capturing the uplift the infrastructure itself created.",
      ],
      [
        'growth trajectory of a precinct — the same gap the surcharge is targeting here.',
        'growth trajectory of a precinct, the same gap the surcharge is targeting here.',
      ],
    ],
    summary: [
      [
        'Victoria already has a Windfall Gains Tax — up to 50% on rezoning uplift',
        'Victoria already has a Windfall Gains Tax: up to 50% on rezoning uplift',
      ],
    ],
  },
  'policy-unmask-transurban-s-discount': {
    funding: [
      [
        'Consumer-scrutiny and disclosure only — no costed fiscal mechanism.',
        'Consumer-scrutiny and disclosure only. No costed fiscal mechanism.',
      ],
    ],
    'proofStat.label': [
      [
        "CityLink's daily toll take — set by a monopoly operator under a contract running to 2045",
        "CityLink's daily toll take, set by a monopoly operator under a contract running to 2045",
      ],
    ],
  },
}

function getPath(obj, fieldPath) {
  return fieldPath.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}

function setPath(obj, fieldPath, value) {
  const parts = fieldPath.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
  cur[parts[parts.length - 1]] = value
}

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN not set')
    process.exit(1)
  }

  for (const [docId, fields] of Object.entries(edits)) {
    try {
      const doc = await client.getDocument(docId)
      if (!doc) {
        console.log(`⚠️  Not found: ${docId}`)
        continue
      }

      const patch = {}
      for (const [fieldPath, replacements] of Object.entries(fields)) {
        let value = getPath(doc, fieldPath)
        if (typeof value !== 'string') {
          console.log(`⚠️  ${docId}.${fieldPath}: not a string or missing, skipping`)
          continue
        }
        let changed = false
        for (const [oldStr, newStr] of replacements) {
          if (value.includes(oldStr)) {
            value = value.replace(oldStr, newStr)
            changed = true
          } else {
            console.log(`⚠️  ${docId}.${fieldPath}: old string not found verbatim:\n   "${oldStr}"`)
          }
        }
        if (changed) {
          // proofStat is an object field; patch the whole object to avoid path-based set issues
          if (fieldPath.startsWith('proofStat.')) {
            patch.proofStat = { ...doc.proofStat, [fieldPath.split('.')[1]]: value }
          } else {
            patch[fieldPath] = value
          }
        }
      }

      if (Object.keys(patch).length > 0) {
        await client.patch(docId).set(patch).commit()
        console.log(`✅ Updated: ${docId} (${Object.keys(patch).join(', ')})`)
      } else {
        console.log(`— No changes needed: ${docId}`)
      }
    } catch (err) {
      console.error(`❌ ${docId}: ${err.message}`)
    }
  }
}

run()
