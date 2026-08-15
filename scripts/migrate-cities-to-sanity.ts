import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { priorityCityContent } from '../src/data/priorityCityContent';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity credentials in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  token,
  apiVersion: '2025-11-14',
});

// Track uploaded image asset IDs to avoid re-uploading the same file
const imageCache = new Map<string, string>();

async function uploadImage(imagePath: string): Promise<string | null> {
  // Check cache first — many cities share the same hero image
  if (imageCache.has(imagePath)) {
    return imageCache.get(imagePath)!;
  }

  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const imageStream = fs.createReadStream(fullPath);
    const asset = await client.assets.upload('image', imageStream, {
      filename: path.basename(fullPath),
    });
    imageCache.set(imagePath, asset._id);
    return asset._id;
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    return null;
  }
}

function makeKey(): string {
  return Math.random().toString(36).substring(7);
}

function buildCustomContent(cc: any): any {
  const result: any = {};

  if (cc.heroEyebrow) result.heroEyebrow = cc.heroEyebrow;
  if (cc.heroHeading) result.heroHeading = cc.heroHeading;
  if (cc.heroDescription) result.heroDescription = cc.heroDescription;
  if (cc.heroPill) result.heroPill = cc.heroPill;
  if (cc.heroFootnotes) result.heroFootnotes = cc.heroFootnotes;
  if (cc.heroImageAlt) result.heroImageAlt = cc.heroImageAlt;
  if (cc.mapSidebarNote) result.mapSidebarNote = cc.mapSidebarNote;
  if (cc.longDescription) result.longDescription = cc.longDescription;
  if (cc.expertTips) result.expertTips = cc.expertTips;

  if (cc.heroChips) {
    result.heroChips = cc.heroChips.map((chip: any) => ({
      _type: 'heroChip',
      _key: makeKey(),
      ...chip,
    }));
  }

  if (cc.insightIntro) result.insightIntro = cc.insightIntro;

  if (cc.insightCards) {
    result.insightCards = cc.insightCards.map((card: any) => ({
      _type: 'cityInsightCard',
      _key: makeKey(),
      ...card,
    }));
  }

  if (cc.planningCards) {
    result.planningCards = cc.planningCards.map((card: any) => ({
      _type: 'planningCard',
      _key: makeKey(),
      ...card,
    }));
  }

  if (cc.faqs) {
    result.faqs = cc.faqs.map((faq: any) => ({
      _type: 'faqItem',
      _key: makeKey(),
      ...faq,
    }));
  }

  if (cc.neighborhoods) {
    result.neighborhoods = cc.neighborhoods.map((n: any) => ({
      _type: 'neighborhood',
      _key: makeKey(),
      ...n,
    }));
  }

  if (cc.ownerCta) {
    result.ownerCta = {
      _type: 'supportCta',
      ...cc.ownerCta,
      primary: { _type: 'ctaButton', ...cc.ownerCta.primary },
    };
    if (cc.ownerCta.secondary) {
      result.ownerCta.secondary = { _type: 'ctaButton', ...cc.ownerCta.secondary };
    }
  }

  if (cc.faqSupportCard) {
    result.faqSupportCard = {
      _type: 'supportCta',
      ...cc.faqSupportCard,
      primary: { _type: 'ctaButton', ...cc.faqSupportCard.primary },
    };
    if (cc.faqSupportCard.secondary) {
      result.faqSupportCard.secondary = { _type: 'ctaButton', ...cc.faqSupportCard.secondary };
    }
  }

  return result;
}

// Small delay to be gentle on the API
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function migrateCities() {
  const total = priorityCityContent.length;
  console.log(`Starting migration of ${total} cities...`);

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < total; i++) {
    const city = priorityCityContent[i];
    try {
      // Log progress every 50 cities
      if (i > 0 && i % 50 === 0) {
        console.log(`--- Progress: ${i}/${total} (${successCount} ok, ${failCount} fail, ${skipCount} skip) ---`);
      }

      const doc: any = {
        _type: 'cityContent',
        _id: `city-${city.slug}`,
        slug: {
          _type: 'slug',
          current: city.slug,
        },
        city: city.city,
        state: city.state,
      };

      if (city.summary) doc.summary = city.summary;

      // Upload featured image if present
      if (city.featuredImage) {
        const imageAssetId = await uploadImage(city.featuredImage);
        if (imageAssetId) {
          doc.featuredImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAssetId,
            },
          };
        }
      }

      // Build custom content (excluding parks — those come from static data)
      if (city.customContent) {
        doc.customContent = buildCustomContent(city.customContent);
      }

      await client.createOrReplace(doc);
      console.log(`✅ [${i + 1}/${total}] ${city.city}, ${city.state}`);
      successCount++;

      // Gentle rate limiting: 100ms between requests
      await delay(100);
    } catch (error: any) {
      console.error(`❌ [${i + 1}/${total}] Failed ${city.city}, ${city.state}: ${error.message || error}`);
      failCount++;
      // Wait a bit longer on errors before retrying next
      await delay(500);
    }
  }

  console.log('\n--- Migration Summary ---');
  console.log(`Total: ${total}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Skipped: ${skipCount}`);
  console.log(`Images cached: ${imageCache.size}`);
}

migrateCities().catch(console.error);
