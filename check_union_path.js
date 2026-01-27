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

function normalizeState(state) {
    if (!state) return '';
    const s = state.trim();
    if (s.length === 2) return s.toUpperCase();
    const maps = {
        'new jersey': 'NJ',
    };
    return maps[s.toLowerCase()] || s;
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
    const allFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'keyword_clusters.json');

    let allParks = [];
    for (const file of allFiles) {
        allParks.push(...JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8')));
    }

    const baseSlugCounts = new Map();
    const grouped = new Map();

    allParks.forEach(p => {
        if (!p.city || !p.state) return;
        const cityKey = p.city.toLowerCase().trim();
        const stateKey = normalizeStateKey(p.state);
        const key = `${cityKey}|${stateKey}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(p);
    });

    const cityGroups = Array.from(grouped.values());
    cityGroups.forEach(g => {
        const base = cityNameToSlug(g[0].city);
        baseSlugCounts.set(base, (baseSlugCounts.get(base) || 0) + 1);
    });

    const targetCity = 'Union City';
    const targetState = 'NJ';
    const cityKey = `${targetCity.toLowerCase().trim()}|${normalizeStateKey(targetState)}`;
    const cityParks = grouped.get(cityKey);

    if (!cityParks) {
        console.log("NOT FOUND");
        return;
    }

    const baseSlug = cityNameToSlug(targetCity);
    const needsState = (baseSlugCounts.get(baseSlug) || 0) > 1;
    const citySlug = needsState ? `${baseSlug}-nj` : baseSlug;
    const featuredImage = `/images/cities/${citySlug}/hero.webp`;

    console.log(`City: ${targetCity}`);
    console.log(`Slug: ${citySlug}`);
    console.log(`Path: ${featuredImage}`);
    console.log(`Needs State: ${needsState}`);
}

run();
