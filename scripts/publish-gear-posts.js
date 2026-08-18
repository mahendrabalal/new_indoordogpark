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

function markdownToPortableText(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  let currentParagraph = [];
  let inList = false;
  let listType = null;
  let listItems = [];

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

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      continue; // Skip H1 since it's the post title
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      const text = line.substring(3).trim();
      const { children, markDefs } = parseFormattedText(text);
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'h2',
        children,
        markDefs,
      });
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      const text = line.substring(4).trim();
      const { children, markDefs } = parseFormattedText(text);
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'h3',
        children,
        markDefs,
      });
      continue;
    }

    if (line.startsWith('* ') || line.startsWith('- ')) {
      flushParagraph();
      if (!inList || listType !== 'bullet') {
        flushList();
        inList = true;
        listType = 'bullet';
      }
      listItems.push(line.substring(2).trim());
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      if (!inList || listType !== 'number') {
        flushList();
        inList = true;
        listType = 'number';
      }
      listItems.push(line.replace(/^\d+\.\s/, '').trim());
      continue;
    }

    if (line.startsWith('|')) {
      flushParagraph();
      flushList();
      continue; // Skip Markdown tables as block content handles prose
    }

    if (line.startsWith('---')) {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function parseFormattedText(text) {
  const children = [];
  const markDefs = [];

  // Match links, bold, and italic
  // Regex to split by markdown tokens
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
      // Link
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
      // Bold
      children.push({
        _key: randomKey(),
        _type: 'span',
        marks: ['strong'],
        text: match[4],
      });
    } else if (match[1].startsWith('*') && match[5]) {
      // Italic
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

async function publishArticle({ filename, slug, title, excerpt }) {
  console.log(`\n🚀 Publishing: "${title}" (${slug})...`);
  const filePath = path.join(__dirname, '..', 'blog-content', filename);
  const markdown = fs.readFileSync(filePath, 'utf-8');

  const body = markdownToPortableText(markdown);
  const authorId = 'f575f160-7c30-4bf4-a279-8041847fce6f'; // Indoor Dog Park Directory Team
  const categoryId = '0e874b4a-c779-4ceb-8069-4d05d6b669e3'; // Dog Care

  const doc = {
    _type: 'post',
    title,
    slug: {
      _type: 'slug',
      current: slug,
    },
    publishedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    excerpt,
    body,
    author: {
      _type: 'reference',
      _ref: authorId,
    },
    categories: [
      {
        _key: randomKey(),
        _type: 'reference',
        _ref: categoryId,
      },
    ],
  };

  // Check if post already exists
  const existing = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });

  if (existing) {
    console.log(`Updating existing post: ${existing._id}`);
    const res = await client.patch(existing._id).set(doc).commit();
    console.log(`✅ Updated successfully! Doc ID: ${res._id}`);
    return res;
  } else {
    console.log(`Creating new post...`);
    const res = await client.create(doc);
    console.log(`✅ Created and published successfully! Doc ID: ${res._id}`);
    return res;
  }
}

async function main() {
  await publishArticle({
    filename: 'ruffwear-front-range-vs-web-master-dog-harness-review.md',
    slug: 'ruffwear-front-range-vs-web-master-dog-harness-review',
    title: 'Ruffwear Front Range vs. Web Master: Which Harness is Best for Active Dogs in 2026?',
    excerpt: 'Comprehensive comparison of the Ruffwear Front Range and Web Master dog harnesses. We test pulling control, ergonomics, escape-proofing, and performance at indoor dog parks.',
  });

  await publishArticle({
    filename: 'best-portable-dog-water-bottles-for-indoor-dog-parks.md',
    slug: 'best-portable-dog-water-bottles-for-indoor-dog-parks',
    title: 'Top 5 Best Portable Dog Water Bottles for Indoor Dog Parks & Travel (2026 Tested)',
    excerpt: 'Avoid communal dog park bowl bacteria and keep your dog hydrated. We test the top 5 leak-proof portable dog water bottles for capacity, ease of use, and one-handed dispensing.',
  });

  console.log('\n🎉 All articles published to Sanity CMS successfully!');
}

main().catch((err) => {
  console.error('Error publishing articles:', err);
  process.exit(1);
});
