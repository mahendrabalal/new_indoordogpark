const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data', 'pennsylvania.json');
if (fs.existsSync(filePath)) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const parkIndex = data.findIndex(p => p.name === "Stay and Play Indoor Dog Park, LLC");
  
  if (parkIndex !== -1) {
    console.log(data[parkIndex].description);
  } else {
    console.log("Park not found.");
  }
}
