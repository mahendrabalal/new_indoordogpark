#!/usr/bin/env tsx
/**
 * Unified IndexNow Submission Script
 * 
 * This script submits ALL valid URLs to IndexNow, ensuring complete coverage:
 * 1. Static Pages
 * 2. Parks (from JSON and DB)
 * 3. Cities
 * 4. Blog Posts, Categories, and Tags
 * 
 * Usage:
 *   npx tsx scripts/submit-all-to-indexnow.ts
 * 
 * Options:
 *   --dry-run    Only show URLs that would be submitted (don't actually submit)
 *   --limit N    Only submit first N URLs (useful for testing)
 *   --env-file   Path to .env.local file (default: .env.local)
 */

import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables strictly before other imports that might use them
const envFile = process.argv.find((arg) => arg.startsWith('--env-file='))?.split('=')[1] || '.env.local';
config({ path: resolve(process.cwd(), envFile) });

import { DogPark } from '../src/types/dog-park';
import { SITE_URL } from '../src/lib/metadata';
import { submitUrlsToIndexNow } from '../src/lib/indexnow';
// Sanity client will be imported dynamically to ensure env vars are loaded first

interface ScriptOptions {
    dryRun: boolean;
    limit?: number;
}

// ----------------------------------------------------------------------------
// DATA LOADING FUNCTIONS
// ----------------------------------------------------------------------------

async function getStaticUrls(): Promise<string[]> {
    const staticPaths = [
        '',
        '/about',
        '/contact',
        '/blog',
        '/parks-with-bars',
        '/training-facilities',
        '/list-your-park',
        '/faq',
        '/privacy',
        '/terms',
        '/how-it-works',
        '/owner-resources',
        '/partners',
        '/cookie-preferences',
    ];
    return staticPaths.map(path => `${SITE_URL}${path}`);
}

const DATA_DIR = join(process.cwd(), 'public/data');

async function getAllJsonFiles(): Promise<string[]> {
    try {
        const { readdir } = await import('fs/promises');
        const files = await readdir(DATA_DIR);
        return files.filter(file =>
            file.endsWith('.json') &&
            !file.startsWith('.') &&
            file !== 'keyword_clusters.json' // content-only file
        );
    } catch (error) {
        console.error('❌ Error reading data directory:', error);
        return [];
    }
}

async function getParkUrls(): Promise<string[]> {
    const allParks: DogPark[] = [];

    // Dynamic loading from public/data
    const files = await getAllJsonFiles();
    console.log(`   📂 Found ${files.length} data files: ${files.join(', ')}`);

    for (const file of files) {
        try {
            const path = join(DATA_DIR, file);
            const content = await readFile(path, 'utf-8');
            const parks: DogPark[] = JSON.parse(content);
            allParks.push(...parks);
        } catch (error) {
            console.warn(`⚠️  Failed to read ${file}:`, (error as Error).message);
        }
    }

    // Load from DB (optional)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
        try {
            // Dynamic import to avoid loading Supabase if env vars are missing
            const { supabaseAdminClient } = await import('../src/lib/supabase-admin');
            const { data: dbParks } = await supabaseAdminClient
                .from('park_submissions')
                .select('id, slug, name, city, state')
                .eq('status', 'approved');

            if (dbParks) {
                // Map simplified object to DogPark (casting as we only need slug/id)
                const parksFromDb = dbParks.map((p: any) => ({
                    id: p.id,
                    slug: p.slug || p.id,
                    name: p.name,
                    city: p.city,
                    state: p.state,
                } as DogPark));
                allParks.push(...parksFromDb);
            }
        } catch (error) {
            console.warn('⚠️  Could not load database parks:', (error as Error).message);
        }
    }

    return allParks
        .filter(p => p.slug || p.id)
        .map(p => `${SITE_URL}/parks/${p.slug || p.id}`);
}

async function getCityUrls(): Promise<string[]> {
    const allParks: DogPark[] = [];
    const files = await getAllJsonFiles();

    for (const file of files) {
        try {
            const path = join(DATA_DIR, file);
            const content = await readFile(path, 'utf-8');
            allParks.push(...JSON.parse(content));
        } catch { /* ignore */ }
    }

    const cities = new Set<string>();
    allParks.forEach(park => {
        if (park.city) {
            // Simple slugify logic to match `slugify` util
            const slug = park.city
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            cities.add(slug);
        }
    });

    return Array.from(cities).map(slug => `${SITE_URL}/cities/${slug}`);
}

async function getBlogUrls(): Promise<string[]> {
    const urls: string[] = [];

    try {
        // Dynamic import to ensure env vars are loaded
        const { sanityClient } = await import('../src/lib/sanity-client');

        // 1. Posts
        // We modify the query slightly to get all posts instead of paged
        const allPostsQuery = `*[_type == "post" && !(_id in path("drafts.**"))] { "slug": slug.current }`;
        const posts = await sanityClient.fetch<{ slug: string }[]>(allPostsQuery);
        posts.forEach((post) => urls.push(`${SITE_URL}/blog/${post.slug}`));

        // 2. Categories
        const categoriesQuery = `*[_type == "category"] { "slug": slug.current }`;
        const categories = await sanityClient.fetch<{ slug: string }[]>(categoriesQuery);
        categories.forEach((cat) => urls.push(`${SITE_URL}/blog/category/${cat.slug}`));

        // 3. Tags
        const tagsQuery = `*[_type == "tag"] { "slug": slug.current }`;
        const tags = await sanityClient.fetch<{ slug: string }[]>(tagsQuery);
        tags.forEach((tag) => urls.push(`${SITE_URL}/blog/tag/${tag.slug}`));

    } catch (error) {
        console.error('❌ Error fetching blog data from Sanity:', error);
    }

    return urls;
}

// ----------------------------------------------------------------------------
// MAIN SCRIPT
// ----------------------------------------------------------------------------

async function main() {
    const args = process.argv.slice(2);
    const options: ScriptOptions = {
        dryRun: args.includes('--dry-run'),
        limit: args.find((arg) => arg.startsWith('--limit='))?.split('=')[1]
            ? parseInt(args.find((arg) => arg.startsWith('--limit='))!.split('=')[1], 10)
            : undefined,
    };

    console.log('\n' + '='.repeat(80));
    console.log('🚀 UNIFIED INDEXNOW SUBMISSION');
    console.log('='.repeat(80));
    console.log(`Site URL: ${SITE_URL}`);
    console.log(`Mode: ${options.dryRun ? 'DRY RUN (no submissions)' : 'LIVE SUBMISSION'}`);
    console.log('='.repeat(80) + '\n');

    // Gather all URLs
    console.log('📥 Gathering URLs...');

    const [staticUrls, parkUrls, cityUrls, blogUrls] = await Promise.all([
        getStaticUrls(),
        getParkUrls(),
        getCityUrls(),
        getBlogUrls(),
    ]);

    console.log(`   - Static Pages: ${staticUrls.length}`);
    console.log(`   - Parks: ${parkUrls.length}`);
    console.log(`   - Cities: ${cityUrls.length}`);
    console.log(`   - Blog Content: ${blogUrls.length}`);

    const allUrls = [...staticUrls, ...parkUrls, ...cityUrls, ...blogUrls];

    // Deduplicate
    const uniqueUrls = Array.from(new Set(allUrls));
    console.log(`\n📊 Total Unique URLs: ${uniqueUrls.length}`);

    // Apply limit
    const urlsToSubmit = options.limit
        ? uniqueUrls.slice(0, options.limit)
        : uniqueUrls;

    if (options.limit) {
        console.log(`⚠️  Limit applied: sending first ${urlsToSubmit.length} URLs only`);
    }

    console.log('\n📝 Sample URLs:');
    urlsToSubmit.slice(0, 5).forEach(u => console.log(`   - ${u}`));
    if (urlsToSubmit.length > 5) console.log(`   ...and ${urlsToSubmit.length - 5} more`);

    if (options.dryRun) {
        console.log('\n✅ DRY RUN COMPLETE. No URLs submitted.');
        return;
    }

    // Submit
    console.log(`\n🚀 Submitting ${urlsToSubmit.length} URLs to IndexNow...`);
    const successCount = await submitUrlsToIndexNow(urlsToSubmit);

    console.log('\n' + '-'.repeat(80));
    if (successCount === urlsToSubmit.length) {
        console.log(`🎉 SUCCESS: All ${successCount} URLs submitted!`);
    } else {
        console.log(`⚠️  PARTIAL SUCCESS: ${successCount}/${urlsToSubmit.length} submitted.`);
        console.log('   Check logs for details.');
    }
}

main().catch(console.error);
