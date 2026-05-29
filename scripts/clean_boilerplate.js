const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');

const boilerplatePatterns = [
  "delivers a dog park experience",
  "dog-loving rhythm",
  "marries expansive play yards with concierge-level care",
  "is a modern indoor dog park and social club created for dogs",
  "is a favorite spot for dog owners in",
  "offers a welcoming space for pets to exercise and socialize",
  "bring your furry friend to",
  "provides a safe and fun environment for dogs of all sizes",
  "well-equipped with amenities such as",
  "ample space for running and playing",
  "star rating from over",
  "clean environment and friendly atmosphere",
  "convenient location and the opportunity",
  "For more details, you can visit the",
  "Plan your visit today! For rules and hours",
  "Make sure to check the",
  "Amenities at",
  "This facility features onsite services",
  "is a must-visit location that combines convenience with fun",
  "serves as a premier destination for the local canine community",
  "is a dog park in"
];

function isBoilerplate(description) {
  if (!description) return false;
  
  for (const pattern of boilerplatePatterns) {
    if (description.includes(pattern)) {
      return true;
    }
  }
  
  // Also flag if it looks like the LLM spun text
  if (description.includes("Perched in") || description.includes("Located in") || description.includes("Guests rave about its")) {
      return true;
  }
  
  return false;
}

let totalProcessed = 0;
let totalCleaned = 0;

function processFiles() {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'keyword_clusters.json' && f !== 'mixmatch.json');

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    try {
      const rawData = fs.readFileSync(filePath, 'utf8');
      const parks = JSON.parse(rawData);
      let fileCleanedCount = 0;

      parks.forEach(park => {
        totalProcessed++;
        const desc = park.description || "";
        
        if (isBoilerplate(desc)) {
          park.description = ""; // clear it so the frontend can generate a dynamic, factual one
          fileCleanedCount++;
          totalCleaned++;
        }
      });

      if (fileCleanedCount > 0) {
        fs.writeFileSync(filePath, JSON.stringify(parks, null, 2));
        console.log(`Cleaned ${fileCleanedCount} parks in ${file}`);
      } else {
        console.log(`No boilerplate found in ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  });

  console.log(`\nDone! Processed ${totalProcessed} parks, cleaned boilerplate from ${totalCleaned} parks.`);
}

processFiles();
