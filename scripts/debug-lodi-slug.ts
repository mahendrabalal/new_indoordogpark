import { getAllStaticParks, getCityContentBySlug } from './src/lib/parks-data';

async function main() {
    const parks = await getAllStaticParks();
    const lodiParks = parks.filter(p => p.city === 'Lodi');
    console.log('Lodi Parks count:', lodiParks.length);

    const content = await getCityContentBySlug('lodi');
    console.log('Content for slug "lodi":', content?.city?.slug);

    const contentCa = await getCityContentBySlug('lodi-ca');
    console.log('Content for slug "lodi-ca":', contentCa?.city?.slug);
}

main();
