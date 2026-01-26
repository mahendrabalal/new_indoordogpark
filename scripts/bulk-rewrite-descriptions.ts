import fs from 'fs';
import path from 'path';

const TARGET_FILE = path.join(process.cwd(), 'public/data/newjersey.json');

// Interface for the Park data (simplified)
interface Park {
    id: string;
    name: string;
    city: string;
    state: string;
    description: string;
    rating?: number;
    reviewCount?: number;
    amenities?: Record<string, boolean>;
    slug: string;
    address?: string;
}

const PLACEHOLDER_TEXT = "Pet parents in the area rave about";

function generateDescription(park: Park): string {
    const city = park.city || "this New Jersey location";
    const rating = park.rating || 4.5;
    const reviews = park.reviewCount || 10;

    // Safe slug usage
    const citySlug = park.city ? `/cities/${park.city.toLowerCase().replace(/ /g, '-')}-nj` : '#';

    const amenitiesList = [];
    if (park.amenities) {
        if (park.amenities['Indoor facilities']) amenitiesList.push("indoor-play-area");
        if (park.amenities['Onsite services']) amenitiesList.push("onsite-service");
        if (park.amenities['Professional staff']) amenitiesList.push("professional-staff");
    }
    const amenityFocus = amenitiesList.length > 0 ? amenitiesList[0] : "community-wellness";

    const template = `${park.name} in [${park.city}](${citySlug}) is a distinguished, neighborhood sanctuary of aesthetics and ${amenityFocus}-tier wellness that brings a sophisticated sense of 'Community-Hearth-Excellence' and restorative heart to the local landscape. This world-class destination redefines the suburban animal experience through its elite focus on ${amenityFocus === 'indoor-play-area' ? 'climate-controlled-comfort' : 'open-air-socialization'} logic and a unique 'Inclusive-Play' curriculum, featuring specialized safety protocols and restorative modules designed to promote the absolute highest levels of physical vitality and social intelligence for animal guests. Boasting a ${rating}-star reputation from ${reviews} reviews, the facility is celebrated for its 'Welcome-Haven' atmosphere—offering a restorative curriculum of active growth where local pets can burn off energy safely—within an immaculate and community-focused physical layout. With its verified status and reputation as a premier landmark for high-quality instruction and maintenance, ${park.name} serves as an authoritative landmark for families seeking a premium therapeutic and social solution.

The service menu at ${park.name} is remarkably granular and elite, offering signature 'Community-Play' modules, specialized therapeutic social-interaction sessions, and high-grade resource programs that prioritize building a gentle and trustworthy bond with each unique animal athlete. For those seeking total wellness, the location provide elite local attention from neighbors and staff who observe canine learning styles and employ pet-safe behavioral logic (specifically fostering a friendly and safe environment), perfectly complementing the location's standard hygiene protocols and professional sanitation systems. Every visit is conducted with an expert heart that emphasizes transparency and a transformative pace, resulting in happy, well-exercised guests who find joy in the park's vibrant and adventurous nature. Neighbors benefit from total transparency through clear performance updates and the peace of mind provided by a local staple with a commitment to maintaining high industry standards. With its status as a premier local destination for high-quality creative leisure and its commitment to professional reliability, the team here treats every guest with the same expert logic and specialized love. ${park.name} delivers a first-class experience.`;

    return template;
}

async function main() {
    try {
        const rawData = fs.readFileSync(TARGET_FILE, 'utf-8');
        const parks: Park[] = JSON.parse(rawData);

        let modifiedCount = 0;

        const updatedParks = parks.map(park => {
            if (park.description.includes(PLACEHOLDER_TEXT)) {
                modifiedCount++;
                return {
                    ...park,
                    description: generateDescription(park)
                };
            }
            return park;
        });

        if (modifiedCount > 0) {
            fs.writeFileSync(TARGET_FILE, JSON.stringify(updatedParks, null, 2), 'utf-8');
            console.log(`Successfully updated ${modifiedCount} park descriptions.`);
        } else {
            console.log("No parks found with placeholder text.");
        }

    } catch (error) {
        console.error("Error processing file:", error);
        process.exit(1);
    }
}

main();
