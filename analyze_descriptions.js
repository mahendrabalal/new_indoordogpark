
const fs = require('fs');

const content = fs.readFileSync('/Users/mahendrabalal/Desktop/new_indoordogpark/src/data/priorityCityContent.ts', 'utf8');

// I'll use a regex to extract the priorityCityContent array.
// It's exported as a constant.
// Actually, it might be easier to just regex for longDescription patterns.

const cityMatches = content.matchAll(/slug:\s*'([^']+)',[\s\S]*?longDescription:\s*\[([\s\S]*?)\]/g);

for (const match of cityMatches) {
    const citySlug = match[1];
    const longDescContent = match[2];

    // Extract paragraphs (strings in the array)
    const paragraphMatches = longDescContent.match(/'([^']*)'|"([^"]*)"/g);

    if (!paragraphMatches) {
        console.log(`City: ${citySlug} - No paragraphs found or empty.`);
        continue;
    }

    const paragraphs = paragraphMatches.map(p => p.slice(1, -1));
    const totalChars = paragraphs.join('\n\n').length;

    console.log(`City: ${citySlug}`);
    console.log(`  Paragraphs: ${paragraphs.length}`);
    console.log(`  Total Chars: ${totalChars}`);
    paragraphs.forEach((p, i) => {
        console.log(`    P${i + 1}: ${p.length} chars`);
    });
}
