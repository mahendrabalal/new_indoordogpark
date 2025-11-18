/**
 * Debug script to test why the park isn't appearing in search
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugSearch() {
  try {
    console.log('🔍 Debugging search for "Barking Hound Village Inn"\n');

    // 1. Check database directly
    console.log('1. Checking database...');
    const { data: dbParks, error: dbError } = await supabase
      .from('park_submissions')
      .select('*')
      .eq('status', 'approved')
      .ilike('name', '%barking%');

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return;
    }

    console.log(`   Found ${dbParks?.length || 0} approved park(s) in database`);
    if (dbParks && dbParks.length > 0) {
      const park = dbParks[0];
      console.log(`   Park: ${park.name}`);
      console.log(`   City: ${park.city}, State: ${park.state}`);
      console.log(`   Description length: ${park.description?.length || 0}`);
      console.log(`   Business type: ${park.business_type}`);
    }

    // 2. Check static parks file
    console.log('\n2. Checking static parks file...');
    const staticFilePath = path.join(process.cwd(), 'public/data/california.json');
    let staticParks = [];
    try {
      const staticContent = await fs.readFile(staticFilePath, 'utf-8');
      staticParks = JSON.parse(staticContent);
      console.log(`   Found ${staticParks.length} static parks`);
    } catch (err) {
      console.log(`   ⚠️  Could not read static parks file: ${err.message}`);
    }

    // 3. Simulate the search transformation
    console.log('\n3. Simulating search transformation...');
    if (dbParks && dbParks.length > 0) {
      const park = dbParks[0];
      
      // Normalize photos
      const normalizePhotos = (photos) => {
        if (!Array.isArray(photos)) return [];
        return photos
          .map((photo) => {
            if (!photo) return null;
            if (typeof photo === 'string') {
              return { url: photo.trim(), type: 'photo' };
            }
            if (typeof photo === 'object') {
              const url = photo.url || photo.publicUrl;
              if (!url) return null;
              return {
                type: photo.type || 'photo',
                url,
                caption: photo.caption,
                source: photo.source,
              };
            }
            return null;
          })
          .filter(Boolean);
      };

      const transformedPark = {
        id: park.id,
        name: park.name,
        slug: park.slug || park.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        businessType: park.business_type,
        rating: 0,
        reviewCount: 0,
        address: park.address,
        street: park.street,
        city: park.city,
        state: park.state,
        zipCode: park.zip_code,
        full_address: park.full_address || `${park.address || ''} ${park.city || ''} ${park.state || ''} ${park.zip_code || ''}`.trim(),
        latitude: park.latitude,
        longitude: park.longitude,
        phone: park.phone,
        email: park.email,
        website: park.website,
        description: park.description,
        photos: normalizePhotos(park.photos),
        photo: normalizePhotos(park.photos)[0]?.url,
        openingHours: park.opening_hours,
        amenities: park.amenities || {},
        userRatingsTotal: 0,
        source: 'user_submitted',
        listingType: park.listing_type || 'free',
      };

      console.log(`   Transformed park name: "${transformedPark.name}"`);
      console.log(`   Transformed park city: "${transformedPark.city}"`);
      console.log(`   Transformed park state: "${transformedPark.state}"`);
      console.log(`   Transformed park description: "${transformedPark.description?.substring(0, 100)}..."`);

      // 4. Test search matching
      console.log('\n4. Testing search matching...');
      const searchTerm = 'barking hound';
      const searchLower = searchTerm.toLowerCase();
      
      const matches = {
        name: transformedPark.name.toLowerCase().includes(searchLower),
        city: transformedPark.city?.toLowerCase().includes(searchLower),
        address: transformedPark.address?.toLowerCase().includes(searchLower),
        full_address: transformedPark.full_address?.toLowerCase().includes(searchLower),
        description: transformedPark.description?.toLowerCase().includes(searchLower),
        businessType: transformedPark.businessType?.toLowerCase().includes(searchLower),
        state: transformedPark.state?.toLowerCase().includes(searchLower),
        zipCode: transformedPark.zipCode?.toLowerCase().includes(searchLower),
      };

      console.log('   Match results:');
      Object.entries(matches).forEach(([field, matches]) => {
        console.log(`     ${field}: ${matches ? '✅' : '❌'}`);
      });

      const anyMatch = Object.values(matches).some(Boolean);
      console.log(`\n   Overall match: ${anyMatch ? '✅ YES' : '❌ NO'}`);

      if (!anyMatch) {
        console.log('\n   ⚠️  PROBLEM FOUND: The search term does not match any field!');
        console.log(`   Search term: "${searchTerm}"`);
        console.log(`   Park name: "${transformedPark.name}"`);
        console.log(`   Name includes "barking": ${transformedPark.name.toLowerCase().includes('barking')}`);
        console.log(`   Name includes "hound": ${transformedPark.name.toLowerCase().includes('hound')}`);
        console.log(`   Name includes "barking hound": ${transformedPark.name.toLowerCase().includes('barking hound')}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugSearch()
  .then(() => {
    console.log('\n✨ Debug complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

