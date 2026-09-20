require('dotenv').config({ path: '.env.local.live' });
const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
function getImageUrl(source) {
  if (!source) return null;
  return builder.image(source).width(1200).height(630).quality(85).url();
}

async function getPost() {
  const query = `*[_type == "post" && slug.current == "house-safe-and-chew-proof-favorite-durable-dog-toys"][0]{
    _id, title, "slug": slug.current, excerpt, mainImage, featuredImage
  }`;

  try {
    const post = await client.fetch(query);
    const siteUrl = 'https://www.indoordogpark.org';
    const postUrl = `${siteUrl}/blog/${post.slug}?utm_source=beehiiv&utm_medium=newsletter&utm_campaign=auto_weekly_digest`;
    
    const heroImageUrl = getImageUrl(post.mainImage) || post.featuredImage || `${siteUrl}/images/hero/hero.webp`;
    const summaryText = post.excerpt || 'Discover our latest expert guide on indoor dog facilities, exercise strategies, and year-round canine wellness.';

    console.log("--- TITLE ---");
    console.log(post.title);
    console.log("--- SUBTITLE / EXCERPT ---");
    console.log(summaryText);
    console.log("--- HERO IMAGE URL ---");
    console.log(heroImageUrl);
    console.log("--- POST URL ---");
    console.log(postUrl);

  } catch (err) {
    console.error(err);
  }
}

getPost();
