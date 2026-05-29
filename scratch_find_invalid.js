const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public/data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'keyword_clusters.json');

const invalidCities = new Map();

for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    for (const park of data) {
        if (!park.city) continue;
        const city = park.city.trim();
        // Check for numbers (often addresses or zip codes)
        if (/\d/.test(city)) {
            invalidCities.set(city, park.full_address);
        }
        // Check for LLC or Inc
        else if (/\b(LLC|Inc)\b/i.test(city)) {
            invalidCities.set(city, park.full_address);
        }
    }
}

console.log(`Found ${invalidCities.size} invalid cities with numbers or LLC/Inc:`);
for (const [city, address] of invalidCities) {
    console.log(`City: "${city}" | Full Address: "${address}"`);
}
