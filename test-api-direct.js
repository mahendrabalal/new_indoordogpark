/**
 * Test the search API directly to see what's happening
 */

async function testSearchAPI() {
  try {
    console.log('🔍 Testing search API directly...\n');

    // Test 1: Search for "barking"
    console.log('1. Testing search: "barking"');
    const response1 = await fetch('http://localhost:3000/api/parks/search?q=barking');
    const data1 = await response1.json();
    console.log(`   Results: ${data1.data?.length || 0}`);
    console.log(`   Total parks in system: ${data1.meta?.totalParks || 0}`);
    if (data1.data && data1.data.length > 0) {
      console.log(`   First result: ${data1.data[0].name}`);
      console.log(`   Source: ${data1.data[0].source}`);
    }

    // Test 2: Search for "barking hound"
    console.log('\n2. Testing search: "barking hound"');
    const response2 = await fetch('http://localhost:3000/api/parks/search?q=barking%20hound');
    const data2 = await response2.json();
    console.log(`   Results: ${data2.data?.length || 0}`);
    if (data2.data && data2.data.length > 0) {
      console.log(`   First result: ${data2.data[0].name}`);
      console.log(`   Source: ${data2.data[0].source}`);
    } else {
      console.log('   ❌ No results found');
      console.log(`   Filters applied: ${JSON.stringify(data2.filters)}`);
    }

    // Test 3: Get all approved submissions
    console.log('\n3. Testing approved submissions endpoint');
    const response3 = await fetch('http://localhost:3000/api/parks/submissions');
    const data3 = await response3.json();
    console.log(`   Approved submissions: ${data3.length || 0}`);
    if (data3.length > 0) {
      const barkingPark = data3.find(p => p.name.toLowerCase().includes('barking'));
      if (barkingPark) {
        console.log(`   Found: ${barkingPark.name}`);
        console.log(`   City: ${barkingPark.city}, State: ${barkingPark.state}`);
      } else {
        console.log('   ❌ Barking Hound not in approved submissions');
      }
    }

    // Test 4: Check if there's a duplicate in static parks
    console.log('\n4. Checking for duplicates...');
    const response4 = await fetch('http://localhost:3000/api/parks?limit=1000');
    const data4 = await response4.json();
    const allParks = data4.data || [];
    const barkingParks = allParks.filter(p => 
      p.name.toLowerCase().includes('barking') || 
      p.name.toLowerCase().includes('hound')
    );
    console.log(`   Total parks loaded: ${allParks.length}`);
    console.log(`   Parks with "barking" or "hound": ${barkingParks.length}`);
    barkingParks.forEach(p => {
      console.log(`     - ${p.name} (${p.city}, ${p.state}) [${p.source}]`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  Make sure the Next.js dev server is running!');
      console.error('   Run: npm run dev');
    }
  }
}

testSearchAPI()
  .then(() => {
    console.log('\n✨ Test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });


