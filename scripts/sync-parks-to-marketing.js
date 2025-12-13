const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function syncParksToMarketingTable() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('🔄 Syncing parks to marketing contacts table...\n');

  // First, create the marketing_contacts table if it doesn't exist
  console.log('📋 Creating marketing_contacts table...');
  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS marketing_contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        park_id UUID,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        state VARCHAR(50),
        phone VARCHAR(50),
        website VARCHAR(500),
        source VARCHAR(50) DEFAULT 'imported',
        status VARCHAR(20) DEFAULT 'active',
        email_sent BOOLEAN DEFAULT FALSE,
        last_email_sent TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(email)
      );

      CREATE INDEX IF NOT EXISTS idx_marketing_contacts_email ON marketing_contacts(email);
      CREATE INDEX IF NOT EXISTS idx_marketing_contacts_status ON marketing_contacts(status);
      CREATE INDEX IF NOT EXISTS idx_marketing_contacts_email_sent ON marketing_contacts(email_sent);

      -- Create trigger for updated_at
      CREATE OR REPLACE FUNCTION update_marketing_contacts_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS update_marketing_contacts_updated_at_trigger ON marketing_contacts;
      CREATE TRIGGER update_marketing_contacts_updated_at_trigger
        BEFORE UPDATE ON marketing_contacts
        FOR EACH ROW
        EXECUTE FUNCTION update_marketing_contacts_updated_at();
    `
  });

  if (tableError) {
    console.log('⚠️  Table might already exist:', tableError.message);
  } else {
    console.log('✅ Table created successfully');
  }

  // Load parks from static files
  let allParks = [];

  // Load from california.json
  try {
    const californiaData = JSON.parse(fs.readFileSync('public/data/california.json', 'utf8'));
    allParks = allParks.concat(californiaData.filter(p => p.email && p.email.trim() !== ''));
    console.log(`✅ Loaded ${allParks.length} parks from california.json`);
  } catch (e) {
    console.log('⚠️  california.json not found');
  }

  // Load from standardized_dog_parks.json
  try {
    const standardizedData = JSON.parse(fs.readFileSync('public/data/standardized_dog_parks.json', 'utf8'));
    allParks = allParks.concat(standardizedData.filter(p => p.email && p.email.trim() !== ''));
    console.log(`✅ Total parks loaded: ${allParks.length}`);
  } catch (e) {
    console.log('⚠️  standardized_dog_parks.json not found');
  }

  // Also get parks from Supabase
  try {
    const { data: supabaseParks } = await supabase
      .from('park_submissions')
      .select('name, email, city, state, phone, website')
      .eq('status', 'approved')
      .not('email', 'is', null)
      .not('email', 'eq', '');

    if (supabaseParks && supabaseParks.length > 0) {
      allParks = allParks.concat(supabaseParks);
      console.log(`✅ Added ${supabaseParks.length} parks from Supabase`);
    }
  } catch (e) {
    console.log('⚠️  Could not fetch from Supabase');
  }

  // Deduplicate by email
  const uniqueParks = [];
  const seenEmails = new Set();

  for (const park of allParks) {
    const email = park.email ? park.email.toLowerCase().trim() : null;
    if (email && !seenEmails.has(email)) {
      seenEmails.add(email);
      uniqueParks.push({
        name: park.name || 'Indoor Dog Park',
        email: email,
        city: park.city || '',
        state: park.state || '',
        phone: park.phone || '',
        website: park.website || '',
        source: park.id ? 'supabase' : 'imported'
      });
    }
  }

  console.log(`\n📊 Total unique parks to sync: ${uniqueParks.length}`);

  // Upsert to marketing_contacts table
  let synced = 0;
  let updated = 0;

  for (const park of uniqueParks) {
    try {
      const { data, error } = await supabase
        .from('marketing_contacts')
        .upsert({
          name: park.name,
          email: park.email,
          city: park.city,
          state: park.state,
          phone: park.phone,
          website: park.website,
          source: park.source
        }, {
          onConflict: 'email'
        })
        .select();

      if (!error) {
        if (data && data.length === 1) {
          synced++;
          console.log(`  ✅ Synced: ${park.name} (${park.email})`);
        }
      } else {
        console.log(`  ❌ Failed: ${park.email} - ${error.message}`);
      }
    } catch (e) {
      console.log(`  ❌ Error: ${park.email} - ${e.message}`);
    }
  }

  // Get final count
  const { count: finalCount } = await supabase
    .from('marketing_contacts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  console.log('\n' + '='.repeat(60));
  console.log('📊 Sync Summary');
  console.log('='.repeat(60));
  console.log(`✅ Total active contacts in marketing table: ${finalCount}`);

  return finalCount || 0;
}

// Run the sync
syncParksToMarketingTable().catch(console.error);