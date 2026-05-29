const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public/data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'keyword_clusters.json');

const links = new Set();
const badLinks = [];

for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    for (const park of data) {
        if (!park.description) continue;
        const matches = park.description.match(/\[([^\]]+)\]\(\/cities\/([^\)]+)\)/g);
        if (matches) {
            for (const match of matches) {
                const m = match.match(/\[([^\]]+)\]\(\/cities\/([^\)]+)\)/);
                if (m) {
                    const text = m[1];
                    const slug = m[2];
                    links.add(slug);
                    if (/\d/.test(slug) || /llc/i.test(slug)) {
                        badLinks.push({ slug, text, park: park.name, file });
                    }
                }
            }
        }
    }
}

console.log(`Found ${links.size} unique city slugs in descriptions.`);
console.log(`Found ${badLinks.length} potentially bad links containing numbers or LLC:`);
for (const link of badLinks) {
    console.log(`Slug: ${link.slug} | Text: ${link.text} | Park: ${link.park} | File: ${link.file}`);
}
