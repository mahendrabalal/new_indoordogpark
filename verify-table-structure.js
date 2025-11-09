const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmvgnrwqcjtrudadxttq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdmducndxY2p0cnVkYWR4dHRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQyNzkxMiwiZXhwIjoyMDcwMDAzOTEyfQ.yr5qxPSeWnwMG8u89LjQ_1vdTJmhPVeM9eRF-cudAqk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifyStructure() {
  console.log('🔍 Checking actual table structure in Supabase...\n');

  // Use raw SQL to query the information schema
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'park_submissions'
      ORDER BY ordinal_position;
    `
  });

  if (error) {
    console.log('❌ Could not query table structure via RPC');
    console.log('Error:', error.message);
    console.log('\nTrying alternative method...\n');

    // Try fetching with explicit column selection
    const { data: testData, error: testError } = await supabase
      .from('park_submissions')
      .select('id, user_id, name, listing_type, created_at, updated_at')
      .limit(0);

    if (testError) {
      console.log('❌ Columns still missing!');
      console.log('Error:', testError.message);
      console.log('\n⚠️  Supabase cache may need to refresh.');
      console.log('   Wait 30 seconds and try again, or restart Supabase project.');
    } else {
      console.log('✅ Columns exist! Cache should refresh soon.');
      console.log('   The errors you see are from Supabase REST API cache.');
      console.log('\n💡 Solution: Wait 1-2 minutes for cache to clear.');
    }
  } else {
    console.log('✅ Table structure:');
    console.log(data);
  }
}

verifyStructure();
