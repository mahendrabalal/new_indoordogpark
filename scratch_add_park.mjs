import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

const mutation = {
  mutations: [
    {
      create: {
        _type: 'parkSubmission',
        name: 'Barx Parx',
        slug: { _type: 'slug', current: 'barx-parx-las-vegas' },
        status: 'approved',
        listingType: 'free',
        businessType: 'Specialty / Social Park',
        description: 'Barx Parx is a modern indoor dog park and social club located in Las Vegas, Nevada.',
        address: '8868 S. Eastern Ave #115',
        city: 'Las Vegas',
        state: 'Nevada',
        zipCode: '89123',
        phone: '702-518-6439',
        website: 'https://barxparx.com/locations/'
      }
    }
  ]
};

async function main() {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(mutation)
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
