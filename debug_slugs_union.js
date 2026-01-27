const fs = require('fs');
const path = require('path');

function normalizeStateKey(state) {
    if (!state) return '';
    const s = state.toLowerCase().trim();
    const maps = {
        'new jersey': 'nj',
        'pennsylvania': 'pa',
        'ohio': 'oh',
        'california': 'ca',
        'virginia': 'va',
        'tennessee': 'tn'
    };
    return maps[s] || s;
}

function cityNameToSlug(cityName) {
    return cityName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function debugSlugs() {
    const dataDir = path.join(__dirname, 'public/data');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

    let allParks = [];
    for (const file of files) {
        if (file === 'keyword_clusters.json') continue;
        try {
            const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
            if (Array.isArray(content)) {
                allParks.push(...content);
            }
        } catch (e) { }
    }

    const baseSlugCounts = new Map();
    const cityStatePairs = new Set();

    allParks.forEach(park => {
        const cityName = park.city;
        if (!cityName) return;
        const stateKey = normalizeStateKey(park.state);
        const baseSlug = cityNameToSlug(cityName);

        const pair = `${baseSlug}|${stateKey}`;
        if (!cityStatePairs.has(pair)) {
            cityStatePairs.add(pair);
            baseSlugCounts.set(baseSlug, (baseSlugCounts.get(baseSlug) || 0) + 1);
        }
    });

    const target = 'Union City';
    const baseSlug = cityNameToSlug(target);
    const count = baseSlugCounts.get(baseSlug);
    console.log(`BaseSlug: ${baseSlug}, Count: ${count}`);

    // Let's also check "Union" to see if it's related
    const unionBaseSlug = cityNameToSlug('Union');
    console.log(`Union BaseSlug: ${unionBaseSlug}, Count: ${baseSlugCounts.get(unionBaseSlug)}`);

    // Let's find all cities starting with "Union"
    cityStatePairs.forEach(pair => {
        if (pair.startsWith('union')) {
            console.log(`Matching pair: ${pair}`);
        }
    });
}

debugSlugs();
