const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-14',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  try {
    const slug = 'top-8-best-indoor-dog-parks-in-santa-ana-ca';
    console.log(`Cleaning up schema issues on post ${slug}...`);

    // 1. Find or create Dr. Emily Chen, DVM as an Author document
    let vetAuthor = await client.fetch(`*[_type == "author" && name match "*Emily Chen*"][0]`);
    if (!vetAuthor) {
      console.log('Creating Dr. Emily Chen, DVM author document...');
      vetAuthor = await client.create({
        _type: 'author',
        name: 'Dr. Emily Chen, DVM',
        slug: { _type: 'slug', current: 'dr-emily-chen-dvm' },
        bio: 'Dr. Emily Chen is a licensed veterinarian specializing in canine sports medicine, exercise physiology, and environmental heat stress mitigation.',
      });
    }

    // 2. Find Author Mahendra Balal
    let authorDoc = await client.fetch(`*[_type == "author" && name == "Mahendra Balal"][0]`);
    if (!authorDoc) {
      authorDoc = await client.create({
        _type: 'author',
        name: 'Mahendra Balal',
        slug: { _type: 'slug', current: 'mahendra-balal' },
        bio: 'Founder and lead canine infrastructure researcher at indoordogpark.org.',
      });
    }

    // 3. Find or create category
    let guideCategory = await client.fetch(`*[_type == "category" && (title match "*Guide*" || slug.current == "guides")][0]`);
    
    // 4. Find the post
    const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });
    if (!post) {
      console.error('Post not found in Sanity');
      return;
    }

    // 5. Clean up unknown fields and set proper references
    await client
      .patch(post._id)
      .unset(['content', 'htmlContent'])
      .set({
        author: { _type: 'reference', _ref: authorDoc._id },
        reviewedBy: { _type: 'reference', _ref: vetAuthor._id },
        factCheckedBy: { _type: 'reference', _ref: vetAuthor._id },
        ...(guideCategory ? { categories: [{ _type: 'reference', _ref: guideCategory._id, _key: 'guide-cat' }] } : {}),
      })
      .commit();

    console.log('✅ Successfully resolved all Sanity schema warnings and invalid property values!');
  } catch (err) {
    console.error('Error fixing Sanity schema:', err);
  }
}

main();
