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

    const njCities = new Set();
    allParks.forEach(p => {
        if (p.city && normalizeStateKey(p.state) === 'nj') {
            njCities.add(p.city);
        }
    });

    console.log('City | Slug');
    console.log('--- | ---');

    const targetCities = Array.from(njCities).sort();
    targetCities.forEach(cityName => {
        const baseSlug = cityNameToSlug(cityName);
        const needsState = (baseSlugCounts.get(baseSlug) || 0) > 1;
        const slug = needsState ? `${baseSlug}-nj` : baseSlug;
        console.log(`${cityName} | ${slug}`);
    });

    // Explicitly check Philadelphia since it's relevant
    const phillyBaseSlug = cityNameToSlug('Philadelphia');
    const phillyNeedsState = (baseSlugCounts.get(phillyBaseSlug) || 0) > 1;
    const phillySlug = phillyNeedsState ? `${phillyBaseSlug}-pa` : phillyBaseSlug;
    // Wait, I saw Philadelphia in newjersey.json with state NJ earlier. 
    // Let's see what the script says for Philadelphia if it was in njCities.
    if (!njCities.has('Philadelphia')) {
        console.log(`Philadelphia | ${phillySlug}`);
    }
}

debugSlugs();
