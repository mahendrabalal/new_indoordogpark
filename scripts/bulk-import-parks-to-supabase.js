const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function bulkImportParksToSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('📦 Bulk importing parks from static files to Supabase...\n');

  // First, clear existing test data
  console.log('🗑️  Cleaning up test data...');
  const { error: deleteError } = await supabase
    .from('park_submissions')
    .delete()
    .in('name', [
      'indoor dog park, california',
      'josdfewf',
      'mentall wellness.png',
      'Barking Hound Village Inn',
      'fsdpfvew',
      'non',
      'dhouqwidfhwq',
      'mahendra balal',
      'Down town indoor dog park',
      'gjoigewgew',
      'Public',
      'mahendra balalfdsfse',
      'South Bank Indoor Dog Park',
      'Meraki Paws N Play',
      'Mahendra Balal',
      'citiesinnepal.com',
      'Ghvb'
    ]);

  if (!deleteError) {
    console.log('✅ Cleaned up test data');
  }

  // Load parks from static files
  let allParks = [];

  // Load from california.json (has emails)
  try {
    const californiaData = JSON.parse(fs.readFileSync('public/data/california.json', 'utf8'));

    // Format the data for Supabase
    const formattedParks = californiaData.map(park => ({
      name: park.name,
      business_type: park.businessType || 'Dog Park',
      description: park.description || `Indoor dog park located in ${park.city}, ${park.state}.`,
      address: park.address,
      street: park.street,
      city: park.city,
      state: park.state,
      zip_code: park.zip_code,
      full_address: park.full_address,
      latitude: park.latitude,
      longitude: park.longitude,
      phone: park.phone,
      email: park.email,
      website: park.website,
      photos: park.photos || [],
      opening_hours: park.opening_hours || {},
      amenities: park.amenities || {},
      listing_type: 'free',
      status: 'approved' // Import as approved since they're already in your directory
    }));

    allParks = allParks.concat(formattedParks);
    console.log(`✅ Loaded ${formattedParks.length} parks from california.json`);
  } catch (e) {
    console.error('❌ Error loading california.json:', e.message);
  }

  // Load from standardized_dog_parks.json if it exists
  try {
    const standardizedData = JSON.parse(fs.readFileSync('public/data/standardized_dog_parks.json', 'utf8'));

    // Filter out parks that might already be imported
    const existingNames = new Set(allParks.map(p => p.name));
    const newParks = standardizedData.filter(p => !existingNames.has(p.name));

    if (newParks.length > 0) {
      const formattedParks = newParks.map(park => ({
        name: park.name,
        business_type: park.businessType || 'Dog Park',
        description: park.description || `Indoor dog park located in ${park.city}, ${park.state}.`,
        address: park.address,
        street: park.street,
        city: park.city,
        state: park.state,
        zip_code: park.zip_code,
        full_address: park.full_address,
        latitude: park.latitude,
        longitude: park.longitude,
        phone: park.phone,
        email: park.email,
        website: park.website,
        photos: park.photos || [],
        opening_hours: park.opening_hours || {},
        amenities: park.amenities || {},
        listing_type: 'free',
        status: 'approved'
      }));

      allParks = allParks.concat(formattedParks);
      console.log(`✅ Loaded ${formattedParks.length} additional parks from standardized_dog_parks.json`);
    }
  } catch (e) {
    console.log('ℹ️  standardized_dog_parks.json not found or error');
  }

  console.log(`\n📊 Total parks to import: ${allParks.length}`);

  // Import in batches to avoid timeouts
  const batchSize = 10;
  let imported = 0;
  let failed = 0;

  for (let i = 0; i < allParks.length; i += batchSize) {
    const batch = allParks.slice(i, i + batchSize);
    console.log(`\n📤 Importing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allParks.length / batchSize)} (${batch.length} parks)...`);

    for (const park of batch) {
      try {
        const { error } = await supabase
          .from('park_submissions')
          .insert({
            ...park,
            user_id: '00000000-0000-0000-0000-000000000000' // System user ID for bulk imports
          });

        if (error) {
          console.log(`  ❌ Failed to import "${park.name}": ${error.message}`);
          failed++;
        } else {
          console.log(`  ✅ Imported: ${park.name}`);
          imported++;
        }
      } catch (e) {
        console.log(`  ❌ Error importing "${park.name}": ${e.message}`);
        failed++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Import Summary');
  console.log('='.repeat(60));
  console.log(`Total attempted: ${allParks.length}`);
  console.log(`✅ Successfully imported: ${imported}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success rate: ${((imported / allParks.length) * 100).toFixed(1)}%`);

  // Check final count
  const { count: finalCount, error: countError } = await supabase
    .from('park_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { count: emailCount } = await supabase
    .from('park_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
    .not('email', 'is', null)
    .not('email', 'eq', '');

  if (!countError) {
    console.log(`\n📊 Final counts in Supabase:`);
    console.log(`Total approved parks: ${finalCount}`);
    console.log(`Parks with emails: ${emailCount}`);
  }
}

bulkImportParksToSupabase().catch(console.error);