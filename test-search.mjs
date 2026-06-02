import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ruuprk8g', // Need to find the actual project ID
  dataset: 'production',
  apiVersion: '2024-11-14',
  useCdn: true,
});

async function testSearch() {
  const searchTerm = 'off leash';
  const query = `*[_type == "post" && !(_id in path("drafts.**")) && 
    (title match $searchTerm)
  ] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    author->{
      name
    },
    categories[]->{
      title,
      slug
    }
  }`;

  try {
    const result = await sanityClient.fetch(query, { searchTerm, start: 0, end: 10 });
    console.log("Success:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

testSearch();
