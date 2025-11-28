#!/usr/bin/env node

/**
 * Create a test JSON file with sample parks that have email addresses
 * Useful for testing the email outreach system
 */

const fs = require('fs');
const path = require('path');

const testParks = [
  {
    id: 'test-1',
    name: 'Happy Paws Indoor Dog Park',
    businessType: 'Indoor Dog Park',
    email: 'info@happypaws.com',
    city: 'Los Angeles',
    state: 'California',
    website: 'https://happypaws.com',
    description: 'A great indoor dog park for testing',
    slug: 'happy-paws-indoor-dog-park',
    address: '123 Main St',
    street: '123 Main St',
    zipCode: '90001',
    full_address: '123 Main St, Los Angeles, CA 90001',
    rating: 4.5,
    reviewCount: 50
  },
  {
    id: 'test-2',
    name: 'Doggy Daycare Center',
    businessType: 'Indoor Dog Park',
    email: 'contact@doggydaycare.com',
    city: 'San Francisco',
    state: 'California',
    website: 'https://doggydaycare.com',
    description: 'Premium indoor dog park facility',
    slug: 'doggy-daycare-center',
    address: '456 Market St',
    street: '456 Market St',
    zipCode: '94102',
    full_address: '456 Market St, San Francisco, CA 94102',
    rating: 4.8,
    reviewCount: 120
  },
  {
    id: 'test-3',
    name: 'Paws & Play Indoor Park',
    businessType: 'Indoor Dog Park',
    email: 'hello@pawsandplay.com',
    city: 'San Diego',
    state: 'California',
    website: 'https://pawsandplay.com',
    description: 'Fun indoor space for dogs',
    slug: 'paws-play-indoor-park',
    address: '789 Ocean Blvd',
    street: '789 Ocean Blvd',
    zipCode: '92101',
    full_address: '789 Ocean Blvd, San Diego, CA 92101',
    rating: 4.7,
    reviewCount: 85
  }
];

const outputPath = path.join(__dirname, '..', 'public', 'data', 'test-parks.json');

fs.writeFileSync(outputPath, JSON.stringify(testParks, null, 2));

console.log('✅ Created test parks file with email addresses');
console.log(`📁 Location: ${outputPath}`);
console.log(`📊 Parks: ${testParks.length}`);
console.log('\nTo test email outreach:');
console.log(`  npm run outreach:send -- --file public/data/test-parks.json --limit 3`);

