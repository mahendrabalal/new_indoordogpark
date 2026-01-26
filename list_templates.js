const fs = require('fs');

const filePath = 'public/data/missouri.json';
const rawData = fs.readFileSync(filePath);
const parks = JSON.parse(rawData);

const templateParks = [];

parks.forEach(park => {
    const desc = park.description || "";
    // Check for repetitive/template patterns
    if (desc.includes("Amenities at") && desc.includes("include onsite services, indoor facilities, professional staff")) {
        if (desc.includes("catering to the diverse needs of visitors. It is a vibrant hub of activity, drawing in hundreds of positive reviews")) {
            templateParks.push(park.name);
        }
    }
});

console.log("Parks with Generic Template Descriptions:");
templateParks.forEach(name => console.log(`- ${name}`));
