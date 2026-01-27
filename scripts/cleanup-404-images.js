const fs = require('fs');
const path = require('path');

const filesToClean = [
    'public/data/ohio.json',
    'public/data/missouri.json'
];

const brokenPatterns = [
    '/images/parks/ohio/',
    '/images/cities/akron/hero.webp',
    '/images/cities/st-louis/hero.webp',
    '/images/cities/kansas-city/hero.webp',
    '/images/cities/columbia-mo/hero.webp',
    '/images/cities/st-joseph/hero.webp',
    '/images/cities/liberty/hero.webp',
    '/images/cities/mo-64052/hero.webp',
    '/images/cities/cottleville/hero.webp',
    '/images/cities/blue-springs/hero.webp',
    '/images/cities/ellisville/hero.webp',
    '/images/cities/wentzville/hero.webp',
    '/images/cities/creve-coeur/hero.webp',
    '/images/cities/springfield-mo/hero.webp'
];

function sanitizeObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                const isBroken = brokenPatterns.some(pattern => obj[key].startsWith(pattern));
                if (isBroken) {
                    console.log(`  Cleaning broken path: ${obj[key]}`);
                    newObj[key] = null;
                } else {
                    newObj[key] = obj[key];
                }
            } else {
                newObj[key] = sanitizeObject(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
}

filesToClean.forEach(file => {
    const filePath = path.resolve(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    console.log(`Processing ${file}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const sanitizedData = sanitizeObject(data);
    fs.writeFileSync(filePath, JSON.stringify(sanitizedData, null, 2));
    console.log(`Finished ${file}.`);
});
