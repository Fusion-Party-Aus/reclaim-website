import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const envText = readFileSync(new URL('../../.env', import.meta.url), 'utf-8')
const env = {}
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2]
}

const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID || 'qwl3f8jb',
  dataset: env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

async function patchHomePage() {
  const homePage = await client.fetch(`*[_type == "homePage"][0]{_id, hero}`)
  if (!homePage) throw new Error('homePage document not found')

  const stats = homePage.hero.stats.map((stat) =>
    stat.label === 'Upper House Seat' ? { ...stat, label: 'Seat Within Reach' } : stat
  )

  const result = await client
    .patch(homePage._id)
    .set({
      'hero.title': 'READ THE CONTRACTS. JOIN THE FIGHT.',
      'hero.subtitle':
        "Fusion is Victoria's crowd-funded minor party — no corporate donors, no career politicians, just people who did the maths and got angry. 900+ Victorians already have. You're next.",
      'hero.stats': stats,
      'theftSection.heading': "Here's why your vote counts",
      'theftSection.description':
        'One seat in the upper house forces contracts into daylight.\nMore votes make that seat easier to win — and harder for the majors to ignore either way.\nBalance of power: we make them earn every vote before we hand out ours.\nNo seat is guaranteed. Every vote still moves the line.\nMake yours count.',
    })
    .commit()

  // manifestoSection.stats is an array; patch the one entry whose current
  // label references GVT abolition, matched by _key rather than index so a
  // reorder elsewhere in Studio doesn't silently patch the wrong entry.
  const gvtStat = homePage._id
    ? await client.fetch(
        `*[_id == $id][0].manifestoSection.stats[label match "*GVT abolition*"][0]._key`,
        { id: homePage._id }
      )
    : null
  if (!gvtStat) throw new Error('manifestoSection GVT stat not found — check the label match')

  await client
    .patch(homePage._id)
    .set({
      [`manifestoSection.stats[_key=="${gvtStat}"].label`]:
        'the car park surcharge bill and preference-deal reform on day one.',
    })
    .commit()

  console.log('✅ homePage patched:', result._id)
}

async function patchPreferenceDealsPolicy() {
  const id = 'policy-abolish-preference-deals'
  const result = await client
    .patch(id)
    .set({
      hook: "Victoria looks likely to scrap group voting tickets before this election — but it isn't law yet. Fusion is running under the rules as they stand today, and we're campaigning to end them regardless of who gets there first.",
      villain:
        "Group voting tickets let parties lodge preference deals in back rooms, often with money changing hands nobody discloses. If reform passes before polling day, the vote-cascade trick dies with it — good, we've called for that for years. But no version of that reform touches the money behind preference deals. We lodged preference deals under today's rules. If those rules survive to polling day, we'll use them the same as any other party — and push to end them from the inside if elected. If reform beats us to it, that fight's already won, and we'll keep pushing for the disclosure law it still leaves out.",
      shareableQuote:
        "We might not get the chance to vote GVTs out ourselves — Victoria may beat us to it. Fine. Either way, the money behind preference deals still isn't public. That fight doesn't end when GVTs do.",
      'proofStat.label':
        "Primary vote that won a federal Senate seat via preference harvesting in 2013 — the loophole GVT reform may close, though the money behind such deals still wouldn't be disclosed.",
      summary:
        'Replace group voting tickets with direct voter-choice preference allocation — and require full disclosure of the money behind preference deals either way.',
      seoDescription:
        "Victoria may abolish group voting tickets before the 2026 election. Fusion's pushing for it regardless — and for full disclosure of the money behind preference deals, whichever happens first.",
      designRationale:
        'Victoria\'s preferential voting system gives candidates and parties the ability to direct how their voters\' preferences flow if they are eliminated, through "how to vote" cards and registered group voting tickets in the upper house. Preference deals between parties are negotiated privately, often with significant financial considerations, and are typically opaque to voters. The structural conflict of interest is that the major parties benefit from preference flows that keep the two-party system intact, while smaller parties trade preferences for campaign support or fundraising assistance. Victoria is likely, but not yet confirmed, to abolish group voting tickets before the 2026 election. Fusion is contesting 2026 under the rules as they currently stand, including lodging preference deals, and is campaigning to end the group voting ticket system regardless of whether reform passes first. Using a mechanism while campaigning to end it, and not knowing in advance whether the mechanism will still exist by polling day, is the central tension this policy states honestly rather than obscures.',
      implementationOutline:
        "This is a crossbench-leverage policy with an acknowledged conflict of interest: Fusion lodged preference deals for the 2026 election under group voting ticket rules that may or may not still be in force by polling day, while campaigning to end those rules. That tension is named explicitly rather than obscured. If Fusion wins a seat, the Fusion MP introduces a Private Member's Bill amending the Electoral Act 2002 in up to two stages, depending on what reform has already done: first, require full public disclosure of any financial or in-kind consideration paid in connection with a preference agreement, registered as a political donation under the existing disclosure regime (this is the least controversial ask, attracts cross-party support, and remains necessary even if group voting tickets are already abolished); second, if group voting tickets have not already been abolished by then, abolish the Legislative Council group voting ticket mechanism in favour of optional preferential voting above the line, mirroring the 2016 Commonwealth Senate reform. The disclosure stage can pass from one seat with the support of parties that benefit from preference transparency even if they oppose abolition. Whichever stages are still live by the time Fusion holds any seat, the one-seat deliverable is putting a fully drafted bill on the record, forcing every party to state publicly whether they support undisclosed preference-deal money.",
      riskAndFailureModes:
        "The direct conflict of interest: Fusion lodged preference deals for the 2026 election under group voting ticket rules, while campaigning to end those same rules. That tension is named rather than finessed, and it holds regardless of whether reform abolishes group voting tickets before or after polling day. If Fusion wins a seat partly through preference flows, any subsequent push for preference-deal disclosure is open to the criticism that the mechanism which helped deliver the seat is being restricted behind the winner. The policy's answer is that the existing system is corrupt regardless of who uses it, and that either winning a seat to push reform from inside, or reform arriving independently, are both acceptable outcomes — the disclosure requirement is the part that doesn't happen automatically either way. The risk is that this argument is not accepted by other parties or by voters, that reform stalls indefinitely, or that Fusion fails to win any seat and has no parliamentary vehicle to advance the disclosure bill at all.",
    })
    .commit()

  console.log('✅ policy patched:', result._id)
}

async function main() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('SANITY_WRITE_TOKEN env var is required')
  }
  await patchHomePage()
  await patchPreferenceDealsPolicy()
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
