#!/usr/bin/env node
/**
 * Deduplicate parks in JSON files by name+city combination.
 * 
 * Industry best practice: Remove duplicates to improve data quality and search accuracy.
 * Keeps the most complete version of each park.
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Calculate data completeness score for a park
 */
function getCompletenessScore(park) {
  let score = 0;
  
  // Basic required fields
  if (park.name) score += 10;
  if (park.city) score += 10;
  if (park.state) score += 5;
  if (park.address || park.full_address) score += 5;
  
  // Location data
  if (park.latitude && park.longitude) score += 10;
  
  // Contact info
  if (park.phone) score += 5;
  if (park.website) score += 5;
  if (park.email) score += 3;
  
  // Media
  if (park.photo) score += 5;
  if (park.photos && Array.isArray(park.photos) && park.photos.length > 0) {
    score += park.photos.length * 2; // More photos = more complete
  }
  
  // Details
  if (park.description) score += 5;
  if (park.rating) score += 3;
  if (park.reviewCount || park.userRatingsTotal) score += 3;
  if (park.businessType) score += 3;
  if (park.openingHours && Object.keys(park.openingHours).length > 0) score += 5;
  if (park.amenities && Object.keys(park.amenities).length > 0) score += 5;
  if (park.priceLevel !== undefined) score += 2;
  if (park.pricing) score += 3;
  
  // Additional fields
  if (park.slug) score += 2;
  if (park.zipCode) score += 2;
  
  return score;
}

/**
 * Merge two park records, keeping the more complete version
 */
function mergeParkData(oldPark, newPark) {
  const oldScore = getCompletenessScore(oldPark);
  const newScore = getCompletenessScore(newPark);
  
  // Start with the more complete version
  const merged = newScore >= oldScore ? { ...newPark } : { ...oldPark };
  const base = newScore >= oldScore ? oldPark : newPark;
  
  // Fill in missing fields from the other record
  for (const [key, value] of Object.entries(base)) {
    if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
      merged[key] = value;
    } else if (key === 'photos' && Array.isArray(value)) {
      // Combine photos, avoiding duplicates
      const existingUrls = new Set(
        (merged.photos || []).map(p => typeof p === 'string' ? p : p.url).filter(Boolean)
      );
      merged.photos = [...(merged.photos || [])];
      for (const photo of value) {
        const url = typeof photo === 'string' ? photo : photo.url;
        if (url && !existingUrls.has(url)) {
          merged.photos.push(photo);
          existingUrls.add(url);
        }
      }
    } else if (key === 'amenities' && typeof value === 'object' && value !== null) {
      // Merge amenities - if either says true, keep it true
      merged.amenities = { ...(merged.amenities || {}), ...value };
    } else if (key === 'openingHours' && typeof value === 'object' && value !== null) {
      // Merge opening hours
      merged.openingHours = { ...(merged.openingHours || {}), ...value };
    }
  }
  
  return merged;
}

/**
 * Deduplicate parks by name+city combination
 */
function deduplicateParks(parks) {
  const parksByKey = new Map();
  const duplicates = [];
  
  for (const park of parks) {
    // Create unique key from name and city
    const key = `${(park.name || '').toLowerCase().trim()}|${(park.city || '').toLowerCase().trim()}`;
    
    if (parksByKey.has(key)) {
      // Duplicate found - merge with existing
      const existing = parksByKey.get(key);
      duplicates.push({
        name: park.name,
        city: park.city,
        id: park.id,
        existingId: existing.id,
      });
      
      // Keep the more complete version
      const merged = mergeParkData(existing, park);
      parksByKey.set(key, merged);
    } else {
      parksByKey.set(key, park);
    }
  }
  
  return {
    unique: Array.from(parksByKey.values()),
    duplicates,
  };
}

/**
 * Process a single JSON file
 */
async function processFile(filePath) {
  try {
    console.log(`\n📄 Processing: ${filePath}`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const parks = JSON.parse(content);
    
    if (!Array.isArray(parks)) {
      console.error(`❌ File ${filePath} does not contain an array`);
      return null;
    }
    
    console.log(`   Loaded ${parks.length} parks`);
    
    const { unique, duplicates } = deduplicateParks(parks);
    
    console.log(`   ✓ Found ${duplicates.length} duplicates`);
    console.log(`   ✓ Unique parks: ${unique.length}`);
    
    if (duplicates.length > 0) {
      // Show first 5 duplicates
      console.log(`   Duplicates (first 5):`);
      duplicates.slice(0, 5).forEach(d => {
        console.log(`     - ${d.name} in ${d.city} (ID: ${d.id} vs ${d.existingId})`);
      });
    }
    
    // Write deduplicated data back
    await fs.writeFile(
      filePath,
      JSON.stringify(unique, null, 2),
      'utf-8'
    );
    
    console.log(`   ✓ Saved ${unique.length} unique parks to ${filePath}`);
    
    return {
      file: filePath,
      before: parks.length,
      after: unique.length,
      duplicates: duplicates.length,
    };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(80));
  console.log('PARK DEDUPLICATION SCRIPT');
  console.log('='.repeat(80));
  
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const filesToProcess = [
    'california.json',
    'washington.json',
    'mixmatch.json',
  ];
  
  const results = [];
  
  for (const filename of filesToProcess) {
    const filePath = path.join(dataDir, filename);
    
    try {
      await fs.access(filePath);
      const result = await processFile(filePath);
      if (result) {
        results.push(result);
      }
    } catch (error) {
      console.log(`⚠️  File not found: ${filePath} (skipping)`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('DEDUPLICATION SUMMARY');
  console.log('='.repeat(80));
  
  let totalBefore = 0;
  let totalAfter = 0;
  let totalDuplicates = 0;
  
  for (const result of results) {
    console.log(`\n${path.basename(result.file)}:`);
    console.log(`  Before: ${result.before} parks`);
    console.log(`  Duplicates removed: ${result.duplicates}`);
    console.log(`  After: ${result.after} parks`);
    
    totalBefore += result.before;
    totalAfter += result.after;
    totalDuplicates += result.duplicates;
  }
  
  console.log('\n' + '-'.repeat(80));
  console.log(`TOTAL:`);
  console.log(`  Before: ${totalBefore} parks`);
  console.log(`  Duplicates removed: ${totalDuplicates}`);
  console.log(`  After: ${totalAfter} parks`);
  console.log(`  Reduction: ${((totalDuplicates / totalBefore) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));
  
  if (totalDuplicates > 0) {
    console.log('\n✅ Deduplication complete! Data quality improved.');
  } else {
    console.log('\n✅ No duplicates found. Data is clean.');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { deduplicateParks, getCompletenessScore, mergeParkData };























