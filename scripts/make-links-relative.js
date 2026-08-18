const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'blog-content', 'top-8-best-indoor-dog-parks-in-santa-ana-ca.md');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of https://www.indoordogpark.org/ with /
content = content.replace(/https:\/\/www\.indoordogpark\.org\//g, '/');

// Also replace https://www.indoordogpark.org" with /"
content = content.replace(/https:\/\/www\.indoordogpark\.org"/g, '/"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated all internal links to relative URLs in markdown file!');
