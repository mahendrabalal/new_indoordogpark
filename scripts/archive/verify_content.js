const fs = require('fs');

const content = fs.readFileSync('/Users/mahendrabalal/Desktop/new_indoordogpark/src/data/priorityCityContent.ts', 'utf8');

// Use a simpler approach: extract everything between 'longDescription: [' and ']'
const blocks = content.split('longDescription: [');
// Skip the first block as it's before any longDescription
const results = [];

for (let i = 1; i < blocks.length; i++) {
    const raw = blocks[i].split(']')[0].trim();
    // Split by single quote followed by newline or comma
    // Actually, each paragraph is a string in the array.
    const paragraphs = raw.match(/'[\s\S]*?'/g) || [];
    const cleanParagraphs = paragraphs.map(p => p.slice(1, -1));

    const totalChars = cleanParagraphs.join('').length;
    results.push({
        index: i,
        totalChars,
        numParagraphs: cleanParagraphs.length,
        valid: totalChars >= 1350 && totalChars <= 1650 && cleanParagraphs.length === 2
    });
}

console.log(JSON.stringify(results, null, 2));
console.log(`Total cities processed: ${results.length}`);
