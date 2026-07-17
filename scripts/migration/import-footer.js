import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

const footerData = {
  _type: 'footer',
  title: 'Main Footer',
  logo: {
    mainText: 'FUSION',
    subText: 'VICTORIA'
  },
  socialLinks: [
    {
      platform: 'Instagram',
      icon: 'mdi:instagram',
      url: 'https://www.instagram.com/fusionpartyaus/',
      ariaLabel: 'Instagram'
    },
    {
      platform: 'Facebook',
      icon: 'mdi:facebook',
      url: 'https://www.facebook.com/FusionPartyAus/',
      ariaLabel: 'Facebook'
    },
    {
      platform: 'YouTube',
      icon: 'mdi:youtube',
      url: 'https://www.youtube.com/c/fusionpartyaus',
      ariaLabel: 'YouTube'
    },
    {
      platform: 'Bluesky',
      icon: 'mdi:cloud',
      url: 'https://bsky.app/profile/fusionparty.org.au',
      ariaLabel: 'Bluesky'
    },
    {
      platform: 'Twitter/X',
      icon: 'mdi:twitter',
      url: 'https://twitter.com/FusionPartyAus',
      ariaLabel: 'Twitter/X'
    },
    {
      platform: 'TikTok',
      icon: 'mdi:music-note',
      url: 'https://www.tiktok.com/@fusionpartyaus',
      ariaLabel: 'TikTok'
    },
    {
      platform: 'Mastodon',
      icon: 'mdi:mastodon',
      url: 'https://mastodon.au/@FusionPartyAus',
      ariaLabel: 'Mastodon'
    },
    {
      platform: 'Discord',
      icon: 'mdi:discord',
      url: 'https://www.fusionparty.org.au/discord',
      ariaLabel: 'Discord'
    },
    {
      platform: 'GitHub',
      icon: 'mdi:github',
      url: 'https://github.com/Fusion-Party-Aus',
      ariaLabel: 'GitHub'
    }
  ],
  resourceLinks: [
    {
      label: 'Code of Conduct',
      url: 'https://www.fusionparty.org.au/code_of_conduct'
    },
    {
      label: 'Constitution',
      url: 'https://www.fusionparty.org.au/constitution'
    },
    {
      label: 'Privacy Policy',
      url: 'https://www.fusionparty.org.au/privacy_policy'
    }
  ],
  banner: {
    text: '🚫 We Accept NO Corporate Donations',
    rotation: -0.5
  },
  authorization: 'Authorised by Drew Wolfendale, Fusion Party Victoria.'
};

async function importFooter() {
  try {
    console.log('Importing footer to Sanity...');
    
    const result = await client.create(footerData);
    
    console.log('✅ Footer imported successfully!');
    console.log('Document ID:', result._id);
    
  } catch (error) {
    console.error('❌ Error importing footer:', error.message);
    process.exit(1);
  }
}

importFooter();
