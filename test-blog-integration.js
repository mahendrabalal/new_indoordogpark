// Simple test script to verify WordPress integration
// Run with: node test-blog-integration.js

require('dotenv').config({ path: '.env.local' });

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const username = process.env.WORDPRESS_USERNAME;
const password = process.env.WORDPRESS_PASSWORD;

if (!wordpressUrl || !username || !password) {
  console.error('❌ Missing WordPress configuration in .env.local');
  console.log('Please set NEXT_PUBLIC_WORDPRESS_URL, WORDPRESS_USERNAME, and WORDPRESS_PASSWORD');
  process.exit(1);
}

async function testWordPressConnection() {
  console.log('🔍 Testing WordPress connection...');
  console.log(`📡 URL: ${wordpressUrl}`);

  try {
    // Test basic API connection
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=1`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log('✅ WordPress API connection successful!');
    console.log(`📝 Found ${posts.length} posts`);

    // Test authentication
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const authResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?status=private`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    if (authResponse.ok) {
      console.log('✅ WordPress authentication successful!');
    } else {
      console.log('⚠️  WordPress authentication failed, but public access works');
    }

    // Test categories and tags
    const [categoriesResponse, tagsResponse] = await Promise.all([
      fetch(`${wordpressUrl}/wp-json/wp/v2/categories`),
      fetch(`${wordpressUrl}/wp-json/wp/v2/tags`)
    ]);

    if (categoriesResponse.ok && tagsResponse.ok) {
      const categories = await categoriesResponse.json();
      const tags = await tagsResponse.json();
      console.log(`📁 Found ${categories.length} categories`);
      console.log(`🏷️  Found ${tags.length} tags`);
    }

    console.log('\n🎉 WordPress integration is ready to use!');
    console.log('\nNext steps:');
    console.log('1. Run npm run dev');
    console.log('2. Visit http://localhost:3000/blog');
    console.log('3. Create your first blog post in WordPress');

  } catch (error) {
    console.error('❌ WordPress connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your WordPress URL is correct');
    console.log('2. Verify WordPress REST API is enabled');
    console.log('3. Check your Application Passwords are correct');
    console.log('4. Ensure your site is accessible');
  }
}

testWordPressConnection();