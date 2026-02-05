'use client';

import dynamic from 'next/dynamic';
import type { DogPark } from '@/types/dog-park';

const ParkMap = dynamic(() => import('@/components/ParkMap'), {
    ssr: false,
    loading: () => <div style={{ minHeight: 400, background: '#f3f4f6', borderRadius: 12 }} />,
});

interface ParkMapClientProps {
    park: DogPark;
}

export default function ParkMapClient({ park }: ParkMapClientProps) {
    return <ParkMap park={park} />;
}
