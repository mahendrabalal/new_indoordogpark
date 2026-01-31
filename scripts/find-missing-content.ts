
import { priorityCityContent } from '../src/data/priorityCityContent.ts';

const missingContent = priorityCityContent.filter(city => {
    return !city.customContent?.longDescription || city.customContent.longDescription.length === 0;
});

console.log(`Found ${missingContent.length} cities missing longDescription.`);
missingContent.forEach(city => {
    console.log(`${city.city}, ${city.state} (${city.slug})`);
});
