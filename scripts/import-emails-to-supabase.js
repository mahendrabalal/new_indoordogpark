const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function importEmailsToSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('📧 Importing email addresses from static files to Supabase...\n');

  // Load parks from static files
  let staticParks = [];

  try {
    // Try standardized_dog_parks.json
    const standardizedData = JSON.parse(
      fs.readFileSync('public/data/standardized_dog_parks.json', 'utf8')
    );
    staticParks = staticParks.concat(
      standardizedData.filter(p => p.email && p.email.trim() !== '')
    );
    console.log(`✅ Found ${standardizedData.filter(p => p.email && p.email.trim() !== '').length} parks with emails in standardized_dog_parks.json`);
  } catch (e) {
    console.log('⚠️  standardized_dog_parks.json not found');
  }

  try {
    // Try california.json
    const californiaData = JSON.parse(
      fs.readFileSync('public/data/california.json', 'utf8')
    );
    staticParks = staticParks.concat(
      californiaData.filter(p => p.email && p.email.trim() !== '')
    );
    console.log(`✅ Found ${californiaData.filter(p => p.email && p.email.trim() !== '').length} parks with emails in california.json`);
  } catch (e) {
    console.log('⚠️  california.json not found');
  }

  console.log(`\n📊 Total parks with emails from static files: ${staticParks.length}`);

  // Get parks without emails from Supabase
  const { data: parksWithoutEmails, error } = await supabase
    .from('park_submissions')
    .select('id, name, city, state')
    .or('email.is.null,email.eq.');

  if (error) {
    console.error('❌ Error fetching parks:', error);
    return;
  }

  console.log(`📝 Found ${parksWithoutEmails.length} parks in Supabase without emails\n`);

  // Match parks by name and update with email
  let updated = 0;
  let notFound = [];

  for (const supabasePark of parksWithoutEmails) {
    // Try to find matching park in static data
    const matchingPark = staticParks.find(sp => {
      // Try exact match first
      if (sp.name.toLowerCase() === supabasePark.name.toLowerCase()) {
        return true;
      }

      // Try partial match (removing common suffixes/prefixes)
      const cleanStaticName = sp.name.toLowerCase().replace(/indoor|dog|park|academy|center|training/g, '').trim();
      const cleanSupabaseName = supabasePark.name.toLowerCase().replace(/indoor|dog|park|academy|center|training/g, '').trim();

      return cleanStaticName === cleanSupabaseName ||
             sp.name.toLowerCase().includes(supabasePark.name.toLowerCase()) ||
             supabasePark.name.toLowerCase().includes(sp.name.toLowerCase());
    });

    if (matchingPark) {
      // Update the park with email
      const { error: updateError } = await supabase
        .from('park_submissions')
        .update({
          email: matchingPark.email,
          phone: matchingPark.phone || null,
          website: matchingPark.website || null
        })
        .eq('id', supabasePark.id);

      if (!updateError) {
        console.log(`✅ Updated "${supabasePark.name}" with email: ${matchingPark.email}`);
        updated++;
      } else {
        console.log(`❌ Failed to update "${supabasePark.name}": ${updateError.message}`);
      }
    } else {
      notFound.push(supabasePark.name);
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`✅ Successfully updated: ${updated} parks`);
  console.log(`❓ Could not find matches for: ${notFound.length} parks`);

  if (notFound.length > 0) {
    console.log('\nParks without matches:');
    notFound.forEach(name => console.log(`  • ${name}`));
  }

  // Run check again to see results
  console.log('\n🔍 Checking results after import...');
  const { count: emailCount } = await supabase
    .from('park_submissions')
    .select('*', { count: 'exact', head: true })
    .not('email', 'is', null)
    .not('email', 'eq', '');

  console.log(`📧 Total parks with emails in Supabase now: ${emailCount}`);
}

importEmailsToSupabase().catch(console.error);