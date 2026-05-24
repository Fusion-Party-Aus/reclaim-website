import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

const navigationData = {
  _type: 'navigation',
  title: 'Main Navigation',
  mainNav: [
    {
      label: 'Home',
      href: '/',
      order: 0,
      highlight: false
    },
    {
      label: 'About',
      href: '/about',
      order: 1,
      highlight: false
    },
    {
      label: 'Policies',
      href: '/policies',
      order: 2,
      highlight: false
    },
    {
      label: 'Manifesto',
      href: '/manifesto',
      order: 3,
      highlight: false
    },
    {
      label: 'FAQ',
      href: '/faq',
      order: 4,
      highlight: false
    }
  ],
  ctaButton: {
    label: 'Get Involved',
    href: '/get-involved',
    style: 'primary'
  },
  logo: {
    mainText: 'FUSION',
    subText: 'VICTORIA'
  }
};

async function importNavigation() {
  try {
    console.log('Importing navigation to Sanity...');
    
    const result = await client.create(navigationData);
    
    console.log('✅ Navigation imported successfully!');
    console.log('Document ID:', result._id);
    
  } catch (error) {
    console.error('❌ Error importing navigation:', error);
    process.exit(1);
  }
}

importNavigation();
