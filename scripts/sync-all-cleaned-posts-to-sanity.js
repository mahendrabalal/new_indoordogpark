const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-14',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});

function randomKey() {
  return crypto.randomBytes(6).toString('hex');
}

function parseFormattedText(text) {
  const children = [];
  const markDefs = [];

  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.substring(lastIndex, match.index);
      if (plain) {
        children.push({
          _key: randomKey(),
          _type: 'span',
          marks: [],
          text: plain,
        });
      }
    }

    if (match[1].startsWith('[') && match[2] && match[3]) {
      const linkKey = randomKey();
      markDefs.push({
        _key: linkKey,
        _type: 'link',
        href: match[3],
      });
      children.push({
        _key: randomKey(),
        _type: 'span',
        marks: [linkKey],
        text: match[2],
      });
    } else if (match[1].startsWith('**') && match[4]) {
      children.push({
        _key: randomKey(),
        _type: 'span',
        marks: ['strong'],
        text: match[4],
      });
    } else if (match[1].startsWith('*') && match[5]) {
      children.push({
        _key: randomKey(),
        _type: 'span',
        marks: ['em'],
        text: match[5],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const trailing = text.substring(lastIndex);
    if (trailing) {
      children.push({
        _key: randomKey(),
        _type: 'span',
        marks: [],
        text: trailing,
      });
    }
  }

  if (children.length === 0) {
    children.push({
      _key: randomKey(),
      _type: 'span',
      marks: [],
      text: text,
    });
  }

  return { children, markDefs };
}

function markdownToPortableText(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  let currentParagraph = [];
  let inList = false;
  let listType = null;
  let listItems = [];
  let inHtmlBlock = false;
  let htmlLines = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text && !text.startsWith('---')) {
        const { children, markDefs } = parseFormattedText(text);
        blocks.push({
          _key: randomKey(),
          _type: 'block',
          style: 'normal',
          children,
          markDefs,
        });
      }
      currentParagraph = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      listItems.forEach((item) => {
        const { children, markDefs } = parseFormattedText(item.trim());
        blocks.push({
          _key: randomKey(),
          _type: 'block',
          style: 'normal',
          listItem: listType || 'bullet',
          children,
          markDefs,
        });
      });
      listItems = [];
      inList = false;
      listType = null;
    }
  }

  function flushHtml() {
    if (htmlLines.length > 0) {
      const htmlContent = htmlLines.join('\n');
      blocks.push({
        _key: randomKey(),
        _type: 'htmlBlock',
        html: htmlContent,
      });
      htmlLines = [];
      inHtmlBlock = false;
    }
  }

  let skipFrontmatter = false;
  let frontmatterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '---') {
      frontmatterCount++;
      if (frontmatterCount <= 2) {
        skipFrontmatter = frontmatterCount === 1;
        continue;
      }
    }

    if (skipFrontmatter && frontmatterCount < 2) {
      continue;
    }

    if (line.trim().startsWith('```html')) {
      flushParagraph();
      flushList();
      inHtmlBlock = true;
      continue;
    }

    if (inHtmlBlock) {
      if (line.trim() === '```') {
        flushHtml();
      } else {
        htmlLines.push(line);
      }
      continue;
    }

    if (line.trim().startsWith('<div') || line.trim().startsWith('<table')) {
      flushParagraph();
      flushList();
      inHtmlBlock = true;
      htmlLines.push(line);
      if (line.includes('</div>') || line.includes('</table>')) {
        flushHtml();
      }
      continue;
    }

    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    const h4Match = line.match(/^####\s+(.+)$/);

    if (h1Match || h2Match || h3Match || h4Match) {
      flushParagraph();
      flushList();

      const headingText = (h1Match || h2Match || h3Match || h4Match)[1].trim();
      const style = h1Match ? 'h1' : h2Match ? 'h2' : h3Match ? 'h3' : 'h4';

      const { children, markDefs } = parseFormattedText(headingText);
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style,
        children,
        markDefs,
      });
      continue;
    }

    const bulletMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
    const numberMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);

    if (bulletMatch || numberMatch) {
      flushParagraph();
      inList = true;
      listType = bulletMatch ? 'bullet' : 'number';
      listItems.push((bulletMatch || numberMatch)[2]);
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.trim() === '---') {
      flushParagraph();
      flushList();
      continue;
    }

    if (inList) {
      flushList();
    }
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();
  flushHtml();

  return blocks;
}

const POSTS_TO_SYNC = [
  {
    filename: 'top-8-best-indoor-dog-parks-in-irvine-ca.md',
    slug: 'top-8-best-indoor-dog-parks-in-irvine-ca',
    title: 'Top 8 Best Indoor Dog Parks in Irvine, CA (Orange County Guide)',
    excerpt: 'Discover the top 8 indoor dog parks, daycares, and climate-controlled play arenas in Irvine and Central Orange County, CA. Beat the SoCal heat, Santa Ana winds, and foxtails safely.',
  },
  {
    filename: 'top-8-best-indoor-dog-parks-in-santa-ana-ca.md',
    slug: 'top-8-best-indoor-dog-parks-in-santa-ana-ca',
    title: 'Top 8 Best Indoor Dog Parks in Santa Ana, CA (Orange County Guide)',
    excerpt: 'Discover the top 8 indoor dog parks, climate-controlled play arenas, and daycares in Santa Ana and Orange County, CA. Escape summer heat waves and foxtails safely.',
  },
  {
    filename: 'top-8-best-indoor-dog-parks-in-corpus-christi-tx.md',
    slug: 'top-8-best-indoor-dog-parks-in-corpus-christi-tx',
    title: 'Top 8 Best Indoor Dog Parks in Corpus Christi, TX (Coastal Bend Guide)',
    excerpt: 'Discover the top 8 indoor dog parks, daycares, and climate-controlled play arenas in Corpus Christi, TX to escape Gulf heat and grassburs.',
  },
  {
    filename: 'top-10-best-indoor-dog-parks-in-anaheim.md',
    slug: 'top-10-best-indoor-dog-parks-in-anaheim',
    title: 'Top 10 Best Indoor Dog Parks in Anaheim, CA (Orange County)',
    excerpt: 'Discover the top 10 indoor dog parks, daycares, and climate-controlled play resorts in Anaheim and North Orange County, California.',
  },
  {
    filename: 'top-10-best-indoor-dog-parks-in-orlando.md',
    slug: 'top-10-best-indoor-dog-parks-in-orlando',
    title: 'Top 10 Best Indoor Dog Parks in Orlando, FL (Central Florida)',
    excerpt: 'Discover the top 10 indoor dog parks, daycares, and climate-controlled play resorts in Orlando, Florida. Keep your dog cool and safe from summer heatwaves and afternoon storms.',
  },
  {
    filename: 'top-5-indoor-dog-parks-honolulu.md',
    slug: 'top-5-indoor-dog-parks-honolulu',
    title: 'Top 5 Best Indoor Dog Parks in Honolulu, HI (Oahu)',
    excerpt: 'Discover the top 5 indoor dog parks and climate-controlled dog daycares in Honolulu, Hawaii. Keep your pup cool and active in Oahu\'s tropical climate.',
  },
  {
    filename: 'top-5-indoor-dog-parks-islip.md',
    slug: 'top-5-indoor-dog-parks-islip',
    title: 'Top 5 Best Indoor Dog Parks in Islip, NY',
    excerpt: 'Discover the top 5 indoor dog parks and daycares near Islip, New York. Find climate-controlled play spaces to keep your pup active year-round.',
  },
  {
    filename: 'brooktrout-dog-collar-review.md',
    slug: 'brooktrout-dog-collar-review',
    title: 'Brooktrout Dog Collar: Material Guide, Durability & Field Review',
    excerpt: 'A practical guide to the brooktrout pattern dog collar: waterproof materials, hardware durability, and performance for active dogs and water play.',
  },
  {
    filename: 'lucky-dog-austin-adjustable-leash-review.md',
    slug: 'lucky-dog-austin-adjustable-leash-review',
    title: 'Lucky + Dog Austin Adjustable Leash: Hands-On Field Review',
    excerpt: 'A practical review of the Lucky + Dog Austin adjustable leash: hands-free configurations, waterproof webbing, and everyday urban durability.',
  },
];

async function syncPost(post) {
  const filePath = path.join(__dirname, '..', 'blog-content', post.filename);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skipping ${post.filename} (file not found)`);
    return;
  }

  const markdown = fs.readFileSync(filePath, 'utf8');
  const body = markdownToPortableText(markdown);

  const authorId = 'f575f160-7c30-4bf4-a279-8041847fce6f';
  const categoryId = '0e874b4a-c779-4ceb-8069-4d05d6b669e3';

  const doc = {
    _type: 'post',
    title: post.title,
    slug: { _type: 'slug', current: post.slug },
    lastUpdated: new Date().toISOString(),
    excerpt: post.excerpt,
    body,
    author: { _type: 'reference', _ref: authorId },
    categories: [{ _key: randomKey(), _type: 'reference', _ref: categoryId }],
  };

  try {
    const existing = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: post.slug });
    if (existing) {
      console.log(`Updating Sanity post: "${post.title}" (ID: ${existing._id})...`);
      await client.patch(existing._id).set(doc).commit();
      console.log(`✅ Updated: ${post.slug}`);
    } else {
      console.log(`Post not found in Sanity by slug ${post.slug}. Skipping create to avoid unwanted entries.`);
    }
  } catch (err) {
    console.error(`❌ Error updating ${post.slug}:`, err.message);
  }
}

async function run() {
  console.log('🔄 Starting Sanity Content Sync for Cleaned Blog Posts...\n');
  for (const post of POSTS_TO_SYNC) {
    await syncPost(post);
  }
  console.log('\n✨ Sanity sync complete!');
}

run();
