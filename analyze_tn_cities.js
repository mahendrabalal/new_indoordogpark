const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'public/data/tennessee.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const parks = JSON.parse(rawData);

const cityCounts = {};
parks.forEach(park => {
    const key = `${park.city}`;
    cityCounts[key] = (cityCounts[key] || 0) + 1;
});

const sortedCities = Object.keys(cityCounts).sort().map(city => ({
    city,
    count: cityCounts[city]
}));

console.log(JSON.stringify(sortedCities, null, 2));
