/**
 * Script to import Phoenix Indoor Dog Parks blog post into Sanity CMS
 * 
 * Usage:
 *   npx ts-node scripts/import-phoenix-blog-post.ts
 * 
 * Requirements:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   - NEXT_PUBLIC_SANITY_DATASET in .env.local (defaults to 'production')
 *   - SANITY_API_TOKEN in .env.local (with write permissions)
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required in .env.local');
}

if (!token) {
  throw new Error('SANITY_API_TOKEN is required in .env.local (with write permissions)');
}

// Create Sanity client with write permissions
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-11-14',
  useCdn: false, // Use direct API for writes
  token,
});

// Simple markdown to Portable Text converter
function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.split('\n');
  let currentParagraph: string[] = [];
  let inList = false;
  let listType: 'bullet' | 'number' | null = null;
  let listItems: string[] = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text }],
          markDefs: [],
        });
      }
      currentParagraph = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      listItems.forEach((item) => {
        blocks.push({
          _type: 'block',
          style: 'normal',
          listItem: listType || 'bullet',
          children: [{ _type: 'span', text: item.trim() }],
          markDefs: [],
        });
      });
      listItems = [];
      inList = false;
      listType = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: line.substring(2).trim() }],
        markDefs: [],
      });
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: line.substring(3).trim() }],
        markDefs: [],
      });
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: line.substring(4).trim() }],
        markDefs: [],
      });
      continue;
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
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

    // Tables - convert to HTML block (if HTML blocks are supported)
    if (line.startsWith('|')) {
      flushParagraph();
      flushList();
      // For now, skip tables or convert to text
      continue;
    }

    // Regular paragraph
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

// Extract links from markdown and add to markDefs
function processLinks(text: string, markDefs: any[]): any[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const children: any[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let markDefIndex = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before link
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText) {
        children.push({ _type: 'span', text: beforeText });
      }
    }

    // Add link
    const linkKey = `link-${markDefIndex++}`;
    markDefs.push({
      _key: linkKey,
      _type: 'link',
      href: match[2],
    });
    children.push({
      _type: 'span',
      text: match[1],
      marks: [linkKey],
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      children.push({ _type: 'span', text: remainingText });
    }
  }

  return children.length > 0 ? children : [{ _type: 'span', text }];
}

// Enhanced converter with link processing
function markdownToPortableTextWithLinks(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Headings
    if (line.startsWith('# ')) {
      const text = line.substring(2).trim();
      const markDefs: any[] = [];
      const children = processLinks(text, markDefs);
      blocks.push({
        _type: 'block',
        style: 'h1',
        children,
        markDefs,
      });
      continue;
    }
    if (line.startsWith('## ')) {
      const text = line.substring(3).trim();
      const markDefs: any[] = [];
      const children = processLinks(text, markDefs);
      blocks.push({
        _type: 'block',
        style: 'h2',
        children,
        markDefs,
      });
      continue;
    }
    if (line.startsWith('### ')) {
      const text = line.substring(4).trim();
      const markDefs: any[] = [];
      const children = processLinks(text, markDefs);
      blocks.push({
        _type: 'block',
        style: 'h3',
        children,
        markDefs,
      });
      continue;
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.substring(2).trim();
      const markDefs: any[] = [];
      const children = processLinks(text, markDefs);
      blocks.push({
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children,
        markDefs,
      });
      continue;
    }

    // Regular paragraph
    const markDefs: any[] = [];
    const children = processLinks(line, markDefs);
    blocks.push({
      _type: 'block',
      style: 'normal',
      children,
      markDefs,
    });
  }

  return blocks;
}

// Find or create category
async function findOrCreateCategory(title: string, description?: string) {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Try to find existing category
  const existing = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug }
  );

  if (existing) {
    console.log(`✓ Category "${title}" already exists`);
    return existing._id;
  }

  // Create new category
  const category = await client.create({
    _type: 'category',
    title,
    slug: { current: slug },
    description: description || '',
  });

  console.log(`✓ Created category "${title}"`);
  return category._id;
}

// Find or create tag
async function findOrCreateTag(title: string) {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  try {
    // Try to find existing tag
    const existing = await client.fetch(
      `*[_type == "tag" && slug.current == $slug][0]`,
      { slug }
    );

    if (existing) {
      console.log(`✓ Tag "${title}" already exists`);
      return existing._id;
    }

    // Create new tag
    const tag = await client.create({
      _type: 'tag',
      title,
      slug: { current: slug },
    });

    console.log(`✓ Created tag "${title}"`);
    return tag._id;
  } catch (error: any) {
    console.warn(`⚠️  Could not create tag "${title}": ${error.message}`);
    console.warn('   Make sure tagType is added to your Sanity schema');
    return null;
  }
}

// Find or create author
async function findOrCreateAuthor(name: string = 'Indoor Dog Park Team') {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Try to find existing author
  const existing = await client.fetch(
    `*[_type == "author" && slug.current == $slug][0]`,
    { slug }
  );

  if (existing) {
    console.log(`✓ Author "${name}" already exists`);
    return { _type: 'reference', _ref: existing._id };
  }

  // Create new author
  const author = await client.create({
    _type: 'author',
    name,
    slug: { current: slug },
  });

  console.log(`✓ Created author "${name}"`);
  return { _type: 'reference', _ref: author._id };
}

async function main() {
  console.log('🚀 Starting blog post import...\n');

  try {
    // Read markdown file
    const markdownPath = path.join(__dirname, '../blog-content/phoenix-indoor-dog-parks-guide.md');
    const markdown = fs.readFileSync(markdownPath, 'utf-8');

    // Extract title and excerpt
    const titleMatch = markdown.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Best Indoor Dog Parks in Phoenix: Your Complete Guide';
    
    // Extract excerpt (first paragraph after title)
    const excerptMatch = markdown.match(/\n\n([^\n]+)/);
    const excerpt = excerptMatch 
      ? excerptMatch[1].substring(0, 200) + '...'
      : 'Discover the top indoor dog parks in Phoenix, Arizona. Our comprehensive guide covers climate-controlled facilities, safety features, amenities, and everything you need to know to keep your dog safe and active year-round in the Valley of the Sun.';

    console.log(`📝 Title: ${title}`);
    console.log(`📄 Excerpt: ${excerpt.substring(0, 100)}...\n`);

    // Convert markdown to Portable Text
    console.log('🔄 Converting markdown to Portable Text...');
    const body = markdownToPortableText(markdown);
    console.log(`✓ Converted ${body.length} blocks\n`);

    // Create or find categories
    console.log('📁 Creating/finding categories...');
    const categoryIds = await Promise.all([
      findOrCreateCategory('Indoor Dog Parks', 'Articles about indoor dog park facilities'),
      findOrCreateCategory('Location Guides', 'Location-specific guides for dog parks'),
    ]);
    console.log('');

    // Create or find tags
    console.log('🏷️  Creating/finding tags...');
    const tagResults = await Promise.all([
      findOrCreateTag('phoenix'),
      findOrCreateTag('arizona'),
      findOrCreateTag('indoor-dog-parks'),
      findOrCreateTag('dog-safety'),
    ]);
    const tagIds = tagResults.filter(id => id !== null) as string[];
    console.log('');

    // Create or find author
    console.log('👤 Creating/finding author...');
    const author = await findOrCreateAuthor('Indoor Dog Park Team');
    console.log('');

    // Check if post already exists
    const slug = 'best-indoor-dog-parks-phoenix-complete-guide';
    const existingPost = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]`,
      { slug }
    );

    if (existingPost) {
      console.log(`⚠️  Post with slug "${slug}" already exists.`);
      console.log('   Updating existing post...\n');
      
      const updateData: any = {
        title,
        body,
        excerpt,
        categories: categoryIds.map(id => ({ _type: 'reference', _ref: id })),
        author,
        _updatedAt: new Date().toISOString(),
      };
      
      if (tagIds.length > 0) {
        updateData.tags = tagIds.map(id => ({ _type: 'reference', _ref: id }));
      }
      
      await client
        .patch(existingPost._id)
        .set(updateData)
        .commit();

      console.log(`✅ Post updated successfully!`);
      console.log(`   View at: https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=*[_id=="${existingPost._id}"]`);
    } else {
      // Create new post
      console.log('📝 Creating new blog post...');
      const postData: any = {
        _type: 'post',
        title,
        slug: { current: slug },
        excerpt,
        body,
        categories: categoryIds.map(id => ({ _type: 'reference', _ref: id })),
        author,
        publishedAt: new Date().toISOString(),
      };
      
      if (tagIds.length > 0) {
        postData.tags = tagIds.map(id => ({ _type: 'reference', _ref: id }));
      }
      
      const post = await client.create(postData);

      console.log(`✅ Post created successfully!`);
      console.log(`   ID: ${post._id}`);
      console.log(`   Slug: ${slug}`);
      console.log(`\n📌 Next steps:`);
      console.log(`   1. Add a featured image in Sanity Studio`);
      console.log(`   2. Review and edit the content if needed`);
      console.log(`   3. Publish the post`);
      console.log(`\n   View in Studio: http://localhost:3000/studio`);
    }

    console.log('\n✨ Import complete!');
  } catch (error: any) {
    console.error('❌ Error importing blog post:', error);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

main();






