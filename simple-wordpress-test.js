// Simple WordPress API test without authentication
require('dotenv').config({ path: '.env.local' });

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if (!wordpressUrl) {
  console.error('❌ NEXT_PUBLIC_WORDPRESS_URL not found in .env.local');
  process.exit(1);
}

async function testWordPressAPI() {
  console.log('🔍 Testing WordPress REST API...');
  console.log(`📡 URL: ${wordpressUrl}`);

  try {
    // Test basic API connection
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/posts?per_page=5`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log('✅ WordPress API connection successful!');
    console.log(`📝 Found ${posts.length} posts`);

    if (posts.length === 0) {
      console.log('\n💡 No posts found. Create your first blog post in WordPress!');
      console.log('   Go to: https://californiadogparkblog.wordpress.com/wp-admin');
      console.log('   Then: Posts → Add New');
    } else {
      console.log('\n📋 Recent posts:');
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title.rendered}`);
      });
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
    console.log('2. Verify WordPress site is accessible');
    console.log('3. Check internet connection');
  }
}

testWordPressAPI();