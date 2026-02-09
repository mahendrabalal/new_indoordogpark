
const { SITE_URL } = require('./src/lib/metadata');
console.log('Current SITE_URL:', SITE_URL);

if (SITE_URL === 'https://www.indoordogpark.org') {
    console.log('SUCCESS: SITE_URL is correctly set to https://www.indoordogpark.org');
} else {
    console.error(`FAILURE: SITE_URL is ${SITE_URL}, expected https://www.indoordogpark.org`);
    process.exit(1);
}
