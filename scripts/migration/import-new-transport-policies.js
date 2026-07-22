/* global process, console */
/* eslint-disable no-console */
/**
 * Import the new transport policy seeds from docs/policy/NEW_POLICY.md into Sanity.
 *
 * Five policies are stub-level in the source doc and have been fleshed out here to
 * match the full policy schema (Campaign Voice + Further Detail groups). One policy
 * ("Finish the Network") was already fully specified in the source doc and is mapped
 * across field-for-field.
 *
 * Run: node scripts/migration/import-new-transport-policies.js
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

const policies = [
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Stagger the Timetables',
    icon: 'mdi:bus-clock',
    thisTerm: true,
    summary:
      'Where two bus routes share a corridor, DTP frequently schedules them to arrive at the same time instead of staggered, halving effective frequency for free. Mandate a statewide audit and correction of every shared-corridor timetable clash.',
    keyPoints: [
      {
        point: 'Doubles effective frequency for free',
        description:
          'Staggering two routes that already run the same corridor turns two simultaneous 40-minute services into one effective 20-minute corridor — no new buses required.',
      },
      {
        point: 'Statewide, not just Melton',
        description:
          "Melton's 457 and 459 are the clearest example, but DTP has never audited how many other shared corridors have the same clash.",
      },
      {
        point: 'Zero cost, ministerial fix',
        description:
          'This is a scheduling correction, not a service increase — deliverable by ministerial direction without a budget line.',
      },
    ],
    hook: 'DTP is running two buses on the same corridor at the same time and calling it two services — Melton commuters get the frequency of one.',
    villain:
      "On Melton's Woodgrove stretch, the 457 and 459 both depart Melton Station at 4:04pm, both every 40 minutes. Nobody at DTP staggered them, so instead of a bus every 20 minutes on the shared section, residents get two buses arriving together and then a 40-minute wait. It costs nothing to fix and nobody has bothered to check how many other corridors have the same clash.",
    proofStat: {
      number: '4:04pm',
      label:
        "the time both Melton's 457 and 459 buses leave the station — together, every 40 minutes, on their shared Woodgrove stretch",
      source: 'Public Transport Victoria timetables',
    },
    shareableQuote:
      "Two buses on one corridor, running on the same clock. Stagger them and you've doubled the service for free.",
    seoDescription:
      'DTP schedules overlapping bus routes to arrive together instead of staggered, halving effective frequency at zero cost to fix. Fusion Party Victoria will mandate a statewide timetable audit.',
    designRationale:
      'A mandated audit is chosen over a service-by-service fix because the Melton case is very unlikely to be the only instance. Wherever two routes share a corridor for even part of their length, unstaggered timetables silently halve the effective frequency residents experience — an error that costs nothing to correct once identified, but that nobody is currently checking for.',
    systemInteraction:
      'DTP already sets and publishes timetables for every metropolitan and regional bus route; this requires no new systems, only a cross-referencing audit of shared-corridor timing across the existing timetable dataset, followed by rescheduling directives issued through the same process DTP already uses to publish timetable changes.',
    economicLogic:
      'Because the buses, drivers, and routes are already funded, staggering is a pure efficiency gain: the same operating budget delivers double the effective frequency on affected corridors. It is the cheapest frequency improvement available anywhere in the network, because it requires no new expenditure at all.',
    riskAndFailureModes:
      'The main risk is that DTP treats the audit as a one-off exercise rather than an ongoing check — timetables change regularly, and a new clash can be introduced at the next reschedule just as easily as an old one is fixed. The audit and correction process should be a standing compliance check, not a single pass.',
    evidenceAndPrecedent:
      "Pulse or clockface scheduling — deliberately staggering services that share a corridor so combined frequency is even rather than bunched — is standard practice in mature transit networks internationally. Melton's 457/459 pairing is a documented case where this basic principle was not applied despite both routes being run by DTP-contracted operators on published timetables.",
    implementationOutline:
      'Sequence 1: Mandate a DTP audit of every shared-corridor pairing statewide, cross-referencing published timetables for services that overlap in time on shared sections. Sequence 2: Publish the audit findings, including every clash identified. Sequence 3: Issue rescheduling directives to correct each clash. Sequence 4: Make the audit a standing annual compliance check, not a one-off.',
    cost: '$0 — a scheduling fix, not a service increase.',
    funding:
      "No new funding required — corrected through DTP's existing timetable-setting process at no additional operating cost.",
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Guarantee the One-Kilometre Standard',
    icon: 'mdi:map-marker-distance',
    thisTerm: true,
    summary:
      "No resident anywhere in Victoria should be more than 1km from a usable transit link, even if it only runs hourly — except in genuinely rural areas where this isn't feasible. Legislate the coverage standard and require DTP to publish an annual compliance map.",
    keyPoints: [
      {
        point: 'A floor, not a frequency promise',
        description:
          'The standard guarantees a stop exists within reach — a bus, or where relevant a rail line — not that it runs often. Coverage first, frequency is fixed separately.',
      },
      {
        point: 'Every town centre gets a link',
        description:
          'Anywhere there is a town centre, the standard requires a bus serving it and a connection to the next town.',
      },
      {
        point: 'Public, annual accountability',
        description:
          'DTP publishes a compliance map every year — a natural companion to the existing Transport Score tool — so gaps cannot stay hidden.',
      },
    ],
    hook: "Right now nobody has to tell you whether your town has a transit link within reach — DTP has no legislated obligation to check, let alone publish it.",
    villain:
      "Coverage gaps in Victoria's transit network persist because no legal standard requires DTP to close them, or even to measure them consistently. A standard costs nothing to legislate. It just requires the government to commit to a floor it is currently free to ignore.",
    proofStat: {
      number: '1km',
      label:
        'the maximum distance from any Victorian resident (outside genuinely rural areas) to a usable transit link, under the standard this policy legislates',
      source: 'Policy ask — Fusion Party Victoria',
    },
    shareableQuote:
      "Every Victorian should be within a kilometre of a bus, even if it only runs once an hour. That's not radical. That's a floor.",
    seoDescription:
      'Fusion Party Victoria will legislate a one-kilometre coverage standard for public transport statewide, with an annual DTP compliance map alongside the Transport Score tool.',
    designRationale:
      "The standard is deliberately narrow: coverage, not frequency. An hourly service that exists beats no service at all, and separating the coverage guarantee from the frequency argument means the standard can be legislated immediately without first resolving the harder, more expensive question of how often each link should run. Genuinely rural areas are explicitly excluded because a uniform coverage standard applied without exception would either bankrupt regional budgets or be diluted into meaninglessness.",
    systemInteraction:
      'DTP already collects the location data needed to assess coverage — the same data underlying the Transport Score tool. This proposal converts that existing data capability into a legislated, published, annual obligation rather than a discretionary reporting choice.',
    economicLogic:
      'Legislating the standard costs nothing; it is a floor on future service planning, not a service commitment itself. Compliance spend — new stops, new routes, new links — follows through existing Transit Capital Fund mechanisms already funding other network gaps, sequenced against the annual compliance map rather than committed all at once.',
    riskAndFailureModes:
      'The standard could be legislated and then never enforced if no penalty or public accountability mechanism is attached — the annual compliance map exists specifically to prevent this by making non-compliance visible and politically costly every year, not just at the point of legislation.',
    evidenceAndPrecedent:
      'This mirrors the logic of the existing Transport Score tool (transportscore.fusionparty.org.au), which already measures and publishes transit access at a suburb level; this policy legislates a minimum floor against that same measurement rather than leaving access purely descriptive.',
    implementationOutline:
      'Sequence 1: Legislate the one-kilometre coverage standard, with a defined rural exemption test. Sequence 2: Mandate DTP publish an annual statewide compliance map. Sequence 3: Direct Transit Capital Fund revenue toward closing the highest-priority gaps identified each year, starting with town centres currently unserved entirely.',
    cost: 'Standard itself is $0; compliance spend follows via Transit Capital Fund mechanisms.',
    funding:
      'The standard requires no funding to legislate. Closing gaps it identifies draws on the same Transit Capital Fund revenue — car park and land-banking surcharges — already funding other network-coverage fixes in this platform.',
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Connect the Regions',
    icon: 'mdi:transit-connection-variant',
    thisTerm: false,
    summary:
      "Victoria's regional network is built entirely hub-and-spoke through Melbourne. A Ballarat resident travelling to Bendigo has to route via the city despite the two being roughly 130km apart directly. Commission a direct regional cross-connectivity study for major regional-to-regional pairs currently requiring a Melbourne detour.",
    keyPoints: [
      {
        point: "Regional Victoria isn't a Melbourne feeder",
        description:
          'Every V/Line and coach route is designed around getting people to and from Melbourne, not between regional centres.',
      },
      {
        point: 'Ballarat to Bendigo, the test case',
        description:
          "Two of Victoria's largest regional cities, roughly 130km apart directly, have no direct public transport connection at all.",
      },
      {
        point: 'A scoping study, not a blank cheque',
        description:
          "This is a commitment to find out what direct regional links would cost and where they'd have the most impact — not a pre-committed spend.",
      },
    ],
    hook: "Want to get from Ballarat to Bendigo — two of Victoria's biggest regional cities, 130km apart — without a car? The only way DTP has built is via Melbourne.",
    villain:
      "Victoria's regional transport network was designed around one destination: Melbourne. Every V/Line line and coach route radiates from the capital. Two regional centres sitting 130km apart, Ballarat and Bendigo, have no direct service at all — a resident is forced to detour through the city they were trying to avoid, and DTP has never scoped what fixing that would cost.",
    proofStat: {
      number: '~130km',
      label:
        'the direct distance between Ballarat and Bendigo — with no direct public transport link between them',
      source: 'Policy analysis — Fusion Party Victoria',
    },
    shareableQuote:
      "Regional Victoria isn't a feeder system for Melbourne. It's time the network stopped treating it like one.",
    seoDescription:
      "Ballarat to Bendigo is 130km direct — but Victoria's V/Line network only connects them via Melbourne. Fusion Party Victoria will commission a direct regional cross-connectivity study.",
    designRationale:
      "A scoping study is the deliverable this term rather than a funded build, because the specific cost and alignment of direct regional-to-regional services genuinely isn't known — DTP has never studied it, because the network was never designed around that question. Naming a study rather than a project avoids overpromising on figures that don't exist yet, while still forcing the question onto the public record.",
    systemInteraction:
      'V/Line operates the regional rail network and coach replacement services under its existing franchise arrangements; any new direct regional-to-regional service would need to interact with existing rolling stock allocation, track access agreements (much of regional track is shared with freight), and V/Line timetabling systems.',
    economicLogic:
      'Hub-and-spoke design made sense when Melbourne was the overwhelming destination for regional travel; as regional centres grow in their own right, demand for direct regional-to-regional travel grows independent of Melbourne, and the current network structurally cannot serve it without a Melbourne detour that adds hours to trips a direct link could complete quickly.',
    riskAndFailureModes:
      "The primary risk is that a scoping study is commissioned and then shelved without a funding pathway — the same failure mode already seen with Infrastructure Victoria's City Loop recommendation. A firm reporting deadline and public release requirement should be attached to the study commission to reduce this risk.",
    evidenceAndPrecedent:
      'Infrastructure Victoria and V/Line planning documents to date have focused overwhelmingly on Melbourne-radial services; no equivalent regional cross-connectivity study currently exists for Victoria, despite comparable regional rail systems overseas demonstrating demand for non-hub regional links where population centres are large enough to support them.',
    implementationOutline:
      'Sequence 1: Commission a direct regional cross-connectivity study covering major regional-to-regional pairs currently requiring a Melbourne detour, starting with Ballarat–Bendigo. Sequence 2: Require the study to assess both V/Line rail and coach options against cost and demand. Sequence 3: Publish the findings and recommended priority order publicly, with a fixed reporting deadline.',
    cost: 'TBD — needs scoping study.',
    funding:
      'The study itself is a modest departmental commissioning cost; any resulting service build would be costed and funded separately once the study reports, not committed to in advance.',
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Fix the Order, Not Just the Fare',
    icon: 'mdi:format-list-numbered',
    thisTerm: true,
    summary:
      'Fusion agrees with the destination of free public transport but disagrees on sequencing. Coverage first, then frequency and reliability, then fare — because fare falls naturally once patronage economics improve, and spending political capital on free fares first targets the cheapest variable to change, not the one that is actually broken.',
    keyPoints: [
      {
        point: 'Coverage is the first constraint',
        description:
          "VAGO found only 9-12% of Melton's population within reach of high-quality public transport — a fare cut does nothing for someone with no service to board.",
      },
      {
        point: 'Frequency and reliability come second',
        description:
          'VAGO also found only 68-73% of priority bus-to-train connections fall within a workable 5-10 minute window — a free fare on an unreliable connection does not fix the connection.',
      },
      {
        point: 'Fare is the easy variable, not the broken one',
        description:
          'Free-fares-first policy spends political capital on the cheapest thing to change, leaving the actual constraints — coverage and reliability — untouched.',
      },
    ],
    hook: 'Free public transport sounds bold until you realise it does nothing for the Melton resident who has no service to board in the first place.',
    villain:
      "Free-fares-first policy is popular because fare is the easiest variable to change — announce it, legislate it, done. But VAGO's own audits show the network's binding constraints are coverage (barely one in ten Melton residents within reach of high-quality transit) and reliability (fewer than three-quarters of priority connections land within a usable window). Fixing the fare first spends political capital on the part of the system that was never actually broken.",
    proofStat: {
      number: '68-73%',
      label:
        'of priority bus-to-train connections that fall within a workable 5-10 minute window — the reliability gap free fares do not fix',
      source: 'VAGO',
    },
    shareableQuote:
      "A free ticket for a bus that never comes isn't a policy. Fix the order: coverage, then frequency, then fare.",
    seoDescription:
      'Fusion Party Victoria agrees with free public transport as a destination, but insists on fixing coverage and reliability first. A staging commitment, not a fare policy.',
    designRationale:
      'This is a sequencing stance, not a rejection of free fares as an eventual goal. The three-step hierarchy — coverage, then frequency and reliability, then fare — reflects which constraint actually stops people using public transport today. Legislating fare policy ahead of the other two risks locking in a popular but premature commitment that does not move ridership, because people without a usable service or a reliable connection do not benefit from a lower price.',
    systemInteraction:
      'This staging commitment would bind future fare legislation to prior benchmarks on coverage (the one-kilometre standard) and reliability (priority connection windows), both independently measurable through DTP and VAGO reporting mechanisms already in use elsewhere in this platform.',
    economicLogic:
      'Patronage economics improve as coverage and reliability improve — more usable, more reliable services generate more fare revenue and more political room to reduce fares sustainably. Cutting fares first, before patronage has grown, means the same revenue shortfall has to be met from general revenue instead of being offset by increased ridership, making the fare cut harder to sustain long-term.',
    riskAndFailureModes:
      "The risk is being cast as opposing free transport rather than sequencing it correctly; the staging framing needs to be maintained consistently to avoid this being conflated with opposition to the Greens' destination, which Fusion shares.",
    evidenceAndPrecedent:
      "VAGO's June 2026 Bus Plan audit is the source for both the coverage figure (9-12% of Melton within reach of high-quality PT) and the reliability figure (68-73% of priority bus-to-train connections within a 5-10 minute window) underpinning this staging argument.",
    implementationOutline:
      'Sequence 1: Formalise the three-step staging commitment (coverage, frequency/reliability, fare) as a public position ahead of any fare legislation. Sequence 2: Tie future fare policy debate to published coverage and reliability benchmarks rather than allowing it to proceed independently. Sequence 3: Support fare reform once coverage and reliability benchmarks are substantially met.',
    cost: '$0 — a prioritisation stance, not new spending.',
    funding:
      'No funding required — this is a formal staging position, not a spending commitment, adopted ahead of any fare legislation being introduced.',
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: "End FlexiRide's Fake Flexibility",
    icon: 'mdi:bus-alert',
    thisTerm: true,
    summary:
      "FlexiRide and similar on-demand services currently require hours of lead time and can still drop passengers hundreds of metres short of their actual destination. Legislate minimum service standards for on-demand transit: maximum booking lead time, and door-to-door rather than zone-to-zone delivery.",
    keyPoints: [
      {
        point: 'Three hours for a fifteen-minute ride',
        description:
          "A Woodgrove-area FlexiRide booking required three hours' notice for a fifteen-minute ride — and still dropped the passenger 800m short of their destination, on a trip that would otherwise be a 7.3km, roughly 100-minute walk.",
      },
      {
        point: 'Door-to-door, not zone-to-zone',
        description:
          'On-demand services that drop passengers short of their actual destination shift the last leg of the trip back onto the passenger, defeating the point of booking a ride.',
      },
      {
        point: 'A service standard, not new infrastructure',
        description:
          'This legislates minimums for an existing service model — no new vehicles or routes required.',
      },
    ],
    hook: "A FlexiRide booking near Woodgrove needed three hours' notice for a fifteen-minute ride — and still dropped the passenger 800 metres short of their front door.",
    villain:
      "FlexiRide is marketed as flexible, responsive transport. In practice, one Melton booking required three hours' advance notice for a ride of just fifteen minutes — and still dropped the passenger 800 metres short of their actual destination, on a trip that would otherwise have been a 7.3km, roughly 100-minute walk. Waiting three hours for a ride that doesn't even reach the door isn't flexibility — it's a zone-to-zone shuttle wearing an on-demand label.",
    proofStat: {
      number: '800m',
      label:
        "how far short of the destination FlexiRide's zone-based drop-off left a passenger — after a 3-hour booking wait for a 15-minute ride",
      source: 'Rider account, Woodgrove FlexiRide service',
    },
    shareableQuote:
      "Three hours' notice for a fifteen-minute ride that still leaves you 800 metres from your own door isn't on-demand. It's slower and less reliable than the walk it was supposed to replace.",
    seoDescription:
      "FlexiRide's three-hour lead times and zone drop-offs can leave riders hundreds of metres short of their destination. Fusion Party Victoria will legislate minimum on-demand service standards.",
    designRationale:
      "Rather than replacing on-demand services, this legislates the minimum standards that make 'on-demand' an honest label: a maximum booking lead time, and door-to-door rather than zone-to-zone delivery. This preserves the flexibility of the on-demand model for genuinely low-density areas while removing the specific failure modes that currently make it worse than no service at all.",
    systemInteraction:
      'On-demand services like FlexiRide are contracted and specified by DTP; this legislates binding minimum standards into those service specifications and future contracts, rather than requiring new vehicles, routes, or booking infrastructure.',
    economicLogic:
      'This is a service standard applied to already-funded contracts, not a new spending commitment — the fix is to what these services are contractually required to deliver, not how much is spent delivering them.',
    riskAndFailureModes:
      "Operators may argue that tighter lead-time and door-to-door requirements increase per-trip cost or reduce the number of trips a given fleet can service; this needs to be weighed against the current failure mode, where excessive lead times and zone drop-offs mean the service isn't being used at all in the situations it was meant to solve.",
    evidenceAndPrecedent:
      "On-demand transit services overseas that succeed at genuinely replacing fixed-route low-frequency services typically guarantee short booking windows (well under an hour) and true door-to-door delivery; FlexiRide's current lead times and zone-based drop-offs fall well outside that benchmark.",
    implementationOutline:
      'Sequence 1: Legislate a maximum booking lead time for on-demand transit services. Sequence 2: Legislate a door-to-door delivery requirement, replacing zone-to-zone drop-offs. Sequence 3: Apply the new standards to FlexiRide and equivalent services at next contract renewal.',
    cost: 'Minimal — a service standard, not new infrastructure.',
    funding:
      'No new funding required — standards are applied to existing, already-funded on-demand service contracts at renewal.',
  },
  {
    pillar: 'RECLAIM OUR INFRASTRUCTURE',
    category: 'Build the Network',
    title: 'Finish the Network',
    icon: 'mdi:train',
    thisTerm: false,
    summary:
      'Deanside is ranked 0 out of 100 for public transport access, the worst score in Victoria, and it sits almost exactly on the alignment a real western orbital line would need to take. Electrification promised for Melton and Wyndham Vale since 2018 still has no construction budget. Wallan faces the same fate a decade behind. And Infrastructure Victoria has already recommended reconfiguring the City Loop into through-running lines, a recommendation sitting on a shelf. Four connected fixes, fully specified, ready to legislate.',
    keyPoints: [
      {
        point: 'Electrify Melton and Wyndham Vale',
        description:
          'Both promised since the 2018 Western Rail Plan alongside 12 peak electric services and 20-minute off-peak frequency by 2026. $152.7m has funded planning only. No construction budget exists for either line.',
      },
      {
        point: 'Electrify Wallan',
        description:
          'The Seymour line corridor is heading toward the exact problem Melton had a decade ago: a growing outer population served by diesel regional trains standing in for a metro service.',
      },
      {
        point: 'Reconfigure the City Loop for through-running',
        description:
          "Craigieburn to Frankston. Upfield (extending to Wallan) to Glen Waverley. This is Infrastructure Victoria's own Recommendation 60, not a fringe idea, already assessed as high-benefit and sitting unimplemented. Paired with cross-platform interchanges at Caulfield and Malvern — one in each direction, so passengers switch between the Frankston line and Metro Tunnel services by walking across the platform rather than changing levels, the same design Singapore uses between City Hall and Raffles Place.",
      },
      {
        point: 'Build a real SRL West',
        description:
          'Not an upgrade to the existing Sunshine–Werribee corridor. A new alignment through the suburbs the network does not reach: Airport to Watergardens via Keilor Village and Taylors Lakes; Watergardens to Ravenhall via Fraser Rise, Deanside and Caroline Springs proper; Ravenhall to Point Cook via Derrimut, Truganina, Williams Landing and Seabrook.',
      },
    ],
    hook: "The government's own infrastructure advisor recommended reconfiguring the City Loop years ago. It's still sitting on a shelf while Victoria spends $216 billion on a different rail project entirely.",
    villain:
      "Two governments' worth of transport plans have named Melton and Wyndham Vale electrification as a commitment without ever attaching a construction budget to it. Infrastructure Victoria assessed the City Loop reconfiguration as high-benefit and it still hasn't been actioned. The gap isn't a lack of good options on the table. It's a lack of anyone willing to fund the unglamorous fix over the visible mega-project.",
    proofStat: {
      number: '0/100',
      label:
        "Deanside's Transport Score, the worst in Victoria, and it sits directly on the alignment a real SRL West would need to take",
      source: 'Fusion Transport Score (transportscore.fusionparty.org.au)',
    },
    shareableQuote: 'Infrastructure Victoria already told them how to fix the City Loop. Nobody funded it. We will.',
    seoDescription:
      "Fusion's plan to electrify Melton, Wyndham Vale and Wallan, reconfigure the City Loop per Infrastructure Victoria's own recommendation, and build a real SRL West through Melbourne's underserved west.",
    designRationale:
      "Each of these four items solves a distinct, identifiable gap rather than duplicating existing commitments. Melton and Wyndham Vale electrification is already government policy without funding; this closes the funding gap rather than re-announcing the project. Wallan electrification is preventative, addressing a growth corridor before it reaches the crisis point Melton is currently at. The City Loop reconfiguration adopts Infrastructure Victoria's own Recommendation 60 rather than proposing a novel scheme, reducing design risk to near zero since the assessment work has already been done by the state's own advisory body. Its benefit compounds further if paired with cross-platform interchange design at Caulfield and Malvern — the physical junction between the Frankston line and the Dandenong/Pakenham corridor now served by Metro Tunnel trains. Modelled on Singapore's City Hall and Raffles Place interchange, where each station provides a same-platform transfer for one direction-pair of the intersecting lines, this removes the stairs-and-corridor transfer that would otherwise erode any frequency gain delivered by through-running. SRL West is deliberately specified as a new alignment through Keilor Village, Taylors Lakes, Fraser Rise, Deanside, Caroline Springs, Derrimut, Truganina, Williams Landing and Seabrook rather than an upgrade to the existing Sunshine–Werribee rail corridor, because the existing corridor already has a railway line on it. A second investment in the same corridor does nothing for the growth suburbs that currently have no rail access within a reasonable distance at all.",
    systemInteraction:
      'Melton, Wyndham Vale and Wallan electrification extend the existing metropolitan electrified network and would be delivered through the same Metro Trains/VicTrack operating framework as the rest of the suburban network. City Loop reconfiguration is an operating pattern change requiring signalling and platform allocation work but not new tunnelling, using infrastructure that already exists. Cross-platform interchange at Caulfield and Malvern would require platform and track reconfiguration at both stations to align Frankston line and Metro Tunnel/Dandenong corridor services for a same-platform transfer in each direction, in addition to the signalling and platform allocation work already required for City Loop through-running. SRL West is a genuinely new heavy rail corridor and would need to be sequenced against existing Big Build delivery capacity (contractor availability, VicTrack land acquisition processes) rather than delivered in isolation.',
    economicLogic:
      "The core logic across all four items is sequencing capital toward corridors and reconfigurations where the case is already made, either by prior government commitment (Melton/Wyndham Vale) or by the state's own advisory body (City Loop, Recommendation 60), over new large-scale commitments where the case is still being built. SRL West is the exception requiring new capital, but is scoped specifically to growth corridors with no existing rail alternative, rather than duplicating capacity on an already-served corridor, maximising the population gaining new access per dollar spent.",
    riskAndFailureModes:
      "Electrification commitments have a documented history in this network of being announced without construction funding attached (Melton and Wyndham Vale since 2018); the same risk applies to Wallan unless construction funding is legislated concurrently with the commitment, not left for a future budget cycle. City Loop reconfiguration carries operational transition risk during the changeover period and requires careful platform/signalling sequencing; Infrastructure Victoria's assessment should be revisited for currency before implementation given time elapsed since Recommendation 60 was issued. SRL West as a genuinely new alignment carries standard major-project risks: land acquisition cost escalation, and contractor capacity constraints given concurrent Big Build commitments elsewhere in the state.",
    evidenceAndPrecedent:
      "City Loop reconfiguration is Infrastructure Victoria's own Recommendation 60, assessed as producing strong benefits for suburbs on the Craigieburn, Frankston, Upfield and Glen Waverley lines, including relief for northern V/Line services on the Shepparton and Seymour corridors and reliability improvements for the Alamein, Belgrave and Lilydale lines. This is not a novel proposal; it is an existing, costed, government-advised recommendation that has not been actioned. Melton and Wyndham Vale electrification is existing Western Rail Plan (2018) policy. Singapore's City Hall and Raffles Place interchange — where City Hall provides a cross-platform transfer between the North-South and East-West lines in one direction and Raffles Place provides it in the other — is a well-established precedent for minimising transfer friction between two intersecting metro lines without requiring a single mega-interchange station to handle every transfer direction. The general principle of directing capital toward underserved corridors ahead of duplicating existing ones follows the same logic applied internationally wherever transit investment prioritises network coverage over redundant capacity.",
    implementationOutline:
      "Sequence 1: Legislate construction funding for Melton and Wyndham Vale electrification concurrently with the existing planning phase, removing the funding gap between commitment and delivery. Sequence 2: Commission updated costing on Infrastructure Victoria's Recommendation 60 and commit to a delivery timeline, given it requires operational reconfiguration rather than new construction. Sequence 3: Commit Wallan electrification to the medium-term pipeline ahead of the corridor reaching Melton's current crisis point. Sequence 4: Commission a business case for the specified SRL West alignment as an alternative to further work on the existing Sunshine–Werribee corridor upgrade, sequenced against existing Big Build delivery capacity.",
    cost: 'Requires a parliamentary majority and a funded construction commitment across all four items — not deliverable from a single crossbench seat.',
    funding:
      "The one-seat deliverable is forcing detailed, costed alternatives onto the public record, including formally revisiting Infrastructure Victoria's own unimplemented recommendation, so a future government with a mandate cannot claim a better-specified option wasn't available.",
  },
]

async function importPolicies() {
  console.log('🚀 Importing new transport policies to Sanity...\n')

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set')
    process.exit(1)
  }

  let created = 0
  let patched = 0
  let failed = 0

  for (const policy of policies) {
    const slug = slugify(policy.title)
    const docId = `policy-${slug}`

    const doc = {
      _id: docId,
      _type: 'policy',
      pillar: policy.pillar,
      category: policy.category,
      title: policy.title,
      slug: { _type: 'slug', current: slug },
      icon: policy.icon,
      summary: policy.summary,
      thisTerm: policy.thisTerm,
      keyPoints: policy.keyPoints.map((kp, i) => ({
        _key: `kp-${slug}-${i}`,
        _type: 'keyPoint',
        point: kp.point,
        description: kp.description,
      })),
      hook: policy.hook,
      villain: policy.villain,
      proofStat: policy.proofStat,
      shareableQuote: policy.shareableQuote,
      seoDescription: policy.seoDescription,
      designRationale: policy.designRationale,
      systemInteraction: policy.systemInteraction,
      economicLogic: policy.economicLogic,
      riskAndFailureModes: policy.riskAndFailureModes,
      evidenceAndPrecedent: policy.evidenceAndPrecedent,
      implementationOutline: policy.implementationOutline,
      cost: policy.cost,
      funding: policy.funding,
      publishedAt: new Date().toISOString(),
    }

    try {
      const existing = await client.getDocument(docId)
      if (existing) {
        await client.patch(docId).set(doc).commit()
        console.log(`✏️  Patched:  [${policy.thisTerm ? 'Term' : 'Vision'}] ${policy.title}`)
        patched++
      } else {
        await client.create(doc)
        console.log(`✅ Created: [${policy.thisTerm ? 'Term' : 'Vision'}] ${policy.title}`)
        created++
      }
    } catch (error) {
      console.error(`❌ Error:   ${policy.title}`)
      console.error(`   ${error.message}`)
      failed++
    }
  }

  console.log('\n─────────────────────────────────────────────')
  console.log(`Created: ${created}  Patched: ${patched}  Failed: ${failed}`)
  console.log('✨ Import complete!')
}

importPolicies()
