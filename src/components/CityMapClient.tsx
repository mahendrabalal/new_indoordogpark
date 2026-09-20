'use client';

import dynamic from 'next/dynamic';
import type { DogPark } from '@/types/dog-park';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '100%', minHeight: 480, background: '#f3f4f6', borderRadius: 28 }} />,
});

interface CityMapClientProps {
    parks: DogPark[];
}

export default function CityMapClient({ parks }: CityMapClientProps) {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: 480 }}>
            <Map parks={parks} />
        </div>
    );
}
