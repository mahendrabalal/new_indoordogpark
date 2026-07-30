require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

// Prioritize the specific write token if provided, otherwise fallback to the general token
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ruuprk8g',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: token
});

function replaceInObject(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/2025/g, '2026');
  }
  if (Array.isArray(obj)) {
    return obj.map(item => replaceInObject(item));
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = replaceInObject(obj[key]);
    }
    return newObj;
  }
  return obj;
}

async function updatePosts() {
  if (!token) {
    console.error("No token found. Please set SANITY_API_WRITE_TOKEN in .env.local");
    return;
  }

  const posts = await client.fetch(`*[_type == "post" && (title match "*2025*" || excerpt match "*2025*" || pt::text(body) match "*2025*")]{
    _id,
    title,
    excerpt,
    body
  }`);
  
  console.log(`Found ${posts.length} posts to update.`);
  
  let successCount = 0;
  for (const post of posts) {
    console.log(`Updating post: ${post.title} (ID: ${post._id})`);
    
    const newTitle = typeof post.title === 'string' ? post.title.replace(/2025/g, '2026') : post.title;
    const newExcerpt = typeof post.excerpt === 'string' ? post.excerpt.replace(/2025/g, '2026') : post.excerpt;
    const newBody = post.body ? replaceInObject(post.body) : post.body;
    
    try {
      await client
        .patch(post._id)
        .set({
          title: newTitle,
          excerpt: newExcerpt,
          body: newBody
        })
        .commit();
      console.log(`  -> Successfully updated ID: ${post._id}`);
      successCount++;
    } catch (err) {
      console.error(`  -> Failed to update ID: ${post._id}`, err.message);
    }
  }
  
  console.log(`Finished updating posts. Successfully updated ${successCount} out of ${posts.length}.`);
}

updatePosts().catch(console.error);
