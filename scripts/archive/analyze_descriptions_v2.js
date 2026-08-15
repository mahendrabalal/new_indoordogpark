const fs = require('fs');

const filePath = 'public/data/missouri.json';
const rawData = fs.readFileSync(filePath);
const parks = JSON.parse(rawData);

let totalParks = parks.length;
const templateCounts = {
    "Type A (Amenities at...)": 0,
    "Type B (This facility features...)": 0,
    "Type C (Must-visit location...)": 0,
    "Type D (Premier destination...)": 0
};
const templateParks = new Set();

parks.forEach(park => {
    const desc = park.description || "";
    let isTemplate = false;

    if (desc.includes("Amenities at") && desc.includes("include onsite services")) {
        templateCounts["Type A (Amenities at...)"]++;
        isTemplate = true;
    }
    if (desc.includes("This facility features onsite services")) {
        templateCounts["Type B (This facility features...)"]++;
        isTemplate = true;
    }
    if (desc.includes("is a must-visit location that combines convenience with fun")) {
        templateCounts["Type C (Must-visit location...)"]++;
        isTemplate = true;
    }
    if (desc.includes("serves as a premier destination for the local canine community")) {
        templateCounts["Type D (Premier destination...)"]++;
        isTemplate = true;
    }

    if (isTemplate) {
        templateParks.add(park.name);
    }
});

console.log("Total Parks:", totalParks);
console.log("Template Type Counts (some might overlap):", templateCounts);
console.log("Total Unique Generic Descriptions Found:", templateParks.size);

console.log("\n--- List of Generic Parks ---");
templateParks.forEach(name => console.log(`- ${name}`));
