#!/usr/bin/env node

/**
 * generate-outreach-db.js
 *
 * Generates a CSV file of all parks with their listing URLs.
 * Parks WITHOUT emails are included so you can fill them in manually
 * or use a tool like Hunter.io / Apollo to find the emails.
 *
 * Usage:
 *   node scripts/generate-outreach-db.js
 *   node scripts/generate-outreach-db.js --only-missing   (parks without email only)
 *   node scripts/generate-outreach-db.js --only-email     (parks with email only, ready to send)
 *   node scripts/generate-outreach-db.js --state CA       (filter by state)
 */

const fs = require('fs');
const path = require('path');

const STATE_FILES = [
  'california',
  'missouri',
  'newjersey',
  'newyork',
  'northcarolina',
  'ohio',
  'pennsylvania',
  'tennessee',
  'texas',
  'virginia',
  'washington',
];

const BASE_URL = 'https://www.indoordogpark.org';

// ── Parse CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const onlyMissing = args.includes('--only-missing');
const onlyWithEmail = args.includes('--only-email');
const stateFilter = args.includes('--state') ? args[args.indexOf('--state') + 1]?.toLowerCase() : null;

// ── Load all parks ─────────────────────────────────────────────────────────
let allParks = [];

STATE_FILES.forEach((fileName) => {
  const filePath = path.resolve(process.cwd(), `public/data/${fileName}.json`);
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const parks = Array.isArray(data) ? data : data.parks || [];

  parks.forEach((p) => {
    allParks.push({
      name:        p.name || '',
      slug:        p.slug || p.id || '',
      email:       p.email || '',
      website:     p.website || '',
      phone:       p.phone || '',
      city:        p.city || '',
      state:       p.state || '',
      listing_url: `${BASE_URL}/parks/${p.slug || p.id}`,
      has_email:   !!(p.email && p.email.trim()),
      source_file: fileName,
    });
  });
});

// ── Apply filters ──────────────────────────────────────────────────────────
let filtered = allParks;

if (stateFilter) {
  filtered = filtered.filter(
    (p) => p.state.toLowerCase() === stateFilter || p.source_file.toLowerCase().includes(stateFilter)
  );
}

if (onlyMissing)    filtered = filtered.filter((p) => !p.has_email);
if (onlyWithEmail)  filtered = filtered.filter((p) => p.has_email);

// ── Stats ──────────────────────────────────────────────────────────────────
const withEmail    = allParks.filter((p) => p.has_email).length;
const withoutEmail = allParks.length - withEmail;

console.log('\n📊 Database Stats');
console.log('─────────────────────────────────────────');
console.log(`  Total parks:          ${allParks.length}`);
console.log(`  ✅ Have email:        ${withEmail}`);
console.log(`  ❌ Missing email:     ${withoutEmail} (${((withoutEmail / allParks.length) * 100).toFixed(1)}%)`);
console.log(`  Filtered rows:        ${filtered.length}`);
console.log('─────────────────────────────────────────\n');

// ── Generate CSV ───────────────────────────────────────────────────────────
const CSV_HEADERS = ['name', 'email', 'listing_url', 'website', 'phone', 'city', 'state', 'has_email'];

function escapeCsv(val) {
  const str = String(val ?? '');
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str;
}

const csvLines = [
  CSV_HEADERS.join(','),
  ...filtered.map((p) =>
    CSV_HEADERS.map((h) => escapeCsv(p[h])).join(',')
  ),
];

const timestamp  = new Date().toISOString().slice(0, 10);
const suffix     = onlyMissing ? '-missing-email' : onlyWithEmail ? '-ready-to-send' : '-all';
const stateLabel = stateFilter ? `-${stateFilter}` : '';
const outFile    = path.resolve(process.cwd(), `outreach-db${stateLabel}${suffix}-${timestamp}.csv`);

fs.writeFileSync(outFile, csvLines.join('\n'), 'utf-8');
console.log(`✅ CSV saved to: ${outFile}`);
console.log(`   ${filtered.length} rows written\n`);

// ── How to find missing emails ─────────────────────────────────────────────
if (!onlyWithEmail) {
  console.log('💡 How to find missing emails:');
  console.log('');
  console.log('   Option 1 — Hunter.io (easiest, free tier available)');
  console.log('   → hunter.io/bulk   Upload the CSV, it finds emails from website domain');
  console.log('');
  console.log('   Option 2 — Apollo.io (free tier)');
  console.log('   → apollo.io        Search by business name + city, exports emails');
  console.log('');
  console.log('   Option 3 — Google manually');
  console.log('   → Search: "park name contact" or visit their website /contact page');
  console.log('');
  console.log('   Option 4 — Scrape from Google Business Profile');
  console.log('   → Most GBP listings show an email in the "Contact" section');
  console.log('');
}
