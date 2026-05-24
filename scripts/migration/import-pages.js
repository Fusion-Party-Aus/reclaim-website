/**
 * Script to migrate static Astro pages to Sanity CMS
 * Run with: SANITY_WRITE_TOKEN=your_token npm run import:pages
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-11-13',
  token: process.env.SANITY_WRITE_TOKEN
})

const pages = [
  {
    _type: 'page',
    title: 'About Fusion Victoria',
    slug: { _type: 'slug', current: 'about' },
    subtitle: 'Who we are and what we stand for',
    metaDescription: 'Learn about Fusion Party Victoria, our values, and why we\'re different from the major parties.',
    body: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Who We Are' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Fusion Party Victoria is a progressive political party fighting for working Victorians. We take no corporate donations, follow evidence-based policy, and believe government should work for people - not property developers and corporate donors.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Our Story' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'We started because we were tired. Tired of politicians promising infrastructure and delivering excuses. Tired of watching our friends move interstate because they couldn\'t afford rent. Tired of the same two parties taking corporate money and wondering why nothing changes.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'So we built something different. A party that runs on evidence, not ideology. That funds through small donations and volunteers, not property developers. That says what needs to be said, not what focus groups want to hear.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Our Values' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '🗽 Personal Liberty' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Maximum net freedom. You should be free to live your life, make your own choices, and pursue your own goals - as long as you\'re not harming others. This means:'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'No government surveillance state tracking your every move' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Your body, your choice: reproductive healthcare, assisted dying, what you consume' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Freedom of speech and the right to criticise power without retaliation' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Privacy as a human right, online and offline' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '🤝 Social Justice' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Everyone deserves dignity, opportunity, and a fair go. Not because of where they were born, who they love, or how much money their parents had. This means:'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Housing as a human right, not an investment vehicle' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Free, world-class public healthcare and education' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Equal rights regardless of gender, sexuality, or identity' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'A social safety net that catches you when you fall' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '🌏 Environmental Responsibility' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'The planet is on fire. Acting on climate isn\'t virtue signaling - it\'s survival. And it\'s our responsibility to future generations. This means:'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Net zero by 2035, not 2050' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Massive investment in public transport and renewable energy' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Protection of native ecosystems and biodiversity' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: '📊 Evidence-Based Policy' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'What works matters more than what sounds good. We follow the data, listen to experts, and change our minds when evidence says we\'re wrong. This means:'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Policies backed by research and expert consensus' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Transparent costings and impact assessments' }]
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: 'Learning from what works in other jurisdictions' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'How We\'re Different' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            marks: ['strong'],
            text: 'We don\'t take corporate donations.'
          },
          {
            _type: 'span',
            text: ' Not from property developers. Not from mining companies. Not from anyone expecting favors. We fund through small donations and volunteers.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            marks: ['strong'],
            text: 'We follow the evidence.'
          },
          {
            _type: 'span',
            text: ' Our policies come from research, expert consultation, and what actually works - not focus groups or ideology.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            marks: ['strong'],
            text: 'We tell the truth.'
          },
          {
            _type: 'span',
            text: ' Even when it\'s uncomfortable. Housing is unaffordable because we treat it as an investment. Infrastructure is delayed because it\'s cheaper politically to promise than deliver. The climate crisis is here now.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            marks: ['strong'],
            text: 'We show our work.'
          },
          {
            _type: 'span',
            text: ' Every policy has transparent costings. Every commitment shows exactly how it\'s funded. No magical thinking. No "we\'ll find the money somewhere."'
          }
        ]
      }
    ]
  },
  {
    _type: 'page',
    title: 'Get Involved',
    slug: { _type: 'slug', current: 'get-involved' },
    subtitle: 'Join the movement to reclaim Victoria\'s future',
    metaDescription: 'Volunteer, donate, or spread the word. Join Fusion Party Victoria and help build a better future for all Victorians.',
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Movements aren\'t built by billionaires writing checks. They\'re built by ordinary people who decide they\'ve had enough. People like you.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '🗳️ Vote Fusion' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Check if we\'re running in your electorate. If yes, put us first on your ballot. Even if we don\'t win your seat, every vote sends a message that Victorians are done with corporate-funded major parties.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '🚪 Volunteer' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'This is where movements are won. Door knocking. Phone banking. Market stalls. Organizing. Even a few hours matters. We\'ll train you. You don\'t need experience. You just need to care.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '💬 Spread the Word' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Share this manifesto with one person who\'s tired of the major parties. When people complain about housing, transport, healthcare - tell them there\'s an alternative.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '💰 Donate' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'We don\'t take corporate money. Every dollar comes from people who believe in this movement. Small donations add up. Even $5 helps.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '📢 Run for Office' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'We need candidates in every electorate. Real people. From the community. Who understand what it\'s like to worry about rent, wait hours for a train, or wonder if you can afford to go to the doctor.'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'If you\'re from a growth corridor or outer suburb that\'s been neglected for decades - we especially need you. Email preselection@fusionparty.org.au'
          }
        ]
      }
    ]
  }
]

async function importPages () {
  console.log('Starting page import...\n')

  for (const page of pages) {
    try {
      console.log(`Importing: ${page.title}`)

      // Check if page already exists
      const existing = await client.fetch(
        '*[_type == "page" && slug.current == $slug][0]',
        { slug: page.slug.current }
      )

      if (existing) {
        console.log(`  ⚠️  Page "${page.slug.current}" already exists (ID: ${existing._id}). Skipping.`)
        continue
      }

      const result = await client.create(page)
      console.log(`  ✅ Created: ${result._id}`)
    } catch (error) {
      console.error(`  ❌ Error importing ${page.title}:`, error.message)
    }
  }

  console.log('\n✨ Page import complete!')
}

importPages().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
