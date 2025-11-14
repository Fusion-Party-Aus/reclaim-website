import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

const homePageData = {
  _type: 'homePage',
  title: 'Fusion Victoria | Reclaim Our State',
  hero: {
    title: 'RECLAIM OUR STATE',
    subtitle: "They wasted billions. We'll build what you need.",
    stats: [
      { number: '4', label: 'Electorates' },
      { number: '847', label: 'Volunteers' },
      { number: '$2.8B', label: "Waste We'll Cut" }
    ]
  },
  theftSection: {
    heading: 'THE VICTORIAN THEFT',
    description: "They've been in power for decades. Both major parties. Here's what they've stolen from you while taking donations from developers, fossil fuel companies, and private hospitals.",
    cards: [
      {
        category: 'Transport',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600',
        amount: '$750 MILLION',
        description: 'The Melton Line has been "coming soon" since 2009. That\'s 16 years of broken promises. Every year of delay costs $50 million in interest.',
        impact: 'Two hours a day in traffic or on packed diesel trains.',
        link: '/policy-transport',
        linkText: "WE'LL BUILD IT IN 4 YEARS"
      },
      {
        category: 'Infrastructure Waste',
        imageUrl: 'https://images.unsplash.com/photo-1581092918484-8313e0e767b7?w=600',
        amount: '$9.5 BILLION',
        description: 'West Gate Tunnel budgeted at $5.5 billion. Now tracking toward $15 billion. That\'s $9.5 billion in cost blowouts. Enough to build 38,000 public homes.',
        impact: 'Your taxes wasted on mates\' contracts.',
        link: '/policies',
        linkText: "WE'LL CUT WASTE BY 30%"
      },
      {
        category: 'Housing',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
        amount: '$3.2 BILLION',
        description: 'Victorian property investors claimed $3.2 billion in tax breaks last year through negative gearing. While you pay 60% of your income in rent.',
        impact: 'Can\'t afford to buy. Can barely afford to rent.',
        link: '/policy-housing',
        linkText: "WE'LL BUILD 50,000 PUBLIC HOMES"
      },
      {
        category: 'Healthcare',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
        amount: '6+ MONTHS',
        description: 'Average wait for elective surgery in Victorian public hospitals. Meanwhile, $1.5 billion in tax revenue subsidises private hospitals through exemptions.',
        impact: 'Waiting in pain while rich people jump the queue.',
        link: '/policy-healthcare',
        linkText: "WE'LL BUILD 4 NEW HOSPITALS"
      },
      {
        category: 'Workers\' Rights',
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600',
        amount: '$1.35 BILLION',
        description: 'Victorian workers lose $1.35 billion per year to wage theft. Current penalties are cheaper than paying people properly. It\'s a calculated business decision.',
        impact: 'Your boss steals your wages. Gets a slap on the wrist.',
        link: '/policy-workers',
        linkText: "WE'LL MAKE IT A CRIME"
      },
      {
        category: 'Climate & Energy',
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600',
        amount: '30% FROM COAL',
        description: 'Victoria still generates 30% of electricity from coal. They subsidise fossil fuels while your energy bills climb and the planet burns.',
        impact: 'Higher bills. Hotter summers. Your kids\' future stolen.',
        link: '/policies',
        linkText: '100% RENEWABLES BY 2030'
      }
    ]
  },
  electoratesSection: {
    heading: 'OUR CANDIDATES',
    description: 'Local people with real plans to fix the failures in their communities. Not career politicians. Not beholden to donors.',
    callToAction: {
      heading: 'Not in one of these electorates?',
      description: 'We\'re building campaigns across Victoria. Help us bring Fusion to your area.',
      buttonText: 'VOLUNTEER IN YOUR AREA',
      buttonLink: '/get-involved'
    }
  },
  manifestoSection: {
    heading: 'THE VICTORIA MANIFESTO',
    description: 'Our complete plan to fix Victoria\'s broken systems. Every policy costed. Every claim sourced. Every promise tracked.',
    stats: [
      { number: '50,000', label: 'Public homes over 4 years', size: 'small' },
      { number: '$2.8B', label: 'Infrastructure waste cut per year', size: 'large' },
      { number: '4', label: 'New public hospitals', size: 'small' },
      { number: '2030', label: '100% renewable electricity', size: 'medium' }
    ]
  },
  joinSection: {
    heading: 'JOIN THE FIGHT',
    description: 'Victoria won\'t fix itself. The major parties have had decades and delivered failure. Real change requires a movement of working people who\'ve had enough.',
    cards: [
      {
        emoji: '🚪',
        title: 'VOLUNTEER',
        description: 'Door knock in your electorate. Phone bank. Help at events. Even a few hours makes a difference. This is how we win.',
        buttonText: 'SIGN UP NOW',
        buttonLink: '/get-involved',
        buttonStyle: 'primary',
        size: 'medium'
      },
      {
        emoji: '💰',
        title: 'DONATE',
        description: 'We don\'t take corporate money. Every dollar comes from people like you, $20-$50 at a time. That\'s why we answer to you.',
        buttonText: 'CONTRIBUTE',
        buttonLink: '/get-involved#donate',
        buttonStyle: 'secondary',
        size: 'small'
      },
      {
        emoji: '📢',
        title: 'SPREAD THE WORD',
        description: 'Share our policies. Print our fact sheets. Talk to your neighbors. When people complain, tell them there\'s a real alternative.',
        buttonText: 'GET MATERIALS',
        buttonLink: '/manifesto',
        buttonStyle: 'secondary',
        size: 'medium'
      }
    ]
  },
  seo: {
    metaTitle: 'Fusion Victoria | Reclaim Our State. They Stole It. We\'re Taking It Back.',
    metaDescription: 'Contesting Victoria\'s 2026 state election. 50,000 public homes. Melton Line in 4 years. End infrastructure waste. Real solutions for Melbourne\'s West and all of Victoria.'
  }
};

async function importHomePage() {
  try {
    console.log('Importing home page to Sanity...');
    
    const result = await client.create(homePageData);
    
    console.log('✅ Home page imported successfully!');
    console.log('Document ID:', result._id);
    
  } catch (error) {
    console.error('❌ Error importing home page:', error);
    process.exit(1);
  }
}

importHomePage();
