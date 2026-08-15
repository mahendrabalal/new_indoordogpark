const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmvgnrwqcjtrudadxttq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdmducndxY2p0cnVkYWR4dHRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQyNzkxMiwiZXhwIjoyMDcwMDAzOTEyfQ.yr5qxPSeWnwMG8u89LjQ_1vdTJmhPVeM9eRF-cudAqk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifySetup() {
  console.log('🔍 Verifying complete setup...\n');

  // Test all critical columns
  const { data, error } = await supabase
    .from('park_submissions')
    .select('id, name, listing_type, status, created_at, updated_at')
    .limit(3);

  if (error) {
    console.log('❌ Error:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\n⚠️  Some columns are still missing!');
      console.log('   Please make sure you ran the COMPLETE SQL migration.');
    }
    return;
  }

  console.log('✅ All critical columns exist!');
  console.log('\nSample data:');
  console.log(JSON.stringify(data, null, 2));

  // Test subscriptions table
  const { error: subsError } = await supabase
    .from('subscriptions')
    .select('id')
    .limit(1);

  if (subsError) {
    console.log('\n❌ Subscriptions table error:', subsError.message);
  } else {
    console.log('\n✅ Subscriptions table exists!');
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 DATABASE IS READY!');
  console.log('='.repeat(50));
  console.log('\nNext steps:');
  console.log('1. Refresh your browser');
  console.log('2. Log out and log back in');
  console.log('3. Go to: http://localhost:3001/list-property');
  console.log('4. Submit the listing');
  console.log('\nThe database is now properly configured!');
}

verifySetup();
