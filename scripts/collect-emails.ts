#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ParkData {
    id: string;
    name: string;
    email?: string;
    website?: string;
    city?: string;
    state?: string;
    [key: string]: any;
}

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

async function extractEmailFromUrl(url: string): Promise<string | null> {
    if (!url) return null;

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // 1. Regular regex search in HTML
        const emails = html.match(EMAIL_REGEX);
        let filtered: string[] = [];

        if (emails) {
            filtered = emails.filter((e: string) =>
                !any(x in e.toLowerCase() for x in ['noreply', 'no-reply', 'privacy', 'legal', 'domain', 'sentry', 'example'])
      );
        }

        if (filtered.length > 0) return filtered[0];

        // 2. Look for mailto: links
        const mailto = $('a[href^="mailto:"]');
        if (mailto.length > 0) {
            const email = mailto.attr('href')?.replace('mailto:', '').split('?')[0].trim();
            if (email && EMAIL_REGEX.test(email)) return email;
        }

        return null;
    } catch (error) {
        // Silently fail for individual URLs
        return null;
    }
}

// Helper for 'any' logic
function any(conditions: boolean[]): boolean {
    return conditions.some(c => c);
}

async function processFile(filePath: string, limit: number) {
    console.log(`Processing ${filePath}...`);
    const fullPath = path.resolve(process.cwd(), filePath);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    const parks = Array.isArray(data) ? data : (data.parks || []);
    let foundCount = 0;
    let processedCount = 0;

    for (const park of parks) {
        if (processedCount >= limit) break;

        if (park.website && !park.email) {
            processedCount++;
            const email = await extractEmailFromUrl(park.website);
            if (email) {
                park.email = email;
                foundCount++;
                console.log(`✅ Found email for ${park.name}: ${email}`);
            } else {
                console.log(`❌ No email found for ${park.name}`);
            }

            // Add a small delay to be polite
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    if (foundCount > 0) {
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
        console.log(`\nUpdated ${filePath} with ${foundCount} new emails.`);
    } else {
        console.log(`\nNo new emails found for ${filePath}.`);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const fileArg = args.find(a => a.startsWith('--file='))?.split('=')[1] || 'public/data/california.json';
    const limitArg = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '10');

    await processFile(fileArg, limitArg);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
