/**
 * Seeds the structured `manifestoPage` singleton in Sanity (used by /manifesto).
 * Run with: SANITY_WRITE_TOKEN=your_token npm run import:manifesto-page
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN
})

const manifestoPage = {
  _type: 'manifestoPage',
  title: 'Victoria Belongs To Victorians',
  subtitle:
    "They sold your train station. They sold your toll road. They sold your lottery. Now they want your vote — by promising to argue about the bill a little differently. We're here to take back what's ours.",
  heroImage: '/color_panel_rally.jpg',
  lede: {
    badge: 'Not A Budget Document. A Promise.',
    body: "Every train line in this state was built with your money. It doesn't belong to you anymore. A private consortium owns the shops at Southern Cross. A toll company owns the road into the city until 2045. A gambling corporation owns Victoria's lottery until 2068. Every day, money that should be yours walks past you into a shareholder report on the other side of the world.",
    stats: [
      { value: '$1.145B', label: 'Lottery deal premium, May 2026', variant: 'magenta' },
      { value: '2068', label: 'Length of that lottery monopoly', variant: 'mint' },
      { value: '2045', label: 'CityLink toll concession runs to', variant: 'yellow' },
      { value: '2–2.5x', label: 'Est. value Victoria gave away on the lottery deal', variant: 'magenta' }
    ],
    footnote:
      "That lottery deal landed just in time to cover almost the entire budget surplus the government's campaigning on. We don't know if the timing was coincidence. We do know a 40-year monopoly got sold for a one-year accounting win — and that's a bad trade either way."
  },
  lieBlock: {
    eyebrow: 'Thirty Years, Two Parties, One Lie',
    headline:
      "We sold the income from your infrastructure to private companies, and we're still paying the bill.",
    body: 'Two parties, two accents, same story: borrow more or borrow less, spend more or cut more — neither will say the sentence that admits what they did. They built the trains. They handed the revenue away. You got the debt. Someone else got the dividend.'
  },
  promises: [
    {
      icon: 'mdi:train',
      title: 'Every station becomes yours again',
      body: "When a private operator's contract ends, it doesn't get renewed. The state takes the asset back and keeps every dollar of revenue. Break the contract early, and we take it back for nothing."
    },
    {
      icon: 'mdi:home-city',
      title: 'A public developer that never sells what it builds',
      body: "A public fund builds housing on state-owned land near train stations — tens of thousands of homes, then more. We keep it forever and rent it at a price that doesn't bankrupt the person paying it."
    },
    {
      icon: 'mdi:parking',
      title: 'Land-banking near stations stops paying off',
      body: "Sitting on empty land next to a station the public just upgraded gets more expensive every year you do nothing with it. This never touches anyone's home — it targets speculators, not families."
    },
    {
      icon: 'mdi:sword-cross',
      title: 'We out-build the developers ripping you off',
      body: 'The state builds the same homes private developers do, at cost, no profit margin — and undercuts them. Same as Medicare does to insurers, or Australia Post does to couriers.'
    },
    {
      icon: 'mdi:cash-refund',
      title: 'Every Victorian gets a cheque',
      body: "Once the state owns these assets and they're earning money, a share comes back to you — a direct cash payment, every year, growing over time. Like Alaska has paid its residents since 1982."
    },
    {
      icon: 'mdi:alert-decagram',
      title: 'Crime is the symptom. Housing is the disease.',
      body: "A generation locked out of housing and priced out of stability is the upstream cause of Victoria's crime wave. Fix the economics, and you fix more of it than another decade of bail-law theatre ever will."
    }
  ],
  whyNobody: {
    badge: 'Why Nobody Else Will Do This',
    body: "Because doing this means admitting what they did. Labor signed the contracts. The Coalition wants to sign more, just with different beneficiaries. Both have spent thirty years treating a handful of corporate partners as more important to keep happy than the people who actually live here. We're not interested in managing that system more politely. We're interested in ending it."
  },
  notPromising: {
    intro:
      "We're not going to pretend this fixes everything overnight — we'd rather you trust us in five years than believe us for five minutes.",
    items: [
      {
        icon: 'mdi:bank',
        text: "The pension fix doesn't add a dollar to this year's budget — it stops the state borrowing more for an old promise, and that's still real."
      },
      {
        icon: 'mdi:home-group',
        text: "The housing fund doesn't deliver 100,000 homes on day one — it delivers tens of thousands in the first wave, and compounds from there."
      },
      {
        icon: 'mdi:cash-multiple',
        text: "The dividend doesn't hit every bank account next year — it starts with the first tenants, and grows until it reaches everyone."
      }
    ]
  },
  oneSeat: {
    heading: 'One Seat Can Start This',
    body: "You don't need to win government to force this onto the table. One seat with a clear mandate — refusing supply, refusing to wave through the next thirty-year contract — can make every contract renewal a fight instead of a formality."
  },
  closing: {
    quote:
      'Every dollar Victoria borrows should buy something Victorians keep. Everything we already own should start paying us back — starting now, not someday.',
    buttons: [
      { label: 'Read The Full Plan', href: '/vision', icon: 'mdi:book-open', style: 'magenta' },
      { label: 'Get Involved', href: '/get-involved', icon: 'mdi:hand-heart', style: 'black' }
    ]
  }
}

async function importManifestoPage () {
  console.log('Starting manifestoPage import...\n')

  try {
    const existing = await client.fetch('*[_type == "manifestoPage"][0]')

    if (existing) {
      console.log(`  ⚠️  manifestoPage already exists (ID: ${existing._id}). Updating...`)
      const result = await client
        .patch(existing._id)
        .set(manifestoPage)
        .commit()
      console.log(`  ✅ Updated: ${result._id}`)
    } else {
      const result = await client.create(manifestoPage)
      console.log(`  ✅ Created: ${result._id}`)
    }
  } catch (error) {
    console.error('  ❌ Error importing manifestoPage:', error.message)
    process.exitCode = 1
  }

  console.log('\n✨ manifestoPage import complete!')
}

importManifestoPage().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
