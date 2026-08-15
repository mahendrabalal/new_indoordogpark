const { createClient } = require('next-sanity');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ruuprk8g',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function getSlugs() {
  const posts = await client.fetch(`*[_type == "post"] { title, "slug": slug.current }`);
  console.log(JSON.stringify(posts, null, 2));
}
getSlugs().catch(console.error);
