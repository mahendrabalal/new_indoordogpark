const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
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
    const imagePath = '/Users/mahendrabalal/Desktop/santa-ana-indoor-dog-park-hero.jpg';

    console.log('Uploading image asset to Sanity...');
    const imageStream = fs.createReadStream(imagePath);
    const asset = await client.assets.upload('image', imageStream, {
      filename: 'santa-ana-indoor-dog-park-hero.jpg',
      contentType: 'image/jpeg',
    });

    console.log('Image uploaded successfully! Asset ID:', asset._id);

    const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });
    if (!post) {
      console.error('Post not found in Sanity');
      return;
    }

    const altText = "Dogs playing in a modern climate-controlled indoor dog park in Santa Ana, Orange County, California";
    const caption = "Modern indoor canine play arena in Santa Ana, CA featuring impact-cushioned rubber flooring, agility ramps, and continuous climate control to beat Southern California summer heat.";

    await client
      .patch(post._id)
      .set({
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
          alt: altText,
          caption: caption,
        },
      })
      .commit();

    console.log('✅ Featured image attached to Sanity blog post!');
  } catch (err) {
    console.error('Error uploading image to Sanity:', err);
  }
}

main();
