/* global process, console */
/* eslint-disable no-console */
/**
 * Populates Campaign Voice fields on all policy documents and the policiesPage document.
 *
 * Fields added:
 *   policy:       hook, villain, proofStat, shareableQuote, seoDescription
 *   policiesPage: manifesto, proofStats, seoDescription
 *
 * Run: node scripts/migration/update-campaign-voice.js
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

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── POLICIES PAGE ─────────────────────────────────────────────────────────────

const policiesPageUpdate = {
  seoDescription:
    "Victoria is being ripped off. Transurban banks $2M a day from your commute. The lottery was sold for 42 years without asking you. Net debt climbs to $199B while private operators keep the income. Fusion Party Victoria's fully costed platform takes it back.",

  manifesto: {
    heading: 'They built the system to take from you.',
    body: "For thirty years, Victoria borrowed to build infrastructure — then handed the profits to private operators while you carried the debt. Transurban collects around $2M a day from Victorian toll roads. In May 2026, the state sold 42 years of lottery revenue to a private operator for a one-time payment. Southern Cross Station's commercial income goes to a consortium. The West Gate Tunnel extended Transurban's CityLink monopoly to 2045 — in exchange for the tunnel, which the state is still paying for. Net debt rises from $175.6B to $199.3B while the operators who run the assets keep the cash. The people who built this state are subsidising the people who own it.",
    punchline: 'The fix is below. Fully costed. Every number sourced.',
  },

  proofStats: [
    {
      _key: 'stat-toll',
      _type: 'stat',
      number: '~$2M/day',
      label: 'Flowing to Transurban from Victorian toll roads',
      icon: 'mdi:cash-remove',
      variant: 'magenta',
    },
    {
      _key: 'stat-lottery',
      _type: 'stat',
      number: '42 years',
      label: 'Of lottery revenue sold to a private operator in a single deal',
      icon: 'mdi:clock-alert',
      variant: 'yellow',
    },
    {
      _key: 'stat-debt',
      _type: 'stat',
      number: '$199B',
      label: 'Net debt by 2029-30 — while private operators keep the income from what it bought',
      icon: 'mdi:trending-up',
      variant: 'mint',
    },
    {
      _key: 'stat-homes',
      _type: 'stat',
      number: '30,000',
      label: 'Homes we can build and keep in public hands — without selling the upside',
      icon: 'mdi:home-city',
      variant: 'magenta',
    },
  ],
}

// ─── PER-POLICY CAMPAIGN VOICE ─────────────────────────────────────────────────

const campaignVoice = {
  // RECLAIM OUR ECONOMY — Stop the Bleeding

  'smooth-the-pension-cliff': {
    hook: "Victoria's pension system is designed to punish you for going back to work — earn a dollar over the threshold and you lose your benefits faster than you gained the income.",
    villain:
      "The benefit cliff isn't an accident. Pension tapering rules cut off concessions — energy, water, council rates — at rigid income thresholds rather than phasing them out gradually. So pensioners face effective marginal tax rates above 50% the moment they take on a few hours of part-time work. The system traps people in full dependency because getting out costs more than staying in.",
    proofStat: {
      number: '>50%',
      label: 'Effective marginal tax rate faced by some pensioners the moment they earn above the threshold',
      source: 'Grattan Institute pension research',
    },
    shareableQuote:
      "Every pensioner who picks up a few shifts is punished for it by a taper rate that takes more than they earn. We're fixing that.",
    seoDescription:
      "Victoria's pension taper penalises seniors for working. Fusion Party Victoria's plan smooths the cliff so every dollar earned is a dollar kept.",
  },

  'audit-the-fake-surplus': {
    hook: "The state government called 2026-27 a surplus year. The surplus is almost exactly the size of a one-off lottery payment. Without that deal, the books don't balance.",
    villain:
      "In May 2026, the government granted Tattersall's Sweeps a 42-year extension of Victoria's Public Lottery Licence — out to 2068 — for an upfront premium of $1.145 billion. That payment lands in 2026-27. The forecast operating surplus is $1.05 billion. The Auditor-General is already reviewing whether the deal 'optimised value.' Strip the one-off payment out and there is no surplus — just a structural deficit dressed up as fiscal discipline.",
    proofStat: {
      number: '$1.145B',
      label: 'One-off lottery licence payment propping up the 2026-27 surplus — locked in for 42 years',
      source: 'Victorian Budget 2026-27; Auditor-General review',
    },
    shareableQuote:
      "Calling a lottery payment a surplus is like calling a credit card advance a pay rise. We want a forensic audit — not accounting tricks.",
    seoDescription:
      'The Victorian government called 2026-27 a surplus. An independent forensic audit would tell you whether that number is real. Fusion Party Victoria is demanding one.',
  },

  'claw-back-franchise-profits': {
    hook: 'Private operators running public transport and utilities are guaranteed payment whether or not services run on time — your money flows regardless of their performance.',
    villain:
      "Metro Trains and Yarra Trams operate under franchise contracts that include substantial availability payments from the state — guaranteed revenue that doesn't stop when trains don't. There is no penalty structure strong enough to make underperformance more expensive than compliance. The incentive to perform exists only when the contract forces it — and these contracts don't.",
    proofStat: {
      number: '$1B+',
      label: 'Annual franchise payments to Metro Trains and Yarra Trams regardless of service quality',
      source: 'Department of Transport annual reports',
    },
    shareableQuote:
      'Public transport operators should earn their money by running public transport. If they fail, we take it back.',
    seoDescription:
      'Private transport operators profit whether or not services run. Fusion Party Victoria proposes a windfall levy on franchise profits when service standards fail.',
  },

  // RECLAIM OUR ECONOMY — Build Public Wealth

  'tax-the-land-windfalls': {
    hook: 'When the government rezones land near a new station, a private landowner pockets a windfall — created entirely by public investment, taxed at almost nothing.',
    villain:
      "The state spent $11 billion building the Metro Tunnel. Land values around the new stations increased dramatically — not because owners improved them, but because you built a train underneath. Under the current Windfall Gains Tax, only 50% of that uplift is clawed back. The rest is private profit on a public investment. We're proposing 75%.",
    proofStat: {
      number: '50%',
      label: 'Current Windfall Gains Tax rate on rezoning uplift — we propose 75%',
      source: 'Victorian Windfall Gains Tax legislation',
    },
    shareableQuote:
      "The public builds the station. The developer's land doubles in value. We want three-quarters of that back — not half.",
    seoDescription:
      'Victoria taxes only 50% of land value windfalls from rezoning. Fusion Party Victoria raises it to 75% to fund the infrastructure that created the uplift.',
  },

  'build-the-sovereign-fund': {
    hook: 'Victoria sells off its resource royalties and long-term revenue streams for short-term cash — permanently giving away future income to make one year look better.',
    villain:
      "In May 2026, Victoria sold 42 years of lottery revenue — out to 2068 — for a $1.145B upfront payment. That payment covered one year's surplus. The recurring profit a state-run lottery would have generated over 42 years is worth considerably more. Norway saved its oil money in a sovereign fund. We sold a lottery for a one-time hit. A Sovereign Wealth Fund would catch the next deal before it's locked in.",
    proofStat: {
      number: '42 years',
      label: "Of Victorian lottery revenue sold to a private operator — gone until 2068",
      source: 'Victorian Budget 2026-27; Parliament of Victoria',
    },
    shareableQuote:
      "Norway saved its oil money. Victoria sold its lottery for a cash advance. We're building the fund that stops that happening again.",
    seoDescription:
      "Victoria sells long-term revenue streams for short-term cash. Fusion Party Victoria's Sovereign Wealth Fund captures resource royalties and land value returns to build permanent public wealth.",
  },

  'pay-every-victorian': {
    hook: "Victoria's infrastructure generates billions in revenue. Almost none of it comes back to the Victorians who built it — it flows to shareholders and private operators.",
    villain:
      "CityLink clears around $2M a day in tolls. The commercial revenue at Southern Cross Station goes to Civic Nexus. Metro Trains and Yarra Trams return profits to offshore parent companies. The state owns the land and carries the debt — the operators collect the income. A Citizens Dividend returns those earnings to the people who own the assets: you.",
    proofStat: {
      number: '~$2M/day',
      label: 'CityLink toll revenue flowing to Transurban shareholders — not back to Victorians',
      source: 'Transurban annual reports; ACCC infrastructure review',
    },
    shareableQuote:
      "Alaska pays its citizens a dividend from oil. Victorians can receive one from the assets they already own — once we stop giving the income away.",
    seoDescription:
      "Victoria's public assets generate income that flows to private operators. Fusion Party Victoria's Citizens Dividend returns those returns to every Victorian.",
  },

  // RECLAIM OUR INFRASTRUCTURE — Read the Contracts

  'expose-the-tunnel-deal': {
    hook: "The contracts governing how much you pay in tolls on Victorian roads — and what liability the state carries — are classified. You are not allowed to read them.",
    villain:
      "West Gate Tunnel's agreement with Transurban extended CityLink out to 2045. The terms — traffic volume guarantees, state liability clauses, toll escalation formulas — are commercially confidential. You're paying for these roads. The contracts are secret. There is no democratic accountability without public access to what the government agreed on your behalf.",
    proofStat: {
      number: '2045',
      label: "Year the CityLink toll monopoly finally expires — locked in a secret contract you can't read",
      source: 'Department of Transport infrastructure disclosures',
    },
    shareableQuote:
      'Secret contracts mean secret prices and secret liabilities. The people who use these roads deserve to see what was agreed in their name.',
    seoDescription:
      'Victorian toll road contracts are classified. Fusion Party Victoria will declassify and publish all toll road agreements — so voters can see what the state committed to.',
  },

  'audit-southern-cross': {
    hook: "Southern Cross Station is the busiest rail station in Australia. A private consortium collects its commercial revenue. You breathe its diesel fumes.",
    villain:
      "Civic Nexus holds a long-term operating lease over Southern Cross. They collect retail rents, advertising revenue, and commercial income from a building the public owns. The diesel particulate problem — flagged repeatedly in public health reviews — is the responsibility of the operator. But the state has limited direct leverage. A forensic audit is the first step to changing that.",
    proofStat: {
      number: '25+ years',
      label: 'Of private management at Southern Cross with no published public accounts for commercial income',
      source: 'Parliament of Victoria PAEC hearings',
    },
    shareableQuote:
      "You built that station. You're paying to use it. Someone else is banking the profits. An audit tells us exactly how much.",
    seoDescription:
      "Southern Cross Station is publicly owned but privately operated. Fusion Party Victoria will audit the commercial income flowing to the private operator — and take it back.",
  },

  'unmask-transurbans-discount': {
    hook: "Transurban is offering commuters a 26-cent fuel discount as cost-of-living relief. To unlock it, you have to take 10 toll trips — paying the monopoly operator more to receive its own 'discount.'",
    villain:
      "Transurban holds government-granted monopolies on CityLink, the West Gate Tunnel approaches, and large parts of the metropolitan toll network. They set prices. They negotiate contract extensions. They marketed a 26c/litre fuel discount — available only by racking up toll payments — as relief from the cost-of-living crisis. A monopoly calling its own pricing structure a discount is not competing with the market. It is the market.",
    proofStat: {
      number: '~$2M/day',
      label: "CityLink's daily toll take — set by a monopoly operator under a contract running to 2045",
      source: 'Transurban annual reports',
    },
    shareableQuote:
      "A monopoly offering a discount on its own monopoly price isn't cost-of-living relief. It's marketing. Expose the contracts. Reset the tolls.",
    seoDescription:
      "Transurban holds government-granted toll monopolies until 2045. Fusion Party Victoria will investigate hidden concessions, publish the contracts, and legislate fair toll pricing.",
  },

  // RECLAIM OUR INFRASTRUCTURE — Take Back the Land

  'charge-the-car-parks': {
    hook: 'Inner-city surface car parks sit on some of the most valuable land in Victoria — holding it idle as a revenue stream while the city chokes and outer suburbs wait for buses.',
    villain:
      "A commercial surface car park in inner Melbourne generates revenue for its owner while imposing congestion costs on everyone else. The state's land and planning system allows this indefinitely. A compounding annual surcharge — rising every year the site stays single-use — makes land-banking more expensive than developing, without touching anyone's home.",
    proofStat: {
      number: '~1,400',
      label: 'Commercial surface car parks in inner Melbourne that could be levied or developed',
      source: 'City of Melbourne parking strategy',
    },
    shareableQuote:
      "If you want to sit on a prime piece of the city doing nothing with it, you pay for the privilege — and the levy funds transit for people who can't afford to park.",
    seoDescription:
      'Inner-city surface car parks block housing and transit. Fusion Party Victoria levies commercial parking sites to fund outer-suburban bus routes and incentivise development.',
  },

  'build-housing-at-stations': {
    hook: 'The state spent $11 billion building five underground Metro Tunnel stations — then left the precincts above them for private developers to capture.',
    villain:
      "The Metro Tunnel's five new underground stations opened under a 25-year availability-payment PPP with the Cross Yarra Partnership. The state pays. The retail and commercial precincts above them — built on public land — risk following the Southern Cross playbook: private operators collect the long-term commercial revenue while the public carries the infrastructure debt. Lock them into the public wealth fund now, before another 25-year deal gets signed.",
    proofStat: {
      number: '5 stations',
      label: 'New Metro Tunnel underground stations opened under a 25-year private PPP — precinct revenue not yet secured for public benefit',
      source: 'Cross Yarra Partnership; Department of Transport',
    },
    shareableQuote:
      "We spent $11 billion building underground stations. We should own what's above them — and the income they generate.",
    seoDescription:
      "Metro Tunnel stations sit above valuable publicly-owned land. Fusion Party Victoria will mandate public housing and public income retention at all major station precincts.",
  },

  'take-back-public-assets': {
    hook: "Privatisation didn't fix Victoria's finances. It changed who collects the rent — while the debt stayed with you.",
    villain:
      "The Kennett playbook: borrow to build, privatise the revenue stream, carry the debt. CityLink, the trains, the trams, Southern Cross — the state built it all, the state carries the liability, and the operators collect the cash. Net debt climbs from $175.6B to $199.3B not because the state is building too much but because it keeps giving away the income from what it already built.",
    proofStat: {
      number: '$199.3B',
      label: 'Projected Victorian net debt by 2029-30, rising while private operators keep the asset income',
      source: 'Victorian Budget 2026-27 forward estimates',
    },
    shareableQuote:
      "Privatisation didn't pay down the debt. It just made sure the income didn't come back to the people who built it.",
    seoDescription:
      "Victoria's net debt rises to $199B while private operators collect income from public assets. Fusion Party Victoria will reclaim failing privatisations and return asset income to public hands.",
  },

  // RECLAIM OUR INFRASTRUCTURE — Build the Network

  'build-the-melton-line': {
    hook: "Melton has over 200,000 residents. Their peak-hour rail service runs diesel through an electrified zone and takes over an hour to reach the CBD — because it shares a track designed for regional Ballarat trains.",
    villain:
      "Melton is one of Victoria's fastest-growing communities. Its rail service was never built for urban commuting: diesel rolling stock, a shared track with regional services, and journey times that make car ownership a necessity rather than a choice. The state has known this for years. The infrastructure investment went elsewhere.",
    proofStat: {
      number: '80+ min',
      label: 'Peak-hour journey time from Melton to Melbourne CBD — via a service designed for regional travel',
      source: 'PTV timetable data',
    },
    shareableQuote:
      "Melton is a suburb. It deserves a suburban train — electrified, frequent, and on its own dedicated track.",
    seoDescription:
      "Melton's 200,000+ residents rely on a diesel hybrid service designed for regional travel. Fusion Party Victoria will build a dedicated electrified rail line.",
  },

  'fix-transit-deserts': {
    hook: "Hundreds of thousands of outer-suburban Victorians have no realistic public transport option. They're not choosing to drive — the state has left them with no alternative.",
    villain:
      "The state's transport budget concentrates on high-profile inner-city projects. Outer suburban growth corridors — Wyndham, Melton, Casey, Cardinia — get bus routes that run hourly, stop by 7pm, and don't connect to where people work. Car ownership isn't a choice for outer-suburban residents. It's a tax the state imposes by refusing to fund transit where people actually live.",
    proofStat: {
      number: '60%+',
      label: 'Outer-suburban households car-dependent due to inadequate transit, the highest in Australia',
      source: 'Infrastructure Victoria outer-suburban transport review',
    },
    shareableQuote:
      "You don't need a light rail study. You need a bus every 10 minutes. We'll build that first — with dedicated lanes so it actually runs on time.",
    seoDescription:
      "Outer-suburban Victorians have no realistic public transport alternative. Fusion Party Victoria will deploy high-frequency orbital bus networks with dedicated lanes as the immediate fix.",
  },

  'fund-the-outer-suburbs': {
    hook: "Victoria spends its infrastructure budget on inner-Melbourne prestige projects. Outer growth corridors are building schools without libraries and roads without footpaths.",
    villain:
      "The Metro Tunnel. The Suburban Rail Loop. The West Gate Tunnel. Billions in capital spending concentrated in inner and middle Melbourne while Melton, Wyndham, Casey, and Cardinia have infrastructure backlogs measured in generations. The formula is simple: go where the cameras are, not where the people are. We're changing the formula.",
    proofStat: {
      number: '30%',
      label: 'Of the major infrastructure budget we will redirect to outer-suburban growth areas',
      source: 'Fusion Party Victoria policy costing',
    },
    shareableQuote:
      "The state government builds where the cameras are. We'll fund where the people are — 30% of the major project budget directed to outer suburbs.",
    seoDescription:
      "Victorian infrastructure spending concentrates in inner Melbourne while outer suburbs lack basic services. Fusion Party Victoria redirects 30% of the major project budget to growth corridors.",
  },

  // RECLAIM OUR DEMOCRACY — Fix the Rorts

  'abolish-preference-deals': {
    hook: "A candidate won a seat in the Victorian upper house with 0.04% of the primary vote. It was legal. It was the system working exactly as designed.",
    villain:
      "Group voting tickets allow political parties to lodge preference flows before election day — routing your above-the-line vote through complex chains negotiated in back rooms. Voters often have no idea where their preferences end up. Micro-parties coordinate cascades that elect candidates with almost no primary support. This isn't an edge case. It's the mechanism.",
    proofStat: {
      number: '0.04%',
      label: 'Minimum primary vote to win a Victorian upper house seat via preference harvesting under current rules',
      source: 'Victorian Electoral Commission results analysis',
    },
    shareableQuote:
      "Your vote should go where you put it — not where a party strategist decided in a hotel room before the polls opened.",
    seoDescription:
      "Victoria's group voting ticket system lets micro-parties win seats with 0.04% of the vote via preference deals. Fusion Party Victoria will replace it with direct voter-choice preferencing.",
  },

  'ban-corporate-fundraisers': {
    hook: "You can't get a private dinner with the Premier. A $10,000 table at a party fundraiser can — and the conversation happens without you in the room.",
    villain:
      "Cash-for-access political fundraisers give donors private time with ministers and party leaders outside public scrutiny. The discussion — the policy ask, the contract discussion, the regulatory question — happens in a room you're not allowed into. The democratic principle that citizens and corporations have equal access to their elected representatives is not observed when access has a price tag.",
    proofStat: {
      number: '$10,000+',
      label: 'Cost of a corporate table at major-party fundraising events — private access to ministers included',
      source: 'Reported political fundraising events; Age/Herald Sun investigations',
    },
    shareableQuote:
      "Democracy shouldn't have a table charge. Ban paid access to elected representatives — full stop.",
    seoDescription:
      'Cash-for-access fundraisers let corporations buy private time with Victorian ministers. Fusion Party Victoria will ban all paid political access events and mandate public registers for all minister meetings.',
  },

  'count-your-volunteer-hours': {
    hook: "Under current Victorian law, a corporation can second its staff to a political campaign, provide vehicles, print materials, and run call centres — and declare none of it.",
    villain:
      "Volunteer hours don't count as donations under Victorian electoral law. So a company can assign 20 employees to campaign work for weeks, contribute in-kind infrastructure worth hundreds of thousands of dollars, and report zero. Real grassroots volunteers show up because they believe in something. Corporate astroturf shows up because a CEO made a call. You can't tell the difference without disclosure rules.",
    proofStat: {
      number: '$0',
      label: 'Required to be disclosed in in-kind volunteer labour contributions under current Victorian electoral law',
      source: 'Victorian Electoral Act; Electoral Commission Victoria',
    },
    shareableQuote:
      "If money buys influence, so does free labour. Real-time disclosure of volunteer hours closes the last major loophole in campaign finance.",
    seoDescription:
      "Victorian electoral law doesn't require disclosure of in-kind volunteer labour — allowing corporations to fund campaigns through seconded staff. Fusion Party Victoria will mandate real-time hour logging.",
  },

  // RECLAIM OUR DEMOCRACY — Power to People

  'citizens-in-every-room': {
    hook: "Major Victorian legislation is drafted by bureaucrats, reviewed by cabinet, and voted on by party MPs. The people it affects aren't in the room until the next election.",
    villain:
      "The parliamentary process has been captured: bills are drafted inside departments shaped by lobbying, reviewed by cabinet shaped by donors, and passed by MPs shaped by factional bosses. A Citizens Assembly — selected by sortition, given time, evidence, and independent expert support — breaks that capture. Ireland used them to break constitutional deadlocks. France used them on climate. They work.",
    proofStat: {
      number: '0',
      label: 'Mandatory citizen deliberation processes required before major Victorian legislation is passed',
      source: 'Victorian legislative procedure; Parliament of Victoria',
    },
    shareableQuote:
      "Put ordinary Victorians in the room. Give them the evidence. They will make better decisions than the people being paid not to.",
    seoDescription:
      "Major Victorian legislation passes without any formal citizen review. Fusion Party Victoria will establish Citizens Assemblies by sortition to deliberate on all significant legislation.",
  },

  'communities-set-policy': {
    hook: "Your suburb's development is decided by a department in Spring Street — by people who may never have been there, accountable to no one in your postcode.",
    villain:
      "Regional planning and local capital budgets are set centrally. Growth corridors don't vote on what gets built in them — they get told. A participatory budgeting model gives community boards a statutory allocation of the state planning budget and a direct vote on how it's spent. Porto Alegre did it. Paris does it. It works.",
    proofStat: {
      number: '$0',
      label: 'In direct community-controlled planning budget under current Victorian framework',
      source: 'Department of Transport and Planning',
    },
    shareableQuote:
      "Your neighbourhood knows what it needs better than a department in Spring Street does. Give it a budget and a vote.",
    seoDescription:
      "Victorian planning decisions are made centrally with no community budget control. Fusion Party Victoria devolves regional planning budgets to local community boards with direct voting rights.",
  },

  'nothing-without-the-people': {
    hook: "The Victorian government can sell public assets, extend private monopolies for 42 years, and change the electoral rules — without asking voters once between elections.",
    villain:
      "In May 2026, the state sold Victoria's lottery revenue to 2068 without a referendum. The CityLink concession was extended to 2045 without a public vote. Major constitutional changes are possible with a simple parliamentary majority. Between elections, voters have no formal mechanism to stop decisions that bind them for decades. A citizen-initiated referendum changes that.",
    proofStat: {
      number: '42 years',
      label: 'Of lottery revenue committed to a private operator — with no public consultation required',
      source: 'Victorian Budget 2026-27; Parliament of Victoria',
    },
    shareableQuote:
      "'Nothing about the people, without the people.' That's a motto. We want to make it law — via a constitutional right to citizen-initiated referendums.",
    seoDescription:
      "Victoria's government can lock in 42-year private deals without asking voters. Fusion Party Victoria will enshrine a constitutional right to citizen-initiated referendums on major public decisions.",
  },
}

// ─── RUN ───────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🚀 Updating Campaign Voice fields in Sanity...\n')

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN not set')
    process.exit(1)
  }

  // 1. Update policiesPage
  console.log('── Updating policiesPage ──')
  const existingPage = await client.fetch('*[_type == "policiesPage"][0]')

  if (existingPage) {
    await client.patch(existingPage._id).set(policiesPageUpdate).commit()
    console.log(`✅ policiesPage updated (${existingPage._id})`)
  } else {
    await client.create({ _type: 'policiesPage', ...policiesPageUpdate })
    console.log('✅ policiesPage created')
  }

  // 2. Update each policy
  console.log('\n── Updating policies ──')
  let ok = 0
  let missing = 0
  let failed = 0

  for (const [slug, voice] of Object.entries(campaignVoice)) {
    const docId = `policy-${slug}`
    try {
      const existing = await client.getDocument(docId)
      if (!existing) {
        console.log(`⚠️  Not found: ${slug} (skipping)`)
        missing++
        continue
      }

      const patch = {
        hook: voice.hook,
        villain: voice.villain,
        shareableQuote: voice.shareableQuote,
        seoDescription: voice.seoDescription,
      }
      if (voice.proofStat) {
        patch.proofStat = voice.proofStat
      }

      await client.patch(docId).set(patch).commit()
      console.log(`✏️  ${slug}`)
      ok++
    } catch (err) {
      console.error(`❌ ${slug}: ${err.message}`)
      failed++
    }
  }

  console.log('\n─────────────────────────────────────────────')
  console.log('✨ Done!')
  console.log(`   ✅ Policies updated: ${ok}`)
  if (missing > 0) console.log(`   ⚠️  Not found:        ${missing}`)
  if (failed > 0) console.log(`   ❌ Errors:           ${failed}`)
}

run()
