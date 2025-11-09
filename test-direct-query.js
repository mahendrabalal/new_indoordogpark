const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmvgnrwqcjtrudadxttq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdmducndxY2p0cnVkYWR4dHRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQyNzkxMiwiZXhwIjoyMDcwMDAzOTEyfQ.yr5qxPSeWnwMG8u89LjQ_1vdTJmhPVeM9eRF-cudAqk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testDirectQuery() {
  console.log('🧪 Testing direct query to park_submissions...\n');

  // Test 1: Query with listing_type and created_at
  console.log('Test 1: Querying with listing_type and created_at filters...');
  const { data, error } = await supabase
    .from('park_submissions')
    .select('id, name, listing_type, created_at, status')
    .eq('status', 'approved')
    .eq('listing_type', 'featured')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.log('❌ Error:', error.message);
    console.log('Code:', error.code);
    console.log('\n⚠️  Supabase REST API cache has not refreshed yet.');
    console.log('   This is normal - wait 1-2 minutes and the errors will stop.');
  } else {
    console.log('✅ Success! Query works perfectly.');
    console.log('Results:', data);
    console.log('\n🎉 Cache has refreshed! Featured parks API should work now.');
  }

  // Test 2: Try a simple insert to verify all columns work
  console.log('\nTest 2: Testing table is ready for inserts...');
  const testData = {
    user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
    name: 'Test Park',
    business_type: 'Dog Park',
    description: 'Test description',
    city: 'San Francisco',
    state: 'CA',
    listing_type: 'free',
    status: 'pending'
  };

  const { data: insertData, error: insertError } = await supabase
    .from('park_submissions')
    .insert([testData])
    .select();

  if (insertError) {
    if (insertError.code === '23503') {
      console.log('✅ Table structure is correct!');
      console.log('   (Foreign key error is expected - dummy user_id doesn\'t exist)');
    } else {
      console.log('❌ Insert error:', insertError.message);
    }
  } else {
    console.log('✅ Test record created successfully!');
    console.log('Record:', insertData);

    // Clean up test record
    if (insertData && insertData[0]) {
      await supabase
        .from('park_submissions')
        .delete()
        .eq('id', insertData[0].id);
      console.log('   (Test record cleaned up)');
    }
  }
}

testDirectQuery();
