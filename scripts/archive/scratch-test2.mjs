import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ruuprk8g',
  dataset: 'production',
  apiVersion: '2025-11-14',
  useCdn: false,
});

async function test() {
  try {
    const res = await client.fetch('count(*[_type == "parkSubmission"])');
    console.log("Sanity Fetch Result:", res);
  } catch (err) {
    console.error("Sanity Error:", err);
  }
}

test();
