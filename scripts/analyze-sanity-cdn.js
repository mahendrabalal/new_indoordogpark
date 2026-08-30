const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'ruuprk8g',
  dataset: 'production',
  apiVersion: '2024-11-14',
  useCdn: true, // Use CDN to avoid standard API quota
});

async function analyzeSanity() {
  try {
    const posts = await client.fetch(`*[_type == "post"]{ 
      title, 
      "slug": slug.current,
      "contentString": pt::text(content)
    }`);
    
    console.log(`Fetched ${posts.length} posts from Sanity CDN.`);
    
    let aiFillerCount = 0;
    const aiPhrases = [
      'seamless', 'premier', 'vibrant', 'bustling', 'holistic', 
      'state-of-the-art', 'game-changer', 'in this comprehensive guide'
    ];
    
    let cannibalizingCount = 0;
    const citySlugs = [
      'anaheim', 'lexington-ky', 'orlando', 'riverside-ca', 'stockton-ca',
      'honolulu', 'islip', 'new-orleans', 'corpus-christi-tx', 'irvine-ca',
      'newark-nj', 'santa-ana-ca'
    ];
    
    posts.forEach(post => {
      // Check AI filler
      const content = (post.contentString || '').toLowerCase();
      let hasAi = false;
      for (const phrase of aiPhrases) {
        if (content.includes(phrase)) {
          hasAi = true;
          break;
        }
      }
      if (hasAi) aiFillerCount++;
      
      // Check cannibalization
      for (const city of citySlugs) {
        if (post.slug && post.slug.includes(city) && post.slug.includes('top')) {
          cannibalizingCount++;
          break;
        }
      }
    });
    
    console.log(`- ${aiFillerCount} posts contain AI filler phrases.`);
    console.log(`- ${cannibalizingCount} posts appear to be cannibalizing city listicles.`);
    
  } catch (error) {
    console.error("Error fetching from Sanity:", error.message);
  }
}

analyzeSanity();
