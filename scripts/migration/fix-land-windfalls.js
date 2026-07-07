/* global process, console */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../../.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach((line) => {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const k = line.slice(0, eq).trim()
      const v = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
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

// The actual policy:
// Victoria's Windfall Gains Tax (WGT, introduced 2023) already taxes rezoning uplift at up to 50%
// (62.5% effective marginal in the $100k-$500k taper band). The proposal is NOT to increase that rate.
//
// The WGT's gap: it only triggers at the moment of rezoning or sale. Land already zoned for higher
// density, within 1km of a station, can sit idle indefinitely — the owner pays nothing while the
// land appreciates because the state just spent billions on rail infrastructure nearby.
//
// The actual policy: a compounding Anti-Land-Banking Surface Car Park Tax on commercial surface
// car parks within 1km of a station. The surcharge rises every year the site stays single-use.
// Build something, sell to someone who will, or pay the compounding levy. Revenue hypothecated
// to a Transit Capital Fund that finances station-precinct infrastructure.

const patch = {
  // Campaign voice fields
  hook: "Victoria spent $11 billion building the Metro Tunnel. The land values around the new stations increased — not because the owners did anything, but because the state built a train underneath. The Windfall Gains Tax covers the moment of rezoning. It does nothing about land that's already zoned and just sitting there, appreciating while the owner waits.",

  villain: "The Windfall Gains Tax, introduced in 2023, taxes the uplift from rezoning at up to 50%. That's already stronger than any new proposal this side of Labor needs to invent. The gap isn't the rate — it's what the tax doesn't reach. Land that's already zoned for higher density, within a kilometre of a station the state just spent billions upgrading, can be left as a surface car park indefinitely. Waiting costs the owner nothing. The land appreciates regardless. That mechanism — not a one-off rezoning windfall but an indefinitely deferred one — is what this policy closes. A compounding surcharge on commercial surface car parks near stations, rising every year the site stays single-use, makes waiting expensive. Build something, sell to someone who will, or pay. The revenue goes into a Transit Capital Fund that finances the precinct infrastructure those sites are free-riding on.",

  proofStat: {
    number: '$11B',
    label: 'Public money spent building Metro Tunnel — land value uplift around stations pocketed privately',
    source: 'Victorian Budget; Infrastructure Victoria Metro Tunnel cost tracking',
  },

  shareableQuote: "The Windfall Gains Tax covers rezoning. It doesn't cover waiting. A car park next to a new station can sit there for thirty years, appreciating on the public's investment, and pay nothing. We're fixing that.",

  // Detail fields
  designRationale: "Victoria's Windfall Gains Tax already taxes rezoning uplift at up to 50%, with an effective marginal rate of 62.5% in the $100,000–$500,000 taper band — stronger than any new proposal needs to invent. Proposing to 'increase it to 75%' would be weaker than existing law, and handing opponents the line that Fusion's land reform is less ambitious than something Labor already legislated.\n\nThe actual gap is what the WGT doesn't touch: land already zoned for higher density, sitting within a kilometre of a station, where the owner simply declines to develop or sell. Waiting costs nothing. The land appreciates on the back of public rail investment, indefinitely and untaxed beyond the one-off WGT trigger at the moment of eventual sale or rezoning.\n\nThe Anti-Land-Banking Surface Car Park Tax closes that gap specifically. A compounding annual surcharge on commercial surface car parks and single-use commercial sites within 1km of a station, rising each year the site stays undeveloped, makes indefinite deferral economically irrational. Build mixed-use, sell to someone who will, or pay a levy that grows every year you hold out.",

  systemInteraction: "The surcharge sits alongside the existing WGT and Growth Areas Infrastructure Contribution (GAIC, $115,530–$137,230/hectare), which capture one-off value at the moment of rezoning. Those instruments don't interact with the surcharge — they fire at different events.\n\nAdministration sits with the State Revenue Office, using existing commercial property registers to identify eligible sites within the station-radius zones. The radius and rate schedule are set by regulation, allowing per-corridor adjustment without primary legislation each time.\n\nRevenue is hypothecated directly to a Transit Capital Fund — a statutory vehicle separate from the Consolidated Fund — which finances station-precinct infrastructure (active frontages, public realm, vertical connections) for the same corridors generating the surcharge income. That hypothecation closes the loop: the levy is paid because of the station; the fund spends it on the station.",

  economicLogic: "Land value uplift near transit infrastructure is a well-documented phenomenon. The state spends the capital, the landowner captures the appreciation. The WGT captures a portion at one point in time. The surcharge captures a portion of the carrying cost of non-development every year.\n\nA compounding structure — rather than a flat levy — is the key design choice. A flat fee can be absorbed as a cost of ownership. A compounding fee makes the net present value of indefinite deferral negative within a calculable number of years, tipping the decision toward development or sale without the state needing to compulsorily acquire anything.\n\nThe Growth Areas Infrastructure Contribution raises roughly $225 million a year. The surcharge revenue, concentrated around high-value station precincts, targets a narrower and more valuable land class. A conservative modelling of Melbourne CBD and inner-ring station corridors suggests material annual revenue once the mechanism is established, though a formal PBO costing is needed before a budget figure is published.",

  riskAndFailureModes: "Developer and property industry lobbying against the surcharge will be significant. The primary argument will be that it suppresses supply by making land acquisition more expensive for developers. The answer is that land currently held idle suppresses supply more directly — the surcharge makes holding cost punitive enough to force a decision.\n\nThe compounding rate schedule needs to be set carefully. Too low and it's absorbed as a carrying cost. Too high and it triggers fire sales that distort the market in ways that don't produce the precinct outcomes the Transit Capital Fund is designed to deliver. The rate requires modelling against actual site-level economics before legislation, not after.\n\nCouncil resistance to the development it triggers is a separate risk. Zoning a site doesn't prevent a council from obstructing the development application. The state's Development Facilitation Program (DFP) fast-track powers need to be available as a backstop for Transit Capital Fund priority precincts to ensure the surcharge actually produces buildings.",

  evidenceAndPrecedent: "Hong Kong's MTR Corporation captures land value uplift through direct property development rights over station-adjacent sites, priced at pre-rail values. By the mid-2010s, roughly 40% of MTR's total revenue came from property rather than fares — a direct consequence of capturing the uplift the infrastructure itself created. VWHF's Rail+Property mandate follows the same logic applied to station-adjacent public land.\n\nSingapore's Land Value Capture framework uses development charges on rezoning and a statutory land-acquisition power to ensure public infrastructure investment doesn't simply transfer into private hands. The mechanism differs from the surcharge, but the principle is identical: the state captures a portion of the value it created.\n\nThe UK Community Infrastructure Levy and Infrastructure Contributions Plans (ICPs) in Victoria already capture one-off contributions at the point of development approval. Transit Value Capture Zones (called Tax Increment Financing or TIF Districts in the US) extend that capture across the multi-year growth trajectory of a precinct — the same gap the surcharge is targeting here. Chicago's TIF program generated over $1 billion annually at its peak across major transit corridors.",

  implementationOutline: "This requires primary legislation to establish the surcharge, define the eligibility criteria (site type, distance from station, current use), set the compounding rate schedule, and create the Transit Capital Fund as a statutory hypothecation vehicle.\n\nA Fusion MP cannot pass that legislation from a single upper house seat. The crossbench role is to force the question into the budget debate: introduce a Private Member's Bill with the full legislative design on the record, commission a PBO costing of the surcharge revenue and Transit Capital Fund spend, and use PAEC hearings to require Treasury to table its own modelling of the land-banking problem the WGT doesn't reach.\n\nThe political framing for those hearings: every year a commercial surface car park sits within 500 metres of a Metro Tunnel station, the state is paying the interest on $11 billion of infrastructure while the car park owner banks the appreciation. The question on notice is: what is Treasury's estimate of the annual unearned uplift on undeveloped, station-adjacent commercial land in Melbourne's inner and middle ring?",
}

async function run() {
  const existing = await client.getDocument('policy-tax-the-land-windfalls')
  if (!existing) {
    console.error('❌ policy-tax-the-land-windfalls not found')
    process.exit(1)
  }
  await client.patch('policy-tax-the-land-windfalls').set(patch).commit()
  console.log('✅ policy-tax-the-land-windfalls updated')
}

run()
