
import fs from 'fs';
import path from 'path';

// Define types for source data
interface SourcePark {
    place_id: string;
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

const sourcePath = path.join(process.cwd(), 'public/data/tennessee.json');
const backupPath = path.join(process.cwd(), 'public/data/tennessee.json.bak');

// Create backup
fs.copyFileSync(sourcePath, backupPath);

const rawData = fs.readFileSync(sourcePath, 'utf-8');
const sourceParks: SourcePark[] = JSON.parse(rawData);

const targetParks: TargetPark[] = sourceParks.map(source => {
    // Use explicit description or fallback to scrapedDescription or construct a generic one
    const description = source.description || source.scrapedDescription || `Dog park in ${source.city}, TN`;

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

    return {
        id: source.place_id || generateSlug(source.name), // Use place_id as ID if available
        name: source.name,
        businessType: businessType,
        description: description,
        slug: generateSlug(source.name),
        address: source.street || '',
        street: source.street || '',
        city: source.city || '',
        state: 'TN', // Normalize to TN
        zipCode: source.postal_code || '',
        full_address: source.full_address || `${source.street}, ${source.city}, TN ${source.postal_code}`,
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

console.log(`Transformed ${targetParks.length} parks in tennessee.json`);
