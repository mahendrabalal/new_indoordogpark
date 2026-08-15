const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-11-14',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

client.fetch(`count(*[_type == "post" && !(_id in path("drafts.**"))])`).then(count => {
  console.log(`Total posts: ${count}`);
}).catch(console.error);
