/* global process, console */
/* eslint-disable no-console */
/**
 * Fixes AI-y prose in campaign voice fields.
 * Targets: manifesto body/punchline on policiesPage, and the worst hook/villain text on policies.
 *
 * Run: node scripts/migration/fix-campaign-prose.js
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
      const k = trimmed.slice(0, eqIdx).trim()
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (k && !process.env[k]) process.env[k] = v
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

// ─── POLICIES PAGE — manifesto prose ─────────────────────────────────────────

const manifestoFix = {
  manifesto: {
    heading: 'They built the system to take from you.',
    body: 'For thirty years, Victoria borrowed to build infrastructure, then handed the profits to private operators while you carried the debt. Transurban banks around $2M a day from Victorian toll roads. The state sold 42 years of lottery revenue for a one-time payment. Southern Cross Station commercial income goes to a consortium. The West Gate Tunnel extended that toll monopoly to 2045, in exchange for building the tunnel the state is still paying for. Net debt climbs from $175.6B to $199.3B. The operators keep the income. You keep the bill.',
    punchline: 'The fix is below. Every number is sourced.',
  },
}

// ─── PER-POLICY PROSE FIXES ───────────────────────────────────────────────────
// Only touching the worst offenders. Rules applied:
//   - Remove em dash as a connective; use a period or comma instead
//   - Break "X is A. B is C. D is E." list structures
//   - No hollow intensifiers ("genuinely", "truly", "real")
//   - First-person or direct address where it makes the point land harder

const proseFixes = {
  'policy-audit-the-fake-surplus': {
    hook: 'The state government called 2026-27 a surplus year. That surplus is almost exactly the size of a one-off lottery payment. Strip the deal out and the books do not balance.',
    villain:
      "In May 2026, the government sold Tattersall's Sweeps a 42-year extension on Victoria's Public Lottery Licence, out to 2068, for $1.145 billion upfront. The forecast operating surplus is $1.05 billion. The Auditor-General is already reviewing whether the deal got value for money. If it didn't, that surplus disappears, and this year's fiscal achievement is a one-time cash advance dressed up as discipline.",
    shareableQuote:
      "A lottery payout is not a surplus. It's a credit card advance. An independent audit would settle that in about three months.",
  },

  'policy-smooth-the-pension-cliff': {
    hook: "Victoria is legally committed to clearing its entire unfunded superannuation liability by 2035. Meeting that deadline requires the state to find over $2 billion a year in cash from 2027. If the operating budget can't absorb that, it borrows the money. And then pays interest on the borrowing. And then borrows more.",
    villain:
      "The Victorian Government has roughly $17–18 billion in unfunded defined-benefit super liability — a legacy obligation to public servants who served under old super arrangements. A 2035 legislative deadline requires the state to top up that fund aggressively, contributing over $2B a year from 2027 to hit the target. An earlier $3 billion deferral alone added $882.8 million to net debt, according to the Parliamentary Budget Office. Under the current schedule, that pressure escalates every year toward the cliff. We propose amending the State Superannuation Act to smooth the amortisation schedule to 2041 — reducing near-term debt issuance by $1.2–1.5 billion a year at its peak. This does not reduce the underlying liability. It reduces the pace of forced borrowing to fund it.",
    shareableQuote:
      "The state is borrowing money it doesn't need just to hit a self-imposed 2035 deadline. A six-year extension reduces that forced debt issuance by up to $1.5 billion a year. The underlying liability doesn't disappear. The panic does.",
  },

  'policy-claw-back-franchise-profits': {
    hook: 'Train operators get paid whether or not the trains run. There is currently no penalty structure that makes underperformance more expensive than compliance.',
    villain:
      "Metro Trains and Yarra Trams operate on franchise contracts that include guaranteed availability payments from the state. The money flows regardless of service quality. Penalties exist on paper. In practice they are not strong enough to shift the commercial calculus. A windfall levy triggered by service failure changes that: miss the standard, lose the profit.",
    shareableQuote:
      'Public transport operators should earn their money by running public transport. Miss the standard, give it back.',
  },

  'policy-expose-the-tunnel-deal': {
    hook: "The contracts governing how much you pay to use Victorian toll roads are classified. You cannot read them. The liabilities the state accepted on your behalf are commercially confidential.",
    villain:
      "West Gate Tunnel's agreement with Transurban extended CityLink to 2045. The toll escalation formulas, the traffic volume guarantees, the state liability clauses — all of it is locked behind commercial-in-confidence rules. You're paying for these roads. You have no way to know what was agreed. Democratic accountability on infrastructure contracts requires public access to those contracts.",
    shareableQuote:
      'Secret contracts mean secret prices and secret liabilities. Publish them.',
  },

  'policy-audit-southern-cross': {
    hook: "Southern Cross Station is the busiest rail station in Australia. A private consortium has collected its commercial income for over 25 years. You breathe the diesel fumes. They keep the rent.",
    villain:
      "Civic Nexus holds a long-term lease on the station. Retail rents, advertising revenue, commercial income — all of it flows to the operator, not back to the public that owns the building. The diesel particulate problem has been raised in public health reviews for years. The state has limited direct leverage because the contract structure was designed that way. An audit is the first step to changing what can be changed and recovering what can be recovered.",
    shareableQuote:
      'You built that station. You pay to use it. Someone else banks the profits. An audit tells you exactly how much.',
  },

  'policy-unmask-transurban-s-discount': {
    hook: "Transurban is marketing a 26-cent fuel discount as cost-of-living relief. To get it, you need ten toll trips. You pay the monopoly operator more in order to receive the monopoly operator's discount.",
    villain:
      "Transurban holds government-granted monopolies on CityLink and the West Gate Tunnel approaches under contracts that run to 2045. They set the price. They lobbied for the extension. And when the cost-of-living conversation got loud enough, they answered it by designing a loyalty scheme that requires their customers to spend more to save a little. That's not competition. It's marketing dressed as relief.",
    shareableQuote:
      "A monopoly's discount on its own monopoly price is not cost-of-living relief. Expose the contracts. Reset the tolls.",
  },

  'policy-take-back-public-assets': {
    hook: "Privatisation didn't fix Victoria's finances. It changed who collects the rent. The debt stayed with the public. The income went elsewhere.",
    villain:
      "The Kennett government's logic was simple: borrow to build, sell the revenue stream, use the proceeds to clear the debt. It worked for about a decade. Then the debt came back, bigger than before, because the state kept building things and handing the income to private operators. CityLink. The trains. Southern Cross. Metro Tunnel. The state carries the liability on all of them. The operators collect the cash.",
    shareableQuote:
      'Privatisation did not pay down the debt. It just made sure the income stopped coming back.',
  },

  'policy-build-the-sovereign-fund': {
    hook: 'Victoria sold 42 years of lottery revenue for a one-time payment. The money covered one year. The loss of that income will last until 2068.',
    villain:
      "The Tattersall's licence deal is a clean example of what happens when a government needs a number to look good in a budget year. A recurring revenue stream gets converted into an upfront payment. The payment shows up as income this year. The lost income shows up as nothing, because it was always going to someone else anyway. A Sovereign Wealth Fund is the structural answer: income from state assets goes into the fund, not into one year's operating numbers.",
    shareableQuote:
      "Norway saved its oil money. Victoria sold its lottery for a cash hit. A sovereign fund stops the next deal before it's locked in for 42 years.",
  },

  'policy-abolish-preference-deals': {
    hook: "A candidate won a Victorian upper house seat with 0.04% of the primary vote. We are trying to win seats the same way. The difference is that we are telling you that, and we are committing to legislate it out of existence once we're in.",
    villain:
      "Above-the-line voting lets parties lodge preference flows before election day. Voters who tick the box have their vote routed through chains negotiated in back rooms, often by people most voters have never heard of. The result is that parties with tiny primary votes can win seats through preference cascades no voter consented to. We lodged preference deals for exactly this reason. We are not pretending otherwise. The mechanism is broken, and the only way to break it from the inside is to use it to get there. Once we have representation, the first thing we legislate is the thing that got us in. That's the commitment. If you don't trust it, don't vote for us.",
    shareableQuote:
      "Yes, we made preference deals. We are using a broken system to get into the room where we can fix it. Call that hypocrisy if you want. We call it the only path that actually works.",
  },

  'policy-ban-corporate-fundraisers': {
    hook: "You cannot get a private dinner with the Premier. A $10,000 table at a party fundraiser can. The conversation that happens at that table is not recorded. You are not in the room.",
    villain:
      "Cash-for-access events give donors private time with ministers and party leaders outside any public accountability. What gets discussed, what is asked for, what is agreed to — none of it is required to be disclosed. The democratic principle that citizens and corporations have equal access to elected representatives does not survive contact with a four-figure table charge.",
    shareableQuote:
      "Democracy does not have a table charge. Ban paid access to elected representatives.",
  },

  'policy-count-your-volunteer-hours': {
    hook: "A corporation can assign 20 staff to a political campaign for weeks, provide vehicles, infrastructure and printing, and declare zero under current Victorian electoral law.",
    villain:
      "Volunteer hours are not donations under Victorian law. So companies can run de facto campaign operations — seconded staff, in-kind logistics, data support — without any of it appearing in disclosures. Grassroots volunteers show up because they believe in something. Corporate astroturf shows up because a CEO made a call. You cannot tell the difference without a disclosure requirement.",
    shareableQuote:
      'If money buys influence, so does free labour. Count the hours.',
  },

  'policy-citizens-in-every-room': {
    hook: "Major Victorian legislation is drafted by departments, reviewed by cabinet, and voted on by party MPs. The people it affects are not in the room until the next election.",
    villain:
      "Bills are shaped inside departments that respond to lobbying, reviewed by cabinets that respond to donors, and passed by MPs who respond to factional bosses. A Citizens Assembly selected by sortition, given time and independent expert support, breaks that loop. Ireland used them to unlock constitutional deadlocks that had been stuck for decades. The mechanism works. We are not in it.",
    shareableQuote:
      'Put ordinary Victorians in the room. Give them the evidence. They will make better decisions than the people paid not to.',
  },

  'policy-communities-set-policy': {
    hook: "Your suburb's development is decided in Spring Street by people who may never have been there, accountable to no one in your postcode.",
    villain:
      "Planning and local capital budgets are set centrally. Growth corridors don't vote on what gets built. They get told. A participatory budgeting model gives community boards a statutory allocation and a direct vote. Porto Alegre has done it since the late 1980s. Paris does it. The model is not experimental. It just requires giving up central control.",
    shareableQuote:
      "Your neighbourhood knows what it needs better than a department in Spring Street. Give it a budget and a vote.",
  },

  'policy-nothing-without-the-people': {
    hook: "The Victorian government can sell public assets, extend private monopolies for 42 years, and rewrite electoral rules without asking voters once between elections.",
    villain:
      "In May 2026, the state committed lottery revenue to 2068. The CityLink concession was extended to 2045. Both were done by cabinet, within existing parliamentary power, without a referendum. Between elections, voters have no formal mechanism to stop decisions that bind them for decades. A citizen-initiated referendum right changes that. Switzerland has operated this way for over a century. It produces more stable governance, not less.",
    shareableQuote:
      "'Nothing about the people, without the people.' We want to make it law.",
  },
}

// Fix the incorrect proofStat that was set on the pension cliff in the original migration.
// The stat ">50% marginal tax rate faced by pensioners" is fabricated and wrong.
// The correct policy is about state superannuation liability scheduling, not individual income thresholds.
const proofStatFixes = {
  'policy-smooth-the-pension-cliff': {
    proofStat: {
      number: '$2B+/yr',
      label: 'Annual cash the state must find from 2027 just to hit the 2035 super target',
      source: 'Victorian Auditor-General Annual Financial Report; PBO costing of 2024 deferral',
    },
  },
}

async function run() {
  console.log('🔧 Fixing AI-y prose in Sanity...\n')

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN not set')
    process.exit(1)
  }

  // Fix policiesPage manifesto
  console.log('── policiesPage manifesto ──')
  const page = await client.fetch('*[_type == "policiesPage"][0]')
  if (page) {
    await client.patch(page._id).set(manifestoFix).commit()
    console.log('✅ Updated manifesto prose')
  } else {
    console.log('⚠️  policiesPage not found')
  }

  // Fix incorrect proofStats from original migration
  console.log('\n── ProofStat corrections ──')
  for (const [docId, patch] of Object.entries(proofStatFixes)) {
    try {
      const existing = await client.getDocument(docId)
      if (!existing) {
        console.log(`⚠️  Not found: ${docId}`)
        continue
      }
      await client.patch(docId).set(patch).commit()
      console.log(`✏️  proofStat corrected: ${docId.replace('policy-', '')}`)
    } catch (err) {
      console.error(`❌ ${docId}: ${err.message}`)
    }
  }

  // Fix per-policy prose
  console.log('\n── Policy prose fixes ──')
  let ok = 0
  let missing = 0

  for (const [docId, patch] of Object.entries(proseFixes)) {
    try {
      const existing = await client.getDocument(docId)
      if (!existing) {
        console.log(`⚠️  Not found: ${docId}`)
        missing++
        continue
      }
      await client.patch(docId).set(patch).commit()
      console.log(`✏️  ${docId.replace('policy-', '')}`)
      ok++
    } catch (err) {
      console.error(`❌ ${docId}: ${err.message}`)
    }
  }

  console.log('\n─────────────────────────────────────────────')
  console.log('✨ Done!')
  console.log(`   ✅ Fixed: ${ok}`)
  if (missing) console.log(`   ⚠️  Not found: ${missing}`)
}

run()
