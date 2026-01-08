/**
 * Script to count total parks including featured parks
 */

const fs = require('fs');
const path = require('path');

// Count static parks
const californiaPath = path.join(__dirname, '../public/data/california.json');
const washingtonPath = path.join(__dirname, '../public/data/washington.json');
const mixmatchPath = path.join(__dirname, '../public/data/mixmatch.json');

try {
  const californiaParks = JSON.parse(fs.readFileSync(californiaPath, 'utf-8'));
  const washingtonParks = JSON.parse(fs.readFileSync(washingtonPath, 'utf-8'));
  const mixmatchParks = JSON.parse(fs.readFileSync(mixmatchPath, 'utf-8'));

  const totalStatic = californiaParks.length + washingtonParks.length + mixmatchParks.length;
  
  console.log('='.repeat(60));
  console.log('PARK COUNT SUMMARY');
  console.log('='.repeat(60));
  console.log('\n📊 Static Parks (from JSON files):');
  console.log(`   - California: ${californiaParks.length}`);
  console.log(`   - Washington: ${washingtonParks.length}`);
  console.log(`   - Mixmatch (Multi-state): ${mixmatchParks.length}`);
  console.log(`   ─────────────────────────────────`);
  console.log(`   Total Static Parks: ${totalStatic}`);
  
  console.log('\n💎 Featured Parks:');
  console.log('   - Featured parks are stored in Supabase database');
  console.log('   - They are user-submitted parks with listing_type="featured"');
  console.log('   - To get exact count, query the database or check /api/parks/featured');
  
  console.log('\n📝 Note:');
  console.log('   - Total parks = Static parks + User-submitted parks (from database)');
  console.log('   - User-submitted parks include both free and featured listings');
  console.log('   - Featured parks are a subset of user-submitted parks');
  
  console.log('\n' + '='.repeat(60));
} catch (error) {
  console.error('Error counting parks:', error.message);
  process.exit(1);
}










































