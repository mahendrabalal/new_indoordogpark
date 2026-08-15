import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ruuprk8g',
  dataset: 'production',
  apiVersion: '2025-11-14',
  useCdn: false,
  token: 'skWsqv752a8jrnaBPBMG4UDl45ZpDmTsJuzWAluf9GWFhfufBSqp3cUp4f4FEZ1BT0lRilLrtwWEJL0B9Mbe2CycU4f9iWcbwZF7B0tNaq7iqAfB6maAEyQ74W8oe52mWzbhNsdUM3iMpGENRxET4l2jKpEh55zJHydzMBL32F7nRNuGc1Jf'
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
