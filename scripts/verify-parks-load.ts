
import { getAllStaticParks } from '@/lib/parks-data';

async function main() {
    console.log('Loading parks...');
    const parks = await getAllStaticParks();

    const moParks = parks.filter(p => p.state === 'MO');
    const njParks = parks.filter(p => p.state === 'NJ');

    console.log(`Total Parks Loaded: ${parks.length}`);
    console.log(`MO Parks: ${moParks.length}`);
    console.log(`NJ Parks: ${njParks.length}`);

    if (moParks.length > 0 && njParks.length > 0) {
        console.log('SUCCESS: Missouri and New Jersey parks loaded successfully.');

        // Sample check
        console.log('\nSample MO Park:', JSON.stringify(moParks[0], null, 2));
        console.log('\nSample NJ Park:', JSON.stringify(njParks[0], null, 2));
    } else {
        console.error('FAILURE: Could not load parks for one or both states.');
        process.exit(1);
    }
}

main().catch(console.error);
