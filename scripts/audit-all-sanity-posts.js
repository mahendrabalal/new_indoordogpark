const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'ruuprk8g', // from earlier discovery
  dataset: 'production',
  apiVersion: '2024-11-14',
  useCdn: true,
});

async function runFullAudit() {
  console.log("Fetching all posts from Sanity...");
  const posts = await client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))]{
    "slug": slug.current,
    title,
    excerpt,
    "wordCount": length(pt::text(body) + " "),
    "textContent": pt::text(body),
    "categories": count(categories),
    "tags": count(tags)
  }`);

  console.log(`Found ${posts.length} published posts. Analyzing...\\n`);

  const issues = {
    thinContent: [],
    highAiFiller: [],
    missingExcerpt: [],
    missingTaxonomy: [],
  };

  const aiPhrases = [
    'seamless', 'premier', 'vibrant', 'bustling', 'holistic', 
    'state-of-the-art', 'game-changer', 'in this comprehensive guide',
    "whether you're looking", 'when it comes to', 'not just a',
    'look no further', "it's important to note", 'nestled in', 'takes it to the next level'
  ];

  posts.forEach(post => {
    // 1. Thin content (< 500 words approximation, assuming 5 chars per word)
    const estimatedWords = Math.floor((post.wordCount || 0) / 5);
    if (estimatedWords < 500) {
      issues.thinContent.push({ slug: post.slug, words: estimatedWords });
    }

    // 2. Missing excerpt (crucial for SEO meta descriptions)
    if (!post.excerpt || post.excerpt.trim() === '') {
      issues.missingExcerpt.push(post.slug);
    }

    // 3. Missing Categories/Tags (Orphaned content structure)
    if (!post.categories && !post.tags) {
      issues.missingTaxonomy.push(post.slug);
    }

    // 4. AI Filler detection
    let aiScore = 0;
    const text = (post.textContent || '').toLowerCase();
    aiPhrases.forEach(phrase => {
      const regex = new RegExp('\\\\b' + phrase + '\\\\b', 'g');
      const matches = text.match(regex);
      if (matches) aiScore += matches.length;
    });

    if (aiScore >= 3) {
      issues.highAiFiller.push({ slug: post.slug, score: aiScore });
    }
  });

  console.log(`=== SEO AUDIT RESULTS ===`);
  console.log(`\\n🔴 THIN CONTENT (< 500 words) [${issues.thinContent.length} posts]:`);
  issues.thinContent.slice(0, 10).forEach(p => console.log(`  - ${p.slug} (~${p.words} words)`));
  if (issues.thinContent.length > 10) console.log(`  ...and ${issues.thinContent.length - 10} more.`);

  console.log(`\\n🟠 HIGH AI FILLER (3+ instances) [${issues.highAiFiller.length} posts]:`);
  issues.highAiFiller.sort((a, b) => b.score - a.score).slice(0, 10).forEach(p => console.log(`  - ${p.slug} (${p.score} AI flags)`));
  if (issues.highAiFiller.length > 10) console.log(`  ...and ${issues.highAiFiller.length - 10} more.`);

  console.log(`\\n🟡 MISSING EXCERPTS (No Meta Description) [${issues.missingExcerpt.length} posts]:`);
  issues.missingExcerpt.slice(0, 10).forEach(slug => console.log(`  - ${slug}`));
  if (issues.missingExcerpt.length > 10) console.log(`  ...and ${issues.missingExcerpt.length - 10} more.`);

  console.log(`\\n🟡 MISSING CATEGORIES/TAGS [${issues.missingTaxonomy.length} posts]:`);
  issues.missingTaxonomy.slice(0, 10).forEach(slug => console.log(`  - ${slug}`));
  if (issues.missingTaxonomy.length > 10) console.log(`  ...and ${issues.missingTaxonomy.length - 10} more.`);

}

runFullAudit().catch(console.error);
