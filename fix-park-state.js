/**
 * Script to fix the state for a park submission
 * Usage: node fix-park-state.js "Barking Hound Village Inn" "Georgia"
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

async function fixParkState(parkName, correctState) {
  try {
    console.log(`\n🔍 Searching for: "${parkName}"\n`);

    // Search for the park by name (case-insensitive)
    const { data: parks, error: searchError } = await supabase
      .from('park_submissions')
      .select('*')
      .ilike('name', `%${parkName}%`)
      .order('created_at', { ascending: false });

    if (searchError) {
      console.error('❌ Database error:', searchError);
      return;
    }

    if (!parks || parks.length === 0) {
      console.log('❌ No park found with that name.');
      return;
    }

    // Find the park that needs fixing
    const parkToFix = parks.find(p => p.state !== correctState) || parks[0];

    if (!parkToFix) {
      console.log('✅ All parks already have the correct state.');
      return;
    }

    console.log(`Found park: ${parkToFix.name}`);
    console.log(`Current state: ${parkToFix.state}`);
    console.log(`Correct state: ${correctState}`);
    console.log(`City: ${parkToFix.city}`);

    if (parkToFix.state === correctState) {
      console.log('\n✅ Park already has the correct state!');
      return;
    }

    // Update the state
    const { data: updatedPark, error: updateError } = await supabase
      .from('park_submissions')
      .update({ 
        state: correctState,
        updated_at: new Date().toISOString()
      })
      .eq('id', parkToFix.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating park:', updateError);
      return;
    }

    console.log('\n✅ Park state updated successfully!');
    console.log(`   New state: ${updatedPark.state}`);
    console.log(`   City: ${updatedPark.city}`);
    console.log(`   Full address: ${updatedPark.full_address || 'N/A'}`);

    // Also update full_address if it exists and contains the wrong state
    if (updatedPark.full_address && updatedPark.full_address.includes(parkToFix.state)) {
      const correctedAddress = updatedPark.full_address.replace(
        new RegExp(parkToFix.state, 'gi'),
        correctState
      );
      
      const { error: addressError } = await supabase
        .from('park_submissions')
        .update({ 
          full_address: correctedAddress,
          updated_at: new Date().toISOString()
        })
        .eq('id', parkToFix.id);

      if (!addressError) {
        console.log(`   Updated full_address: ${correctedAddress}`);
      }
    }

    console.log('\n✨ The park should now appear in search results!');
    console.log('   (It may take a few seconds for the cache to refresh)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get park name and state from command line arguments
const parkName = process.argv[2];
const correctState = process.argv[3];

if (!parkName || !correctState) {
  console.log('Usage: node fix-park-state.js "Park Name" "Correct State"');
  console.log('\nExample:');
  console.log('  node fix-park-state.js "Barking Hound Village Inn" "Georgia"');
  process.exit(1);
}

fixParkState(parkName, correctState)
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });




