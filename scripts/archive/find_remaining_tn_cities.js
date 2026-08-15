const fs = require('fs');
const path = require('path');

// 1. Get existing slugs from priorityCityContent.ts
const tsPath = path.join(__dirname, 'src/data/priorityCityContent.ts');
const tsContent = fs.readFileSync(tsPath, 'utf-8');
const existingSlugs = [];
const regex = /slug: '([a-z0-9-]+)'/g;
let match;
while ((match = regex.exec(tsContent)) !== null) {
    existingSlugs.push(match[1]);
}

// 2. Get cities from tennessee.json
const jsonPath = path.join(__dirname, 'public/data/tennessee.json');
const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const uniqueCities = new Set();

jsonContent.forEach(place => {
    if (place.city && place.state === 'TN') {
        uniqueCities.add(place.city);
    }
});

// 3. Compare
const remaining = [];
const slugify = (city) => {
    return city.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-tn';
};

console.log('--- Existing Slugs ---');
console.log(existingSlugs.length);

console.log('\n--- Cities in JSON ---');
console.log(uniqueCities.size);

console.log('\n--- Remaining Cities ---');
const sortedCities = Array.from(uniqueCities).sort();
sortedCities.forEach(city => {
    const slug = slugify(city);
    // Check if slug exists in existingSlugs
    // Note: existingSlugs might have -tn appended or not?
    // In `priorityCityContent.ts`, they seem to be `city-state`.
    if (!existingSlugs.includes(slug)) {
        remaining.push(city);
        console.log(`- [ ] ${city} (${slug})`);
    }
});

console.log(`\nTotal remaining: ${remaining.length}`);
