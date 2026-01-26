
import fs from 'fs';
import path from 'path';

// Define types for source data (based on missouri.json/newjersey.json structure)
interface SourcePark {
    place_id?: string;
    name: string;
    type?: string;
    category?: string;
    description?: string;
    scrapedDescription?: string;
    street?: string;
    city?: string;
    postal_code?: string;
    full_address?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    site?: string;
    rating?: number;
    reviews?: number;
    working_hours?: Record<string, string>;
    about?: {
        "Service options"?: Record<string, boolean>;
        "Accessibility"?: Record<string, boolean>;
        [key: string]: any;
    };
    [key: string]: any;
}

// Define types for target data (matching DogPark interface)
interface TargetPark {
    id: string;
    name: string;
    businessType: string;
    description: string;
    slug: string;
    address: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    full_address: string;
    latitude: number;
    longitude: number;
    googlePlaceId: string;
    phone: string;
    website: string;
    photos: null;
    rating: number;
    reviewCount: number;
    openingHours?: Record<string, string>;
    amenities?: Record<string, boolean>;
    pricing: {
        pricingSource: string;
        isFree: boolean;
    };
    placeTypes: string[];
    lastUpdated: null;
    dataQuality: string;
    photo: null;
    faqs: any[];
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: npx tsx scripts/transform-state-data.ts <relativePathToFile> <stateCode>');
        process.exit(1);
    }

    const relativePath = args[0];
    const stateCode = args[1].toUpperCase();

    const sourcePath = path.join(process.cwd(), relativePath);
    const backupPath = `${sourcePath}.bak`;

    if (!fs.existsSync(sourcePath)) {
        console.error(`File not found: ${sourcePath}`);
        process.exit(1);
    }

    // Create backup
    console.log(`Creating backup at ${backupPath}`);
    fs.copyFileSync(sourcePath, backupPath);

    const rawData = fs.readFileSync(sourcePath, 'utf-8');
    const sourceParks: SourcePark[] = JSON.parse(rawData);

    console.log(`Processing ${sourceParks.length} parks for state ${stateCode}...`);

    const targetParks: TargetPark[] = sourceParks.map(source => {
        // Use explicit description or fallback to scrapedDescription or construct a generic one
        let description = source.description || source.scrapedDescription;
        if (!description) {
            description = `Dog park in ${source.city || 'Unknown City'}, ${stateCode}`;
        }

        // Determine Business Type
        let businessType = 'Dog Park'; // Default
        if (source.type === 'Dog facility' || source.category === 'Dog facility') {
            businessType = 'Dog Park';
        }

        // Map Amenities
        const amenities: Record<string, boolean> = {};
        if (source.about) {
            if (source.about["Service options"]) {
                Object.assign(amenities, source.about["Service options"]);
            }
            if (source.about["Accessibility"]) {
                Object.assign(amenities, source.about["Accessibility"]);
            }
        }

        const city = source.city || '';
        const street = source.street || '';
        const zipCode = source.postal_code || '';
        const full_address = source.full_address || [street, city, stateCode, zipCode].filter(Boolean).join(', ');

        return {
            id: source.place_id || generateSlug(source.name), // Use place_id as ID if available
            name: source.name,
            businessType: businessType,
            description: description,
            slug: generateSlug(source.name),
            address: street,
            street: street,
            city: city,
            state: stateCode,
            zipCode: zipCode,
            full_address: full_address,
            latitude: source.latitude || 0,
            longitude: source.longitude || 0,
            googlePlaceId: source.place_id || '',
            phone: source.phone || '',
            website: source.site || '',
            photos: null,
            rating: source.rating || 0,
            reviewCount: source.reviews || 0,
            openingHours: source.working_hours,
            amenities: Object.keys(amenities).length > 0 ? amenities : undefined,
            pricing: {
                pricingSource: 'website',
                isFree: false
            },
            placeTypes: ['point_of_interest', 'establishment'],
            lastUpdated: null,
            dataQuality: 'verified',
            photo: null,
            faqs: []
        };
    });

    fs.writeFileSync(sourcePath, JSON.stringify(targetParks, null, 2));

    console.log(`Successfully transformed ${targetParks.length} parks in ${relativePath}`);
}

main().catch(console.error);
