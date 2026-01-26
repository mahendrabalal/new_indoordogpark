import fs from 'fs';
import path from 'path';

const TARGET_FILE = path.join(process.cwd(), 'public/data/newjersey.json');

// Interface for the Park data
interface Park {
    id: string;
    name: string;
    city: string;
    description: string;
    rating?: number;
    reviewCount?: number;
    amenities?: Record<string, boolean>;
    slug: string;
}

// 1. Identify which descriptions are the "Old Generic" ones we want to overwrite.
//    We target multiple known "robotic" templates.
const GENERIC_SIGNATURES = [
    "is a distinguished, neighborhood sanctuary of aesthetics", // V1 template
    "brings a sophisticated sense of",                          // Flowery template 1
    "redefines the suburban animal experience",                 // Flowery template 2
    "elite focus on"                                            // Flowery template 3
];

function isGeneric(description: string): boolean {
    return GENERIC_SIGNATURES.some(sig => description.includes(sig));
}

// 2. Define the Personas
type Persona = 'Socialite' | 'Naturalist' | 'Trainer' | 'Historian';

const PERSONAS: Persona[] = ['Socialite', 'Naturalist', 'Trainer', 'Historian'];

function getRandomPersona(): Persona {
    return PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
}

function generateDescription(park: Park, persona: Persona): string {
    const city = park.city || "the area";
    const citySlug = park.city ? `/cities/${park.city.toLowerCase().replace(/ /g, '-')}-nj` : '#';
    const rating = park.rating || 4.5;
    const reviews = park.reviewCount || 15;
    const name = park.name;

    // --- SOCIALITE PERSONA ---
    if (persona === 'Socialite') {
        return `If you're looking for the ultimate wag-worthy social hub in [${city}](${citySlug}), look no further than ${name}. This vibrant community destination has earned a reputation as the "place to be" for local pet parents who want more than just a walk—they want a meetup. Boasting a solid ${rating}-star rating from ${reviews} reviews, the park radiates a welcoming energy where tails never stop wagging and neighbors become friends. Whether you're there for a quick playdate or a long afternoon of socializing, the atmosphere is always buzzing with positivity.

At ${name}, the focus is on connection. The layout encourages interaction, making it easy for pups to find playmates while owners chat on the sidelines. It’s not just a facility; it’s a social pillar of the ${city} scene, offering a safe, clean, and joyous environment where every visitor feels like a VIP. For a fun, friendly, and community-centered experience, this spot is a local favorite.`;
    }

    // --- NATURALIST PERSONA ---
    if (persona === 'Naturalist') {
        return `Tucked away in the scenic landscape of [${city}](${citySlug}), ${name} offers a refreshing escape into nature for you and your four-legged companion. This serene outdoor sanctuary is defined by its open skies and natural terrain, providing a necessary break from the suburban hustle. With a diverse landscape that invites exploration, it has become a cherished retreat for ${reviews} locals who appreciate a quieter, more atmospheric approach to dog walking verify by its ${rating}-star status.

The beauty of ${name} lies in its simplicity and connection to the environment. It is a place where the air feels fresher and the pace is slower, allowing dogs to sniff, explore, and simply be dogs in a grounded setting. The maintenance team prioritizes keeping the grounds pristine and eco-friendly, ensuring that the natural charm of the site is preserved for every sunrise and sunset stroll. For nature lovers in ${city}, this park is a breath of fresh air.`;
    }

    // --- TRAINER PERSONA ---
    if (persona === 'Trainer') {
        return `Serious about your pup's fitness and focus? ${name} in [${city}](${citySlug}) delivers a top-tier environment designed for activity and engagement. Rated ${rating} stars by a community of ${reviews} disciplined dog owners, this facility is built on the logic of "constructive play." It’s not just about running around; it’s about mental stimulation, clear boundaries, and a structured space where dogs can burn off energy productively.

The layout at ${name} is ideal for training exercises, recall practice, and agility drills. The grounds are kept in peak condition to ensure safety during high-intensity play, and the respectful community of regulars understands the value of good canine etiquette. Whether you are working on commands or just need a reliable space for vigorous exercise, this facility provides the professional-grade consistency that serious dog owners demand.`;
    }

    // --- HISTORIAN PERSONA ---
    if (persona === 'Historian') {
        return `For years, ${name} has served as a steadfast anchor of the [${city}](${citySlug}) community, earning its place as a beloved local institution. With a history of serving generations of tail-waggers, this location carries a sense of established trust and neighborhood pride that you can't manufacture. Documented by ${reviews} reviews and a ${rating}-star legacy, it stands as a testament to the town's enduring commitment to its animal residents.

Stepping into ${name} feels like visiting an old friend. The facility balances traditional park values with modern maintenance standards, ensuring a timeless experience that feels both familiar and safe. It is more than just a plot of land; it is a repository of memories for families and a daily ritual for the neighborhood. For those who value consistency, heritage, and a strong sense of place, this ${city} staple remains the gold standard.`;
    }

    return park.description; // Fallback
}

async function main() {
    try {
        const rawData = fs.readFileSync(TARGET_FILE, 'utf-8');
        const parks: Park[] = JSON.parse(rawData);

        let modifiedCount = 0;
        const stats = { Socialite: 0, Naturalist: 0, Trainer: 0, Historian: 0 };

        const updatedParks = parks.map(park => {
            // Only rewrite if it matches ANY of the Generic Signatures
            if (isGeneric(park.description)) {
                const persona = getRandomPersona();
                stats[persona]++;
                modifiedCount++;
                return {
                    ...park,
                    description: generateDescription(park, persona)
                };
            }
            return park;
        });

        if (modifiedCount > 0) {
            fs.writeFileSync(TARGET_FILE, JSON.stringify(updatedParks, null, 2), 'utf-8');
            console.log(`Successfully updated ${modifiedCount} park descriptions with new personas.`);
            console.log('Distribution:', stats);
        } else {
            console.log("No V1 generic descriptions found to update.");
        }

    } catch (error) {
        console.error("Error processing file:", error);
        process.exit(1);
    }
}

main();
