'use client';

import dynamic from 'next/dynamic';
import type { DogPark } from '@/types/dog-park';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div style={{ minHeight: 320, background: '#f3f4f6' }} />,
});

interface CityMapClientProps {
    parks: DogPark[];
}

export default function CityMapClient({ parks }: CityMapClientProps) {
    return <Map parks={parks} />;
}
