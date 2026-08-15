const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/priorityCityContent.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const targetSlugs = [
    'arlington-tn', 'alcoa-tn', 'mt-juliet-tn', 'morristown-tn', 'farragut-tn',
    'gallatin-tn', 'germantown-tn', 'goodlettsville-tn', 'hixson-tn', 'humboldt-tn'
];

targetSlugs.forEach(slug => {
    const slugRegex = new RegExp(`slug:\\s*'${slug}'`, 'g');
    const slugMatch = slugRegex.exec(content);
    if (!slugMatch) {
        console.error(`  ERROR: Could not find slug ${slug}`);
        return;
    }

    const startIndex = content.indexOf('longDescription: [', slugMatch.index);
    const endIndex = content.indexOf('],', startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
        const rawArray = content.substring(startIndex + 18, endIndex).trim();
        // Rough way to get text: remove quotes, commas, and newlines that are just for the array structure
        // We want the content inside the strings.
        // Let's use a more precise regex to find the strings.
        const stringMatches = rawArray.match(/'([^'\\]*(?:\\.[^'\\]*)*)'/g);
        if (stringMatches) {
            const fullText = stringMatches.map(s => s.slice(1, -1).replace(/\\'/g, "'")).join('\n\n');
            console.log(`${slug}: ${fullText.length} chars`);
            if (fullText.length < 1000 || fullText.length > 1200) {
                console.warn(`  WARNING: ${slug} length (${fullText.length}) is out of bounds!`);
            }
        } else {
            console.error(`  ERROR: No strings found in longDescription for ${slug}`);
        }
    } else {
        console.error(`  ERROR: Could not find longDescription for ${slug}`);
    }
});
