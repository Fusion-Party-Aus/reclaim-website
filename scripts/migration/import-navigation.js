import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;
    const eqIdx = trimmedLine.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmedLine.substring(0, eqIdx).trim();
      const value = trimmedLine.substring(eqIdx + 1).trim();
      const cleanValue = value.replace(/^['"]|['"]$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = cleanValue;
      }
    }
  });
}

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

const navigationData = {
  _id: 'main-navigation',
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
      label: 'Vision',
      href: '/vision',
      order: 3,
      highlight: false
    },
    {
      label: 'Manifesto',
      href: '/manifesto',
      order: 4,
      highlight: false
    },
    {
      label: 'FAQ',
      href: '/faq',
      order: 5,
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
    
    if (!process.env.SANITY_WRITE_TOKEN) {
      console.error('❌ ERROR: SANITY_WRITE_TOKEN environment variable not set');
      process.exit(1);
    }

    const result = await client.createOrReplace(navigationData);
    
    console.log('✅ Navigation imported successfully!');
    console.log('Document ID:', result._id);
    
  } catch (error) {
    console.error('❌ Error importing navigation:', error.message);
    process.exit(1);
  }
}

importNavigation();
