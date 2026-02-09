const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/priorityCityContent.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const slugs = [
    'jonesborough-tn',
    'kingsport-tn',
    'lebanon-tn',
    'lenoir-city-tn',
    'lexington-tn',
    'maryville-tn',
    'bluff-city-tn',
    'brentwood-tn',
    'bristol-tn',
    'collierville-tn',
    'columbia-tn',
    'cordova-tn',
    'east-ridge-tn'
];

slugs.forEach(slug => {
    const slugIndex = content.indexOf(`slug: '${slug}'`);
    if (slugIndex === -1) {
        console.error(`ERROR: Could not find slug: ${slug}`);
        return;
    }

    const descLabelIndex = content.indexOf('longDescription:', slugIndex);
    if (descLabelIndex === -1) {
        console.error(`  ERROR: Could not find longDescription for ${slug}`);
        return;
    }

    const openBracketIndex = content.indexOf('[', descLabelIndex);

    if (openBracketIndex !== -1) {
        // Find the closing bracket, but be careful of nested brackets (unlikely here)
        // Actually, finding the closing bracket is hard with simple indexOf if strings contain ']'.
        // Let's take a chunk of text after openBracketIndex
        const chunk = content.substring(openBracketIndex, openBracketIndex + 3000);

        // Use regex to find single-quoted strings inside the array
        // The array starts with [ and ends with ]. 
        // We can assume the array ends before the next 'faqs:' or next object start.
        const endOfArrayMatch = chunk.match(/\]\s*,\s*faqs:/);
        if (!endOfArrayMatch) {
            console.error(`  ERROR: Could not find end of longDescription array for ${slug}`);
            return;
        }

        const arrayContent = chunk.substring(1, endOfArrayMatch.index);

        // Now extract strings.
        // Handles 'string' and escapes \'
        const regex = /'((?:[^'\\]|\\.)*)'/g;
        let match;
        let extractedText = '';
        let countData = [];

        while ((match = regex.exec(arrayContent)) !== null) {
            if (extractedText.length > 0) {
                extractedText += '\n\n';
            }
            extractedText += match[1];
            countData.push(match[1].length);
        }

        // Unescape for accurate count
        const finalCleaned = extractedText.replace(/\\'/g, "'");
        const finalCount = finalCleaned.length;

        console.log(`${slug}: ${finalCount} chars`);
        if (finalCount < 1000 || finalCount > 1200) {
            console.warn(`  WARNING: ${slug} length (${finalCount}) is out of bounds!`);
        }

    } else {
        console.error(`  ERROR: Could not parse description for ${slug}`);
    }
});
