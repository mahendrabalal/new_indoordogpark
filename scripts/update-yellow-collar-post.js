const { createClient } = require('@sanity/client');
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

const updatedArticleMarkdown = `
When you see a dog wearing a bright yellow collar, leash, or bandana during a walk, it's not just a fashion statement. In the canine community, yellow is an internationally recognized signal that a dog **needs space**.

Whether you are considering an everyday yellow nylon dog collar for its incredible durability and high visibility, or looking to understand what a yellow collar signals to other pet owners, this comprehensive guide covers the meaning, behavioral psychology, material benefits, and safety advantages of yellow dog gear.

## What Does a Yellow Dog Collar Mean? (The Universal Canine Signal)

The use of yellow collars, leashes, ribbons, and bandanas is part of a worldwide movement called **The Yellow Dog Project** (often associated with **DINOS: Dogs In Need of Space**).

When a dog wears yellow, it signals to approaching humans and dog owners: *"Please give me space. Do not approach or let your dog greet me without asking."*

This visual cue helps prevent stressful interactions, protects dogs in vulnerable situations, and allows owners to advocate for their dog's safety in public environments like parks, busy sidewalks, and dog-friendly retail spots.

## 4 Common Reasons a Dog Wears a Yellow Collar

A yellow collar does **not** mean a dog is vicious or bad. Instead, yellow gear is used for a wide range of practical and behavioral reasons:

- **1. Nervousness, Fear, or Trauma Recovery:** Many rescue dogs or dogs with past trauma experience high anxiety when approached quickly by unfamiliar humans or eager dogs.
- **2. Medical Conditions or Post-Surgery Recovery:** Dogs recovering from orthopedic surgery, spay/neuter operations, or dealing with arthritis need space to prevent sudden jostling or painful contact.
- **3. Active Training or Service Dog Work:** Puppies in socialization training, reactive dogs learning desensitization, or working service dogs need zero distractions so they can focus on their handlers.
- **4. Age and Sensory Impairments:** Senior dogs with fading eyesight, hearing loss, or mobility challenges startle easily and need extra breathing room.

## What Should You Do If You See a Dog Wearing Yellow?

If you encounter a dog wearing a yellow collar or a yellow ribbon tied to its leash:

1. **Maintain Distance:** Give the dog and owner a wide berth (at least 6 to 10 feet of space).
2. **Keep Your Dog Close:** Shorten your leash and do not allow your dog to rush over or initiate greetings.
3. **Never Reach Out Without Asking:** Avoid making direct, prolonged eye contact or reaching out your hand toward the dog.
4. **Follow the Handler's Lead:** If you must pass on a narrow sidewalk, step off to the side and give the handler time to position their dog comfortably.

## Can Friendly Dogs Still Wear Yellow Collars?

Yes, absolutely! Many pet owners choose yellow nylon collars simply because bright yellow is vibrant, looks fantastic on dark or golden fur, and offers superior visibility in low light.

If your dog is fully social and loves greeting everyone, you can still use a yellow collar. To prevent educated dog owners from steering clear unnecessarily, consider:

- Adding an **"I'm Friendly!"** embroidered patch or collar tag.
- Pairing the collar with colorful leashes or bandanas in green or blue.
- Being proactive during outdoor greetings to let fellow owners know your pup is eager to play.

## Why High-Density Nylon is the Best Everyday Collar Material

Beyond color meaning, the construction of an everyday collar is essential for comfort and safety. High-grade nylon webbing is the gold standard for daily dog gear:

### 1. Exceptional Tensile Strength
A quality 1-inch nylon webbing collar provides tensile breaking strength upwards of 3,000 pounds, ensuring it won't snap during sudden lunges or active agility play.

### 2. Lightweight Comfort (No Chafing)
Unlike heavy leather or bulky metal tactical collars, lightweight nylon conforms smoothly to your dog's neck without matting fur or irritating sensitive skin.

### 3. High Canine Color Spectrum Contrast
Canine vision is dichromatic, meaning dogs possess two types of color cones that see shades of **yellow and blue** with maximum clarity. A bright yellow collar stands out clearly to other dogs and provides crucial human visibility at dawn and dusk.

### 4. 100% Machine Washable & Weatherproof
Mud, lake water, and sweat won't degrade nylon webbing. A quick cycle in a wash bag or a rinse with warm soapy water restores it to brand-new condition.

## Material Comparison: Nylon vs. Leather vs. Biothane

- **Nylon Webbing:** Lightweight, highly affordable, machine washable, maximum color vibrancy, ideal for daily walks and indoor play.
- **Genuine Leather:** Classic aesthetic and durable, but requires conditioning, absorbs water and odors, and lacks bright high-visibility colorways.
- **Biothane (Waterproof Coated):** 100% waterproof and odor-proof, easy wipe-down, but heavier and stiffer than soft nylon webbing.

## Using Space Cues at Dog Parks and Social Venues

Advocating for your dog's personal space is especially important in high-stimulation environments. When visiting [indoor dog parks](/blog) or off-leash zones, monitor body language carefully. If your dog is having an off day or feeling overwhelmed, stepping away to a low-traffic area or quiet zone keeps everyone safe and happy.

Before heading out, be sure to check our essential dog gear guides and packing lists to ensure your walking setup is prepared for any situation.

## Frequently Asked Questions About Yellow Dog Collars

### What does a yellow collar mean on a dog?
A yellow collar or yellow ribbon indicates that a dog needs space ("DINOS"). It signals to other owners and strangers to keep a respectful distance because the dog may be in training, reactive, recovering from illness or surgery, or anxious.

### Does a yellow collar mean a dog is aggressive or dangerous?
No. A yellow collar does not mean a dog is aggressive. It simply means the dog requires personal space. Many dogs wearing yellow are gentle rescues, service dogs in training, elderly pups with arthritis, or dogs recovering from veterinary procedures.

### What does a yellow ribbon on a dog's leash mean?
A yellow ribbon tied to a dog's leash or harness is the official symbol of The Yellow Dog Project, indicating that the dog requires extra space and should not be approached without the owner's explicit permission.

### What do different dog collar colors mean?
In the dog awareness color-coding system:
- **Yellow:** Needs space / In training / Nervous
- **Red:** Caution / Do not approach
- **Orange:** No dogs (not friendly with other dogs)
- **Green:** Friendly / Safe to approach with permission
- **Blue:** Service dog / Working dog / In training
- **White:** Deaf or blind dog

### Why is nylon the most popular material for everyday dog collars?
High-density nylon webbing offers tensile strength exceeding 3,000 lbs, is lightweight to prevent chafing, resists mildew, and is 100% machine washable for easy cleanup.

### How do dogs perceive the color yellow?
Dogs have dichromatic vision with two types of photoreceptor cones (sensitive to blue and yellow wavelengths). Bright yellow stands out with high visual contrast against grass, sidewalks, and indoor floors.

## Final Thoughts

The everyday yellow nylon dog collar is a versatile, high-visibility piece of gear that combines heavy-duty durability with important canine communication. Whether you are using yellow to signal your dog's need for space or simply enjoying its bright visibility and strength, it remains an essential tool for responsible pet parents.
`;

async function run() {
  const slug = 'the-ultimate-guide-to-the-everyday-yellow-nylon-dog-collar-durability-safety-and-hidden-meanings';
  const post = await client.fetch('*[_type == "post" && slug.current == $slug][0]', { slug });

  if (!post) {
    console.error('Post not found for slug:', slug);
    process.exit(1);
  }

  console.log(`Found post: ${post.title} (${post._id})`);

  const newTitle = 'What Does a Yellow Dog Collar Mean? Safety & Durability Guide';
  const newExcerpt = 'Discover what a yellow dog collar or ribbon means (The Yellow Dog Project & DINOS), why dogs wear yellow, and why everyday yellow nylon collars offer top safety and durability.';
  const newBody = markdownToPortableText(updatedArticleMarkdown);

  console.log(`Updating post with ${newBody.length} blocks...`);

  const res = await client
    .patch(post._id)
    .set({
      title: newTitle,
      excerpt: newExcerpt,
      body: newBody,
      lastUpdated: new Date().toISOString(),
    })
    .commit();

  console.log('✅ Post updated successfully in Sanity!', res._id);
}

run().catch((err) => {
  console.error('Error updating post:', err);
  process.exit(1);
});
