import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity-client';
import { MediaAsset } from '@/types/dog-park';

export const revalidate = 3600; // Cache for 1 hour to prevent Egress overages
export const runtime = 'nodejs';

export async function GET() {
    try {
        // Fetch from Sanity
        const query = `*[_type == "parkSubmission" && status == "approved"] | order(_createdAt desc)[0...8] {
            _id,
            _createdAt,
            name,
            "slug": slug.current,
            businessType,
            description,
            address,
            city,
            state,
            zipCode,
            latitude,
            longitude,
            phone,
            email,
            website,
            socialMedia,
            amenities,
            rules,
            pricingInfo,
            listingType,
            status,
            "photos": photos[]{
                "url": asset->url
            }
        }`;

        const sanityParksData = await sanityClient.fetch(query).catch(err => {
            console.error('Failed to fetch from Sanity:', err);
            return [];
        });

        const sanityParks = sanityParksData.map((park: any) => {
            const normalizedPhotos: MediaAsset[] = (park.photos || []).map((p: any) => ({
                url: p.url,
                type: 'photo'
            })).filter((p: any) => p.url);

            return {
                id: park._id,
                userId: park.userId || 'anonymous',
                name: park.name,
                slug: park.slug,
                businessType: park.businessType,
                description: park.description,
                address: park.address,
                street: park.address,
                city: park.city,
                state: park.state,
                zipCode: park.zipCode,
                fullAddress: `${park.address || ''}, ${park.city || ''}, ${park.state || ''} ${park.zipCode || ''}`.trim().replace(/^,|,$/g, '').trim(),
                latitude: park.latitude,
                longitude: park.longitude,
                phone: park.phone,
                email: park.email,
                website: park.website,
                socialMedia: park.socialMedia,
                photos: normalizedPhotos,
                photo: normalizedPhotos[0]?.url,
                openingHours: park.openingHours || null,
                hours24x7: false,
                hoursNote: null,
                pricingInfo: park.pricingInfo,
                amenities: park.amenities,
                listingType: park.listingType || 'free',
                status: park.status,
                createdAt: park._createdAt,
                updatedAt: park._updatedAt || park._createdAt,
                approvedAt: park._createdAt,
            };
        });

        // Only return Sanity parks
        const allParks = sanityParks
            .sort((a: any, b: any) => new Date(b.createdAt || b.submittedAt || b.approvedAt || 0).getTime() - new Date(a.createdAt || a.submittedAt || a.approvedAt || 0).getTime())
            .slice(0, 8);

        return NextResponse.json({ parks: allParks }, { status: 200 });

    } catch (error) {
        console.error('GET recent parks error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
