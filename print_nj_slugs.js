const fs = require('fs');
const path = require('path');

function normalizeStateKey(state) {
    if (!state) return '';
    const s = state.toLowerCase().trim();
    const maps = {
        'new jersey': 'nj',
    };
    return maps[s] || s;
}

function stateToSlugPart(state) {
    return normalizeStateKey(state);
}

function cityNameToSlug(cityName) {
    return cityName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function run() {
    const dataDir = path.join(__dirname, 'public/data');
    const njData = JSON.parse(fs.readFileSync(path.join(dataDir, 'newjersey.json'), 'utf-8'));
    const allFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'keyword_clusters.json');

    let allParks = [];
    for (const file of allFiles) {
        allParks.push(...JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8')));
    }

    const baseSlugCounts = new Map();
    const seenPairs = new Set();

    allParks.forEach(p => {
        if (!p.city || !p.state) return;
        const base = cityNameToSlug(p.city);
        const state = normalizeStateKey(p.state);
        const pair = `${base}|${state}`;
        if (!seenPairs.has(pair)) {
            seenPairs.add(pair);
            baseSlugCounts.set(base, (baseSlugCounts.get(base) || 0) + 1);
        }
    });

    const njCities = new Set();
    njData.forEach(p => njCities.add(p.city));

    console.log('| City | Slug | Needs State |');
    console.log('| --- | --- | --- |');
    Array.from(njCities).sort().forEach(city => {
        const base = cityNameToSlug(city);
        const needsState = (baseSlugCounts.get(base) || 0) > 1;
        const slug = needsState ? `${base}-nj` : base;
        console.log(`| ${city} | ${slug} | ${needsState} |`);
    });
}

run();
