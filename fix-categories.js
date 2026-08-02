const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalUpdated = 0;
const counts = {
  'Dog Training': 0,
  'Dog Daycare': 0,
  'Dog Grooming': 0,
  'Veterinary Clinic': 0,
  'Pet Store': 0,
  'Dog Bar': 0
};

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!Array.isArray(data)) {
    console.log(`Skipping ${file}, not an array.`);
    continue;
  }
  
  let updatedInFile = 0;

  for (const park of data) {
    if (park.businessType === 'Dog Park' || !park.businessType) {
      const name = (park.name || '').toLowerCase();
      const desc = (park.description || '').toLowerCase();
      const combined = name + ' ' + desc;

      if (name.includes('training') || name.includes('academy') || name.includes('k9') || name.includes('k-9')) {
        park.businessType = 'Dog Training';
      } else if (name.includes('daycare') || name.includes('day care') || name.includes('boarding') || name.includes('kennel') || name.includes('resort') || name.includes('hotel') || name.includes('camp')) {
        park.businessType = 'Dog Daycare';
      } else if (name.includes('grooming') || name.includes('groomer') || name.includes('wash') || name.includes('spa')) {
        park.businessType = 'Dog Grooming';
      } else if (name.includes('vet ') || name.includes('veterinary') || name.includes('hospital') || name.includes('clinic')) {
        park.businessType = 'Veterinary Clinic';
      } else if (name.includes('petco') || name.includes('petsmart') || name.includes('pet supplies') || name.includes('pet store') || name.includes('supply') || name.includes('feed')) {
        park.businessType = 'Pet Store';
      } else if (name.includes(' bar') || name.includes('pub ') || name.includes('brewery')) {
        park.businessType = 'Dog Bar';
      }

      if (park.businessType !== 'Dog Park' && park.businessType !== null) {
        if (counts[park.businessType] !== undefined) {
          counts[park.businessType]++;
          updatedInFile++;
          totalUpdated++;
        }
      }
    }
  }

  if (updatedInFile > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${updatedInFile} entries in ${file}`);
  }
}

console.log(`\nFinished updating data.`);
console.log(`Total entries re-categorized: ${totalUpdated}`);
console.log('New Category Breakdown:');
console.table(counts);
