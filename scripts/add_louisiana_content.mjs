import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

async function uploadImage(filePath) {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}`;
  const imageBuffer = fs.readFileSync(filePath);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
      Authorization: `Bearer ${token}`,
    },
    body: imageBuffer,
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Failed to upload image: ${data.message}`);
  }
  return data.document._id;
}

async function main() {
  console.log('Uploading Louisiana Hero Image...');
  const louisianaImageId = await uploadImage('/Users/mahendrabalal/.gemini/antigravity/brain/788a9056-6c81-40c8-9170-9d5fedf770b4/louisiana_state_hero_1786662073684.jpg');
  
  console.log('Uploading New Orleans Hero Image...');
  const newOrleansImageId = await uploadImage('/Users/mahendrabalal/.gemini/antigravity/brain/788a9056-6c81-40c8-9170-9d5fedf770b4/new_orleans_city_hero_1786662082577.jpg');

  const mutation = {
    mutations: [
      {
        createOrReplace: {
          _id: 'state-louisiana',
          _type: 'stateContent',
          name: 'Louisiana',
          abbr: 'LA',
          slug: { _type: 'slug', current: 'louisiana' },
          featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: louisianaImageId }
          },
          customContent: {
            heroEyebrow: 'Southern Charm & Warm Weather',
            heroHeading: 'Dog Parks in Louisiana',
            heroDescription: 'From the historic streets of New Orleans to the sprawling bayous, find the best climate-controlled and shaded indoor dog parks to escape the Louisiana heat and humidity.',
            heroImageAlt: 'Beautiful moss-draped oak tree in Louisiana park',
          }
        }
      },
      {
        createOrReplace: {
          _id: 'city-new-orleans',
          _type: 'cityContent',
          city: 'New Orleans',
          state: 'Louisiana',
          slug: { _type: 'slug', current: 'new-orleans-la' },
          featuredImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: newOrleansImageId }
          },
          customContent: {
            heroEyebrow: 'The Big Easy',
            heroHeading: 'Indoor Dog Parks in New Orleans',
            heroDescription: 'Keep your dog safe from the intense Gulf Coast heat, humidity, and sudden downpours with New Orleans\' top-rated premium indoor dog daycares and play facilities.',
            heroImageAlt: 'Historic New Orleans French Quarter architecture',
          }
        }
      }
    ]
  };

  console.log('Creating State and City Content documents in Sanity...');
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
  console.log('Done!', JSON.stringify(data, null, 2));
}

main().catch(console.error);
