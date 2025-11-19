#!/usr/bin/env tsx
/**
 * Bulk Submit All Parks to IndexNow
 * 
 * This script submits all existing parks (from JSON files and database) to IndexNow.
 * This is useful for initial submission or after a bulk import.
 * 
 * Usage:
 *   npx tsx scripts/bulk-submit-parks-to-indexnow.ts
 * 
 * Options:
 *   --dry-run    Only show URLs that would be submitted (don't actually submit)
 *   --limit N    Only submit first N parks (useful for testing)
 *   --env-file   Path to .env.local file (default: .env.local)
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
const envFile = process.argv.find((arg) => arg.startsWith('--env-file='))?.split('=')[1] || '.env.local';
config({ path: resolve(process.cwd(), envFile) });

import { DogPark } from '@/types/dog-park';
import { SITE_URL } from '@/lib/metadata';
import { submitUrlsToIndexNow } from '@/lib/indexnow';

interface ScriptOptions {
  dryRun: boolean;
  limit?: number;
}

async function loadAllParks(): Promise<DogPark[]> {
  const allParks: DogPark[] = [];

  // Load California parks
  try {
    const californiaPath = join(process.cwd(), 'public/data/california.json');
    const californiaContent = await readFile(californiaPath, 'utf-8');
    const californiaParks: DogPark[] = JSON.parse(californiaContent);
    allParks.push(...californiaParks);
    console.log(`✓ Loaded ${californiaParks.length} parks from california.json`);
  } catch (error) {
    console.error('⚠️  Failed to read California parks data:', error);
  }

  // Load Washington parks
  try {
    const washingtonPath = join(process.cwd(), 'public/data/washington.json');
    const washingtonContent = await readFile(washingtonPath, 'utf-8');
    const washingtonParks: DogPark[] = JSON.parse(washingtonContent);
    allParks.push(...washingtonParks);
    console.log(`✓ Loaded ${washingtonParks.length} parks from washington.json`);
  } catch (error) {
    console.error('⚠️  Failed to read Washington parks data:', error);
  }

  // Load Mixmatch parks (multi-state parks)
  try {
    const mixmatchPath = join(process.cwd(), 'public/data/mixmatch.json');
    const mixmatchContent = await readFile(mixmatchPath, 'utf-8');
    const mixmatchParks: DogPark[] = JSON.parse(mixmatchContent);
    allParks.push(...mixmatchParks);
    console.log(`✓ Loaded ${mixmatchParks.length} parks from mixmatch.json`);
  } catch (error) {
    console.error('⚠️  Failed to read Mixmatch parks data:', error);
  }

  // Load approved parks from database (optional - only if Supabase env vars are set)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { supabaseAdminClient } = await import('@/lib/supabase-admin');
      const { data: dbParks, error } = await supabaseAdminClient
        .from('park_submissions')
        .select('id, slug, name, city, state')
        .eq('status', 'approved');

      if (error) {
        console.error('⚠️  Failed to load database parks:', error);
      } else if (dbParks && dbParks.length > 0) {
        // Convert database parks to DogPark format
        const parksFromDb: DogPark[] = dbParks.map((p) => ({
          id: p.id,
          slug: p.slug || p.id,
          name: p.name,
          city: p.city,
          state: p.state,
        } as DogPark));
        allParks.push(...parksFromDb);
        console.log(`✓ Loaded ${parksFromDb.length} approved parks from database`);
      }
    } catch (error) {
      console.warn('⚠️  Could not load database parks (Supabase not configured or unavailable):', (error as Error).message);
      console.log('   Continuing with JSON parks only...\n');
    }
  } else {
    console.log('⚠️  Supabase not configured, skipping database parks\n');
  }

  return allParks;
}

function generateParkUrls(parks: DogPark[]): string[] {
  const urls: string[] = [];

  for (const park of parks) {
    const slug = park.slug || park.id;
    if (!slug) {
      console.warn(`⚠️  Skipping park without slug or id: ${park.name || 'Unknown'}`);
      continue;
    }

    const url = `${SITE_URL}/parks/${slug}`;
    urls.push(url);
  }

  return urls;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options: ScriptOptions = {
    dryRun: args.includes('--dry-run'),
    limit: args.find((arg) => arg.startsWith('--limit='))?.split('=')[1] 
      ? parseInt(args.find((arg) => arg.startsWith('--limit='))!.split('=')[1], 10)
      : undefined,
  };

  console.log('\n' + '='.repeat(80));
  console.log('BULK SUBMIT PARKS TO INDEXNOW');
  console.log('='.repeat(80));
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN (no submissions)' : 'LIVE SUBMISSION'}`);
  if (options.limit) {
    console.log(`Limit: First ${options.limit} parks only`);
  }
  console.log('='.repeat(80) + '\n');

  // Load all parks
  console.log('📥 Loading parks from all sources...\n');
  const allParks = await loadAllParks();

  if (allParks.length === 0) {
    console.error('❌ No parks found! Exiting.');
    process.exit(1);
  }

  // Remove duplicates (by slug or id)
  const uniqueParks = Array.from(
    new Map(allParks.map((park) => [park.slug || park.id, park])).values()
  );

  console.log(`\n📊 Statistics:`);
  console.log(`   Total parks loaded: ${allParks.length}`);
  console.log(`   Unique parks: ${uniqueParks.length}`);
  console.log(`   Duplicates removed: ${allParks.length - uniqueParks.length}\n`);

  // Apply limit if specified
  const parksToSubmit = options.limit 
    ? uniqueParks.slice(0, options.limit)
    : uniqueParks;

  // Generate URLs
  console.log('🔗 Generating park URLs...\n');
  const urls = generateParkUrls(parksToSubmit);

  console.log(`📋 URLs to submit: ${urls.length}\n`);

  // Show sample URLs
  console.log('📝 Sample URLs (first 5):');
  urls.slice(0, 5).forEach((url, idx) => {
    console.log(`   ${idx + 1}. ${url}`);
  });
  if (urls.length > 5) {
    console.log(`   ... and ${urls.length - 5} more\n`);
  } else {
    console.log();
  }

  if (options.dryRun) {
    console.log('✅ DRY RUN: Would submit', urls.length, 'URLs to IndexNow');
    console.log('   Run without --dry-run to actually submit.');
    return;
  }

  // Submit to IndexNow
  console.log('🚀 Submitting URLs to IndexNow...\n');
  console.log('   This may take a few minutes depending on the number of parks...\n');

  const startTime = Date.now();
  const successCount = await submitUrlsToIndexNow(urls);
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Results
  console.log('\n' + '='.repeat(80));
  console.log('RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Successfully submitted: ${successCount} URLs`);
  console.log(`⚠️  Failed to submit: ${urls.length - successCount} URLs`);
  console.log(`⏱️  Duration: ${duration} seconds`);
  console.log('='.repeat(80));

  if (successCount === urls.length) {
    console.log('\n🎉 All URLs submitted successfully!');
  } else if (successCount > 0) {
    console.log('\n⚠️  Some URLs failed to submit. Check logs for details.');
  } else {
    console.log('\n❌ All submissions failed. Check logs for errors.');
    process.exit(1);
  }

  console.log('\n💡 Next steps:');
  console.log('   - Check server logs for detailed submission status');
  console.log('   - Verify submissions in Bing Webmaster Tools');
  console.log('   - Monitor search engine indexing status');
  console.log();
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

