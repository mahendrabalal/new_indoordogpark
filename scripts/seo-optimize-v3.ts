import fs from 'fs';
import path from 'path';

const TARGET_FILE = path.join(process.cwd(), 'public/data/newjersey.json');

// Interface for the Park data
interface Park {
    id: string;
    name: string;
    description: string;
    website?: string;
}

// Signatures of the V2 Multi-Persona Scripts
const PERSONA_SIGNATURES = [
    "wag-worthy social hub",       // Socialite
    "scenic landscape",           // Naturalist
    "pup's fitness",              // Trainer
    "steadfast anchor"            // Historian
];

function hasPersonaSignature(description: string): boolean {
    return PERSONA_SIGNATURES.some(sig => description.includes(sig));
}

async function main() {
    try {
        const rawData = fs.readFileSync(TARGET_FILE, 'utf-8');
        const parks: Park[] = JSON.parse(rawData);

        let modifiedCount = 0;

        const updatedParks = parks.map(park => {
            // 1. Check if it's one of our V2 updated descriptions
            const isUpdatedDescription = hasPersonaSignature(park.description);

            // 2. Check if it has a website but NO external link in the description yet
            const hasWebsite = park.website && park.website.length > 5;
            // FIX: Check for the specific anchor text we add, not just any link (since V2 has internal links)
            const hasNoLinkInDesc = !park.description.includes('official property website');

            if (isUpdatedDescription && hasWebsite) {
                // Candidates that matched both
                if (hasNoLinkInDesc) {
                    modifiedCount++;
                    const cta = `\n\nFor more details, visit the [official property website](${park.website}) to learn more about their services and updated hours.`;
                    return {
                        ...park,
                        description: park.description + cta
                    };
                }
            }
            return park;
        });

        if (modifiedCount > 0) {
            fs.writeFileSync(TARGET_FILE, JSON.stringify(updatedParks, null, 2), 'utf-8');
            console.log(`Successfully injected external links into ${modifiedCount} park descriptions.`);
        } else {
            console.log("No candidates found.");
            // Debug logging
            const totalParks = parks.length;
            const updatedDescs = parks.filter(p => hasPersonaSignature(p.description)).length;
            const withWebsites = parks.filter(p => p.website && p.website.length > 5).length;
            console.log(`Debug Stats: Total=${totalParks}, UpdatedV2=${updatedDescs}, WithWebsites=${withWebsites}`);
        }

    } catch (error) {
        console.error("Error processing file:", error);
        process.exit(1);
    }
}

main();
