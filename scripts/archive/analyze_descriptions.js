const fs = require('fs');

const filePath = 'public/data/missouri.json';
const rawData = fs.readFileSync(filePath);
const parks = JSON.parse(rawData);

let totalParks = parks.length;
let emptyDescriptions = 0;
let shortDescriptions = 0;
let templateDescriptions = 0;
let goodDescriptions = 0;

const issues = [];

parks.forEach(park => {
    const desc = park.description || "";
    const name = park.name || "Unknown";

    if (!desc.trim()) {
        emptyDescriptions++;
        issues.push({ name, issue: "Empty description" });
        return;
    }

    if (desc.length < 100) {
        shortDescriptions++;
        issues.push({ name, length: desc.length, issue: "Very short description" });
    }

    // Check for repetitive/template patterns
    if (desc.includes("Amenities at") && desc.includes("include onsite services, indoor facilities, professional staff")) {
        templateDescriptions++;
        // heavily penalized if it looks exactly like the generic filler
        if (desc.includes("catering to the diverse needs of visitors. It is a vibrant hub of activity, drawing in hundreds of positive reviews")) {
            issues.push({ name, issue: "Generic template description" });
        }
    } else {
        goodDescriptions++;
    }
});

console.log("Total Parks:", totalParks);
console.log("Empty Descriptions:", emptyDescriptions);
console.log("Short Descriptions (<100 chars):", shortDescriptions);
console.log("Potential Template Descriptions:", templateDescriptions);
console.log("Likely Custom/Good Descriptions:", goodDescriptions);

console.log("\n--- Issues List (First 20) ---");
console.log(issues.slice(0, 20));

if (issues.length > 20) {
    console.log(`... and ${issues.length - 20} more issues.`);
}
