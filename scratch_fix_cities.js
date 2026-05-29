const fs = require('fs');
const path = require('path');

function cityNameToSlug(cityName) {
    return cityName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const dataDir = path.join(__dirname, 'public/data');
const njFile = path.join(dataDir, 'newjersey.json');
const data = JSON.parse(fs.readFileSync(njFile, 'utf8'));

let fixCount = 0;

for (const park of data) {
    if (!park.description) continue;
    
    // We will look for markdown links
    const regex = /\[([^\]]+)\]\(\/cities\/([^\)]+)\)/g;
    let modified = false;
    
    park.description = park.description.replace(regex, (match, text, slug) => {
        // If the slug contains numbers or 'llc'
        if (/\d/.test(slug) || /llc/i.test(slug)) {
            // Get the actual city from the park object
            if (park.city) {
                const actualCity = park.city.trim();
                const actualSlug = `${cityNameToSlug(actualCity)}-nj`; 
                // We'll replace the text with the actual city name
                // Example: [105 California Ave](/cities/105-california-ave-nj) -> [CityName](/cities/cityname-nj)
                modified = true;
                return `[${actualCity}](/cities/${actualSlug})`;
            }
        }
        return match;
    });
    
    if (modified) {
        fixCount++;
    }
}

fs.writeFileSync(njFile, JSON.stringify(data, null, 4), 'utf8');
console.log(`Successfully fixed ${fixCount} descriptions in newjersey.json`);
