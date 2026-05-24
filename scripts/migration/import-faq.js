import sanityClient from '@sanity/client'

const projectId = 'qwl3f8jb'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_WRITE_TOKEN environment variables.')
  process.exit(1)
}

const client = sanityClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-11-13'
})

function block (text, style = 'normal') {
  return {
    _type: 'block',
    style,
    children: [
      {
        _type: 'span',
        text
      }
    ]
  }
}

async function run () {
  const faqs = [
    // DEBT & FISCAL RESPONSIBILITY
    {
      category: 'debt',
      question: 'Q: "You\'ll blow out the debt!"',
      slug: 'youll-blow-out-the-debt',
      order: 1,
      answer: [
        block('Current trajectory (major parties):', 'h4'),
        block('• Debt reaches $250B by 2035'),
        block('• Debt-to-GSP reaches 32%'),
        block('• $9.5B wasted on West Gate Tunnel overruns alone'),
        block('• 30% average cost blowouts on major projects'),
        block(''),
        block('Fusion trajectory:', 'h4'),
        block('• Debt peaks at $210B in 2028'),
        block('• Debt-to-GSP stabilizes at 25% by 2035'),
        block('• Infrastructure waste cut from 30% to 10% (saves $1.5B/year)'),
        block('• Revenue-generating assets: Public housing returns 4%, renewables return $280M/year net'),
        block(''),
        block("We're not afraid of debt when it builds assets that generate returns. We're afraid of waste, which is what they've been doing.")
      ]
    },
    {
      category: 'debt',
      question: 'Q: "How do you actually pay for all this?"',
      slug: 'how-do-you-pay-for-all-this',
      order: 2,
      answer: [
        block('Three mechanisms: Stop waste, grow revenue, smart investment.'),
        block(''),
        block('Stop the Waste', 'h4'),
        block('$2.8B/year saved'),
        block('• Infrastructure overruns cut 30%→10%: $1.5B/year'),
        block('• End private hospital tax exemptions: $1.5B/year'),
        block('• Procurement reform: Redirect savings to public services'),
        block(''),
        block('Grow the Revenue', 'h4'),
        block('$2B/year additional'),
        block('• Land tax transition (properties >$1M): $800M/year'),
        block('• State renewables net returns: $280M/year'),
        block('• Public housing rent: $1.2B/year (once built)'),
        block(''),
        block('Smart Investment', 'h4'),
        block('Assets that pay for themselves'),
        block('• Public housing: 4% direct return, 8% with externalities'),
        block('• Renewables: $280M/year profit'),
        block('• Transport: Reduces congestion costs, enables economic activity'),
        block(''),
        block('Total savings + revenue: $4.8B/year'),
        block('Total new spending: $3.9B/year healthcare + $1.5B/year transport operational + other programs'),
        block('Net impact: Sustainable fiscal path with debt-to-GSP declining to 25%')
      ]
    },

    // LEFT ATTACKS
    {
      category: 'left-attacks',
      question: 'Q: "You\'re just neoliberals / corporate shills / crypto-Liberals!"',
      slug: 'youre-just-neoliberals',
      order: 1,
      answer: [
        block("Greens say: 'You support markets and economic growth, therefore you're right-wing!'"),
        block("Labor says: 'You'll split the progressive vote and let Liberals win!'"),
        block(''),
        block("We're building 50,000 public homes. Criminalizing wage theft. Supporting UBI. Pushing 100% renewables by 2030. Ending private hospital tax breaks."),
        block("That's more left-wing than Labor's actual policies."),
        block(''),
        block("The difference is we're not afraid to use markets where they work, and reject them where they don't:"),
        block('Housing: Market has failed. Build public housing at scale.'),
        block('Healthcare: For-profit hospitals get tax breaks while public system fails. End the exemptions, fund public.'),
        block("Energy: Market won't build fast enough. State builds 2GW renewables, proves profitability, market follows."),
        block('Transport: Obviously public good. Build it, fund it, run it publicly.'),
        block("We're pragmatic progressives. We use whatever tools work to improve people's lives.")
      ]
    },
    {
      category: 'left-attacks',
      question: 'Q: "Land Value Tax hurts renters / working families!"',
      slug: 'land-value-tax-hurts-renters',
      order: 2,
      answer: [
        block("Labor/Greens say: 'Property taxes get passed on to renters. You're hurting the people you claim to help!'"),
        block(''),
        block("LVT can't be passed on to renters. That's not how land economics works."),
        block('Landlords already charge maximum rent the market will bear. If they could charge more, they already would be.'),
        block(''),
        block('Who pays:', 'h4'),
        block('• Our LVT increase targets properties valued >$1M'),
        block("• That\'s not working families\' homes"),
        block('• That\'s investors with multiple properties and commercial landholders'),
        block(''),
        block('Who benefits:', 'h4'),
        block('• 50,000 public homes funded partly by this revenue'),
        block('• Lower land speculation = lower purchase prices over time'),
        block('• More efficient land use = more housing supply'),
        block(''),
        block('Every serious economist from Adam Smith to Henry George to modern Nobel Prize winners agrees: LVT is the most efficient tax.')
      ]
    },
    {
      category: 'left-attacks',
      question: 'Q: "You\'re splitting the progressive vote!"',
      slug: 'youre-splitting-the-progressive-vote',
      order: 3,
      answer: [
        block("Labor says: 'Every vote for Fusion is a vote for the Liberals! You'll let them win!'"),
        block(''),
        block("We have preferential voting. Your vote isn't wasted even if we don't win."),
        block(''),
        block('How it works:', 'h4'),
        block('• You put Fusion first'),
        block("• If we don't win, your vote flows to your second preference"),
        block("• Liberals don't benefit unless you preference them (don't do that)"),
        block(''),
        block('What your Fusion vote does:', 'h4'),
        block('• Sends message that corporate-funded major parties are losing support'),
        block('• Forces Labor/Greens to explain why they won\'t match our policies'),
        block('• Builds long-term movement (Greens started with 2.8% in 1996, now they\'re kingmakers)'),
        block('• If we win seats, gives us platform to expose waste and force change'),
        block(''),
        block("Labor had 12 years to build public housing, fix transport, criminalise wage theft. They didn't. They won't. Vote for what you actually want.")
      ]
    },

    // RIGHT ATTACKS
    {
      category: 'right-attacks',
      question: 'Q: "You\'re socialists / communists / will destroy the economy!"',
      slug: 'youre-socialists-will-destroy-the-economy',
      order: 1,
      answer: [
        block("Liberals say: 'Public housing is socialism! You\'ll crash the economy!'"),
        block("One Nation says: 'You\'re left-wing extremists!'"),
        block(''),
        block("We're capitalists who think markets work better when everyone has a foundation."),
        block(''),
        block("Public housing isn't socialism. It's smart investment:", 'h4'),
        block('• Costs $25B to build 50,000 homes'),
        block('• Generates $1.2B/year in rent revenue (4% return)'),
        block('• Saves $450M/year in homelessness/health/justice costs'),
        block('• Construction creates 25,000 jobs during build'),
        block('• Economic multiplier: Every $1 spent generates $1.80-$2.20 in economic activity'),
        block(''),
        block('This is how Singapore built prosperity: 80% homeownership through public housing. Not socialism - smart capitalism.'),
        block("We're not seizing private property. We're building public assets that generate returns and create a stable consumer base for private business.")
      ]
    },
    {
      category: 'right-attacks',
      question: 'Q: "Immigration is the real problem!"',
      slug: 'immigration-is-the-real-problem',
      order: 2,
      answer: [
        block("One Nation says: 'Stop immigration! Immigrants take our jobs and houses!'"),
        block('Some Liberals dog-whistle: "Population growth outpacing infrastructure..."'),
        block(''),
        block("Immigrants don't take your jobs or houses. Your boss steals your wages. Developers don't build public housing. Blame the right people."),
        block(''),
        block('Our framing: Workers vs Exploiters', 'h4'),
        block('Blame: Property investors, corporate tax dodgers, wage-stealing bosses, political donors'),
        block('Never: Migrants, welfare recipients, other workers'),
        block("We're all working people being ripped off.")
      ]
    },
    {
      category: 'right-attacks',
      question: 'Q: "Universal Basic Income will make people lazy!"',
      slug: 'universal-basic-income-will-make-people-lazy',
      order: 3,
      answer: [
        block("Liberals/One Nation say: 'Why would anyone work if you give them free money? Welfare queens!'"),
        block(''),
        block('Every UBI trial shows people keep working. They just have power to refuse exploitative jobs.'),
        block(''),
        block('Evidence from trials (Finland, Kenya, Canada):', 'h4'),
        block('• Employment rates stay same or increase slightly'),
        block('• People retrain, start businesses, care for family'),
        block('• Mental health improves, domestic violence decreases'),
        block("• Kids' educational outcomes improve (stable housing)"),
        block('• People don\'t stop working - they stop accepting bad jobs for bad pay'),
        block(''),
        block('You already subsidize corporate welfare:', 'h4'),
        block('• $300B in negative gearing and capital gains tax discounts over 10 years'),
        block('• Billions in fossil fuel subsidies'),
        block('• Private hospital tax exemptions: $1.5B/year'),
        block(''),
        block('We give welfare to property investors and corporations. Why not people?')
      ]
    },

    // GENERAL
    {
      category: 'general',
      question: 'Q: "Who funds Fusion?"',
      slug: 'who-funds-fusion',
      order: 1,
      answer: [
        block('People. Not corporations. Not unions. Not property developers.'),
        block(''),
        block('Funding principles:', 'h4'),
        block('• Individual donations only (capped at $1,500/year per person)'),
        block('• No corporate donations'),
        block('• No union donations (though we support workers\' rights)'),
        block('• No property developer donations'),
        block('• Quarterly disclosure (not just annually)'),
        block('• All donors over $500 published'),
        block(''),
        block("We can fight for you because we're funded by you.")
      ]
    },
    {
      category: 'general',
      question: 'Q: "Are you just another protest vote that won\'t achieve anything?"',
      slug: 'are-you-just-another-protest-vote',
      order: 2,
      answer: [
        block('Every movement starts somewhere. Greens won 2.8% in 1996. Now they\'re kingmakers.'),
        block(''),
        block('Even if we don\'t form government, we force change:', 'h4'),
        block('• Every vote sends message that corporate-funded parties are losing support'),
        block('• If we win seats, we get Question Time to expose waste'),
        block('• We get budget committee positions to investigate'),
        block('• We get media platform to shift debate'),
        block('• We get balance-of-power leverage if no majority'),
        block(''),
        block('The ideas matter more than who gets credit.')
      ]
    },
    {
      category: 'general',
      question: 'Q: "Where can I see your full costings?"',
      slug: 'where-can-i-see-your-full-costings',
      order: 3,
      answer: [
        block('You can read our costings at fusionparty.org.au/costings.'),
        block(''),
        block('We publish:', 'h4'),
        block('• Line-by-line budget breakdown'),
        block('• Funding sources for every commitment'),
        block('• Methodology and assumptions'),
        block('• Peer review by independent economists'),
        block('• Comparison to major party costings (or lack thereof)')
      ]
    },

    // ELECTORAL STRATEGY
    {
      category: 'electoral',
      question: 'Q: "Which seats are you contesting?"',
      slug: 'which-seats-are-you-contesting',
      order: 1,
      answer: [
        block('Target electorates (confirmed):', 'h4'),
        block('• Melton - Melton Line electrification priority'),
        block('• Pakenham - Clyde Line duplication priority'),
        block('• Sunbury - Electrification and bus network priority'),
        block('• Werribee - Wyndham Vale parking and hospital priority')
      ]
    },
    {
      category: 'electoral',
      question: 'Q: "How should I preference?"',
      slug: 'how-should-i-preference',
      order: 2,
      answer: [
        block('We don\'t tell you how to vote beyond "put Fusion first." But here\'s our thinking.'),
        block(''),
        block('After Fusion, preference based on:', 'h4'),
        block('• Who\'s most likely to adopt our policies'),
        block('• Who takes least corporate donations'),
        block('• Who\'s published real costings (not just promises)'),
        block('• Who\'s fighting for workers vs donors')
      ]
    },

    // POLICY DETAILS
    {
      category: 'policy',
      question: 'Q: "Why 50,000 homes specifically?"',
      slug: 'why-50000-homes-specifically',
      order: 1,
      answer: [
        block('Based on actual need:', 'h4'),
        block('• 116,000 people on public housing waitlist'),
        block('• Average wait time: 6+ years'),
        block('• Victoria currently builds ~500 public homes/year'),
        block('• At current rate, would take 232 years to clear waitlist'),
        block(''),
        block('12,500 homes/year for 4 years:', 'h4'),
        block('• Clears ~43% of current waitlist'),
        block('• Accommodates ongoing population growth'),
        block('• Matches construction industry capacity with ramp-up'),
        block('• Fiscally sustainable with our funding model')
      ]
    },
    {
      category: 'policy',
      question: 'Q: "What about rural/regional Victoria?"',
      slug: 'what-about-rural-regional-victoria',
      order: 2,
      answer: [
        block('30% of our public housing allocation goes to regional Victoria.'),
        block(''),
        block('Regional priorities:', 'h4'),
        block('• High-speed rail Stage 1 (Geelong/Ballarat)'),
        block('• Public housing in regional centers'),
        block('• Community health centres in underserved areas'),
        block('• Renewable energy projects create regional jobs')
      ]
    },
    {
      category: 'policy',
      question: 'Q: "What\'s your position on [specific issue not in manifesto]?"',
      slug: 'whats-your-position-on-issues-not-in-manifesto',
      order: 3,
      answer: [
        block("If it's not in our manifesto, we haven't developed a position yet."),
        block(''),
        block('We\'re honest about what we don\'t know:', 'h4'),
        block('• We focus on core issues where we have evidence-based solutions'),
        block('• We don\'t make up policy on the spot for votes'),
        block('• If you think we should develop policy on something, tell us'),
        block('• We\'re building in public - help us build better')
      ]
    }
  ]

  for (const faq of faqs) {
    const doc = {
      _type: 'faq',
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      slug: {
        _type: 'slug',
        current: faq.slug
      }
    }

    try {
      const created = await client.create(doc)
      console.log('Created FAQ:', created._id, '-', faq.question)
    } catch (err) {
      console.error('Error creating FAQ', faq.question, err.message)
    }
  }

  console.log('FAQ import complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
