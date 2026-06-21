#!/usr/bin/env ts-node

/**
 * Script to import enriched data (emails) from Hunter.io CSV export
 * and update the local JSON database files.
 * 
 * Usage:
 *   npx ts-node scripts/import-hunter-csv.ts <path-to-hunter-csv>
 */

const fs = require('fs');
const path = require('path');

// Simple CSV parser
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  
  // Parse a line, respecting quotes
  function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
  
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    results.push(obj);
  }
  return results;
}

// Extract domain from URL for matching
function getDomain(url) {
  if (!url) return '';
  try {
    let cleanUrl = url.toLowerCase().trim();
    if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
    const { hostname } = new URL(cleanUrl);
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return url.toLowerCase().trim().replace(/^www\./, '');
  }
}

async function main() {
  const csvPath = process.argv[2];
  
  if (!csvPath) {
    console.error('❌ Please provide the path to your Hunter.io CSV export.');
    console.error('Usage: npx ts-node scripts/import-hunter-csv.ts hunter-export.csv');
    process.exit(1);
  }

  const fullCsvPath = path.resolve(process.cwd(), csvPath);
  if (!fs.existsSync(fullCsvPath)) {
    console.error(`❌ File not found: ${fullCsvPath}`);
    process.exit(1);
  }

  console.log(`📂 Reading Hunter export: ${csvPath}...`);
  const csvContent = fs.readFileSync(fullCsvPath, 'utf-8');
  const records = parseCSV(csvContent);
  console.log(`📊 Found ${records.length} records in CSV.`);

  // Find which column has the email and which has the domain/website
  if (records.length === 0) {
    console.log('CSV is empty!');
    process.exit(0);
  }

  const firstRec = records[0];
  const keys = Object.keys(firstRec);
  
  const emailKey = keys.find(k => k.includes('email')) || keys.find(k => k === 'e-mail');
  const websiteKey = keys.find(k => k.includes('domain') || k.includes('website') || k === 'url');

  if (!emailKey) {
    console.error('❌ Could not identify an Email column in the CSV.');
    console.log('Available columns:', keys.join(', '));
    process.exit(1);
  }

  if (!websiteKey) {
    console.error('❌ Could not identify a Domain/Website column in the CSV to match records.');
    console.log('Available columns:', keys.join(', '));
    process.exit(1);
  }

  // Create a map of domains to emails from Hunter
  const hunterData = new Map();
  let validEmailsCount = 0;

  records.forEach(rec => {
    const email = rec[emailKey];
    const website = rec[websiteKey];
    
    if (email && website) {
      const domain = getDomain(website);
      if (domain) {
        hunterData.set(domain, email);
        validEmailsCount++;
      }
    }
  });

  console.log(`✅ Extracted ${validEmailsCount} valid emails mapped to domains from CSV.\n`);

  // Now scan all JSON files in public/data
  const dataDir = path.join(process.cwd(), 'public/data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  let totalUpdated = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let data;
    
    try {
      data = JSON.parse(fileContent);
    } catch (e) {
      console.warn(`⚠️ Could not parse ${file}, skipping.`);
      continue;
    }

    const parksArray = Array.isArray(data) ? data : (data.parks || []);
    let fileUpdatedCount = 0;

    for (const park of parksArray) {
      if (park.website && !park.email) {
        const domain = getDomain(park.website);
        if (hunterData.has(domain)) {
          park.email = hunterData.get(domain);
          fileUpdatedCount++;
          totalUpdated++;
        }
      }
    }

    if (fileUpdatedCount > 0) {
      // Save the updated file
      if (Array.isArray(data)) {
        fs.writeFileSync(filePath, JSON.stringify(parksArray, null, 2));
      } else {
        data.parks = parksArray;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
      console.log(`📝 Updated ${fileUpdatedCount} parks in ${file}`);
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log(`🎉 IMPORT COMPLETE!`);
  console.log(`Successfully added ${totalUpdated} new emails to the database.`);
  console.log('='.repeat(40));
}

main().catch(console.error);
