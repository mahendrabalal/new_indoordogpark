import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { priorityStateContent } from '../src/data/priorityStateContent';

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

async function uploadImage(imagePath: string): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`Image not found: ${fullPath}`);
      return null;
    }
    const imageStream = fs.createReadStream(fullPath);
    const asset = await client.assets.upload('image', imageStream, {
      filename: path.basename(fullPath),
    });
    return asset._id;
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    return null;
  }
}

async function migrateStates() {
  console.log(`Starting migration of ${priorityStateContent.length} states...`);

  let successCount = 0;
  let failCount = 0;

  for (const state of priorityStateContent) {
    try {
      console.log(`Processing state: ${state.name} (${state.slug})...`);

      let imageAssetId = null;
      if (state.featuredImage) {
        imageAssetId = await uploadImage(state.featuredImage);
      }

      const doc: any = {
        _type: 'stateContent',
        // use slug as the ID to avoid duplicates (prefix with state-)
        _id: `state-${state.slug}`,
        slug: {
          _type: 'slug',
          current: state.slug,
        },
        name: state.name,
        abbr: state.abbr,
      };

      if (imageAssetId) {
        doc.featuredImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          },
        };
      }

      if (state.customContent) {
        const cc = state.customContent;
        doc.customContent = {};

        if (cc.heroEyebrow) doc.customContent.heroEyebrow = cc.heroEyebrow;
        if (cc.heroHeading) doc.customContent.heroHeading = cc.heroHeading;
        if (cc.heroDescription) doc.customContent.heroDescription = cc.heroDescription;
        if (cc.heroPill) doc.customContent.heroPill = cc.heroPill;
        if (cc.heroFootnotes) doc.customContent.heroFootnotes = cc.heroFootnotes;
        if (cc.heroImageAlt) doc.customContent.heroImageAlt = cc.heroImageAlt;
        
        if (cc.heroChips) {
          doc.customContent.heroChips = cc.heroChips.map(chip => ({
            _type: 'heroChip',
            _key: Math.random().toString(36).substring(7),
            ...chip,
          }));
        }

        if (cc.insightIntro) doc.customContent.insightIntro = cc.insightIntro;

        if (cc.insightCards) {
          doc.customContent.insightCards = cc.insightCards.map(card => ({
            _type: 'cityInsightCard',
            _key: Math.random().toString(36).substring(7),
            ...card,
          }));
        }

        if (cc.planningCards) {
          doc.customContent.planningCards = cc.planningCards.map(card => ({
            _type: 'planningCard',
            _key: Math.random().toString(36).substring(7),
            ...card,
          }));
        }

        if (cc.faqs) {
          doc.customContent.faqs = cc.faqs.map(faq => ({
            _type: 'faqItem',
            _key: Math.random().toString(36).substring(7),
            ...faq,
          }));
        }

        if (cc.ownerCta) {
          doc.customContent.ownerCta = {
            _type: 'supportCta',
            ...cc.ownerCta,
            primary: { _type: 'ctaButton', ...cc.ownerCta.primary },
          };
          if (cc.ownerCta.secondary) {
            doc.customContent.ownerCta.secondary = { _type: 'ctaButton', ...cc.ownerCta.secondary };
          }
        }
      }

      await client.createOrReplace(doc);
      console.log(`✅ Migrated: ${state.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to migrate ${state.name}:`, error);
      failCount++;
    }
  }

  console.log('--- Migration Summary ---');
  console.log(`Total: ${priorityStateContent.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

migrateStates().catch(console.error);
