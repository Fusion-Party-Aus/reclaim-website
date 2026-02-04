import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'qwl3f8jb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN
});

async function addBlogToNavigation() {
  try {
    console.log('Fetching existing navigation...');
    
    // Get the existing navigation document
    const navigation = await client.fetch('*[_type == "navigation"][0]');
    
    if (!navigation) {
      console.log('❌ No navigation document found. Please run import-navigation.js first.');
      process.exit(1);
    }
    
    console.log('Found navigation:', navigation._id);
    
    // Check if blog link already exists
    const hasBlog = navigation.mainNav.some(item => item.href === '/blog');
    
    if (hasBlog) {
      console.log('✅ Blog link already exists in navigation!');
      return;
    }
    
    // Add blog to navigation
    const updatedMainNav = [
      ...navigation.mainNav,
      {
        label: 'Blog',
        href: '/blog',
        order: 5,
        highlight: false
      }
    ];
    
    // Update the document
    await client
      .patch(navigation._id)
      .set({ mainNav: updatedMainNav })
      .commit();
    
    console.log('✅ Blog link added to navigation successfully!');
    console.log('Updated navigation items:');
    updatedMainNav.forEach(item => {
      console.log(`  - ${item.label} (${item.href}) - order: ${item.order}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating navigation:', error);
    process.exit(1);
  }
}

addBlogToNavigation();
