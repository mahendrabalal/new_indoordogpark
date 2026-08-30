const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'ruuprk8g',
  dataset: 'production',
  apiVersion: '2024-11-14',
  useCdn: true,
});

async function findListicles() {
  const posts = await client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))]{
    title,
    "slug": slug.current
  }`);

  const listicles = posts.filter(p => {
    if (!p.slug) return false;
    return p.slug.includes('top-') || p.slug.includes('best-indoor-dog-parks') || p.title.toLowerCase().includes('top 10') || p.title.toLowerCase().includes('top 5');
  });

  console.log(`Found ${listicles.length} listicle posts:\\n`);
  listicles.forEach(p => console.log(`- ${p.title} (slug: ${p.slug})`));
}

findListicles().catch(console.error);
