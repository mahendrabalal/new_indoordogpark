import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { MediaAsset } from '@/types/dog-park';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
    try {
        // Helper to normalize photos stored in Supabase
        const normalizePhotos = (photos: unknown): MediaAsset[] => {
            if (!Array.isArray(photos)) return [];

            return photos
                .map((photo) => {
                    if (!photo) return null;

                    if (typeof photo === 'string') {
                        const trimmed = photo.trim();
                        if (!trimmed) return null;
                        return {
                            url: trimmed,
                            type: 'photo',
                        } as MediaAsset;
                    }

                    if (typeof photo === 'object') {
                        const anyPhoto = photo as Record<string, unknown>;
                        const url =
                            typeof anyPhoto.url === 'string' && anyPhoto.url.trim()
                                ? anyPhoto.url
                                : typeof anyPhoto.publicUrl === 'string' && anyPhoto.publicUrl.trim()
                                    ? anyPhoto.publicUrl
                                    : undefined;

                        if (!url) return null;

                        return {
                            type: (anyPhoto.type as MediaAsset['type']) || 'photo',
                            url,
                            caption: typeof anyPhoto.caption === 'string' ? anyPhoto.caption : undefined,
                            source: typeof anyPhoto.source === 'string' ? (anyPhoto.source as MediaAsset['source']) : undefined,
                            uploadedAt: typeof anyPhoto.uploadedAt === 'string' ? anyPhoto.uploadedAt : undefined,
                            storagePath: typeof anyPhoto.storagePath === 'string' ? anyPhoto.storagePath : undefined,
                        } satisfies MediaAsset;
                    }

                    return null;
                })
                .filter((photo): photo is MediaAsset => !!photo);
        };
        // Fetch recently approved parks (both free and featured)
        // Order by approved_at descending to get the newest first
        const { data: parks, error } = await supabaseAdminClient
            .from('park_submissions')
            .select('*')
            .eq('status', 'approved')
            .not('approved_at', 'is', null)
            .order('approved_at', { ascending: false })
            .limit(8);

        if (error) {
            console.error('Failed to fetch recent parks:', error);
            return NextResponse.json(
                { error: 'Failed to fetch recent parks' },
                { status: 500 }
            );
        }

        interface ParkSubmissionRow {
            id: string;
            user_id: string;
            name: string;
            slug: string;
            business_type: string;
            description: string;
            address: string | null;
            street: string;
            city: string;
            state: string;
            zip_code: string;
            full_address: string;
            latitude: number | null;
            longitude: number | null;
            phone: string;
            email: string | null;
            website: string | null;
            social_media: unknown;
            photos: unknown;
            opening_hours: unknown;
            hours_24x7: boolean;
            hours_note: string | null;
            pricing_info: unknown;
            amenities: unknown;
            indoor_outdoor: string;
            size_category: string;
            surface_type: string;
            pet_friendly_features: unknown;
            listing_type: string;
            status: string;
            created_at: string;
            updated_at: string;
            approved_at: string;
        }

        // Transform snake_case to camelCase for frontend
        const transformedParks = (parks as unknown as ParkSubmissionRow[] || []).map((park) => {
            const normalizedPhotos = normalizePhotos(park.photos);

            return {
                id: park.id,
                userId: park.user_id,
                name: park.name,
                slug: park.slug,
                businessType: park.business_type,
                description: park.description,
                address: park.address,
                street: park.street,
                city: park.city,
                state: park.state,
                zipCode: park.zip_code,
                fullAddress: park.full_address,
                latitude: park.latitude,
                longitude: park.longitude,
                phone: park.phone,
                email: park.email,
                website: park.website,
                socialMedia: park.social_media,
                photos: normalizedPhotos,
                photo: normalizedPhotos[0]?.url,
                openingHours: park.opening_hours,
                hours24x7: park.hours_24x7,
                hoursNote: park.hours_note,
                pricingInfo: park.pricing_info,
                amenities: park.amenities,
                indoorOutdoor: park.indoor_outdoor,
                sizeCategory: park.size_category,
                surfaceType: park.surface_type,
                petFriendlyFeatures: park.pet_friendly_features,
                listingType: park.listing_type,
                status: park.status,
                createdAt: park.created_at,
                updatedAt: park.updated_at,
                approvedAt: park.approved_at,
            };
        }) || [];

        return NextResponse.json({ parks: transformedParks }, { status: 200 });

    } catch (error) {
        console.error('GET recent parks error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
