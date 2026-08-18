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
  let htmlBlockLines = [];

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
    if (htmlBlockLines.length > 0) {
      const htmlText = htmlBlockLines.join('\n').trim();
      if (htmlText) {
        blocks.push({
          _key: randomKey(),
          _type: 'block',
          style: 'normal',
          children: [{ _key: randomKey(), _type: 'span', marks: [], text: htmlText }],
          markDefs: [],
        });
      }
      htmlBlockLines = [];
      inHtmlBlock = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line.startsWith('```html')) {
      flushParagraph();
      flushList();
      inHtmlBlock = true;
      continue;
    }

    if (inHtmlBlock) {
      if (line === '```' || line.startsWith('```')) {
        flushHtml();
        continue;
      }
      htmlBlockLines.push(rawLine);
      continue;
    }

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      continue; // H1 is the title
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
      inList = true;
      listType = 'bullet';
      listItems.push(line.substring(2));
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      inList = true;
      listType = 'number';
      listItems.push(line.replace(/^\d+\.\s/, ''));
      continue;
    }

    if (line === '---') {
      flushParagraph();
      flushList();
      continue;
    }

    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();
  flushHtml();

  return blocks;
}

async function main() {
  try {
    const slug = 'top-8-best-indoor-dog-parks-in-santa-ana-ca';
    const filePath = path.join(process.cwd(), 'blog-content', 'top-8-best-indoor-dog-parks-in-santa-ana-ca.md');
    const raw = fs.readFileSync(filePath, 'utf8');
    const bodyContent = raw.replace(/^---[\s\S]*?---\n/, '').trim();

    const title = "Top 8 Best Indoor Dog Parks in Santa Ana, CA (Orange County Guide)";
    const excerpt = "Discover the top 8 indoor dog parks, climate-controlled play arenas, and luxury daycares in Santa Ana and Orange County, CA. Escape inland heat waves, Santa Ana winds, and dangerous foxtails safely.";

    console.log('Parsing markdown into PortableText blocks...');
    const bodyBlocks = markdownToPortableText(bodyContent);
    console.log(`Generated ${bodyBlocks.length} PortableText blocks.`);

    const existing = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });

    let authorId = null;
    const authorDoc = await client.fetch(`*[_type == "author" && name == "Mahendra Balal"][0]`);
    if (authorDoc) {
      authorId = authorDoc._id;
    }

    const postDoc = {
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      excerpt,
      body: bodyBlocks,
      author: authorId ? { _type: 'reference', _ref: authorId } : undefined,
      publishedAt: new Date().toISOString(),
      factCheckedBy: 'Dr. Emily Chen, DVM',
    };

    if (existing) {
      console.log('Updating existing post:', existing._id);
      await client.patch(existing._id).set(postDoc).commit();
      console.log('✅ Post body successfully updated in Sanity!');
    } else {
      console.log('Creating new post in Sanity...');
      const created = await client.create(postDoc);
      console.log('✅ Post created with ID:', created._id);
    }
  } catch (err) {
    console.error('Error publishing to Sanity:', err);
  }
}

main();
