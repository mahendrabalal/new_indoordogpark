const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-14',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

async function main() {
  try {
    const res = await client.request({
      uri: '/data/mutate/production',
      method: 'POST',
      body: { mutations: [] }
    });
    console.log("SANITY_API_TOKEN Success:", res);
  } catch (err) {
    console.error("SANITY_API_TOKEN Error:", err.message);
  }
}

main();
