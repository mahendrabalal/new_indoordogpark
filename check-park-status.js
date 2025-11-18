/**
 * Script to check the status of a park submission in the database
 * Usage: node check-park-status.js "Barking Hound Village Inn"
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkParkStatus(parkName) {
  try {
    console.log(`\n🔍 Searching for: "${parkName}"\n`);

    // Search for the park by name (case-insensitive)
    const { data: parks, error } = await supabase
      .from('park_submissions')
      .select('*')
      .ilike('name', `%${parkName}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      return;
    }

    if (!parks || parks.length === 0) {
      console.log('❌ No park found with that name.');
      console.log('\n💡 The park may not have been submitted yet, or the name might be different.');
      return;
    }

    console.log(`✅ Found ${parks.length} park(s):\n`);

    parks.forEach((park, index) => {
      console.log(`--- Park ${index + 1} ---`);
      console.log(`ID: ${park.id}`);
      console.log(`Name: ${park.name}`);
      console.log(`Status: ${park.status.toUpperCase()}`);
      console.log(`City: ${park.city}, ${park.state}`);
      console.log(`Created: ${new Date(park.created_at).toLocaleString()}`);
      
      if (park.approved_at) {
        console.log(`Approved: ${new Date(park.approved_at).toLocaleString()}`);
      } else {
        console.log(`Approved: ❌ Not approved yet`);
      }

      if (park.rejection_reason) {
        console.log(`Rejection Reason: ${park.rejection_reason}`);
      }

      console.log(`Listing Type: ${park.listing_type || 'free'}`);
      console.log('');
    });

    // Check if any are pending
    const pendingParks = parks.filter(p => p.status === 'pending');
    if (pendingParks.length > 0) {
      console.log(`\n⚠️  ${pendingParks.length} park(s) are still PENDING approval.`);
      console.log('   They will NOT appear in search results until approved.');
      console.log('\n💡 To approve a park:');
      console.log('   1. Go to /admin in your browser');
      console.log('   2. Find the park in the submissions list');
      console.log('   3. Click "Approve" button');
      console.log('\n   Or use the API directly:');
      pendingParks.forEach(park => {
        console.log(`   POST /api/admin/submissions/approve`);
        console.log(`   Body: { "submissionId": "${park.id}" }`);
      });
    }

    const approvedParks = parks.filter(p => p.status === 'approved');
    if (approvedParks.length > 0) {
      console.log(`\n✅ ${approvedParks.length} park(s) are APPROVED and should appear in search.`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get park name from command line argument
const parkName = process.argv[2];

if (!parkName) {
  console.log('Usage: node check-park-status.js "Park Name"');
  console.log('\nExample:');
  console.log('  node check-park-status.js "Barking Hound Village Inn"');
  process.exit(1);
}

checkParkStatus(parkName)
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });


