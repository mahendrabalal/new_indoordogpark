'use client';
import React from 'react';
import Link from 'next/link';
import { DogPark } from '@/types/dog-park';

interface CityParkComparisonProps {
    parks: DogPark[];
    cityName: string;
}

const CityParkComparison: React.FC<CityParkComparisonProps> = ({ parks, cityName }) => {
    // Take top 5 parks by rating
    const topParks = [...parks]
        .filter(p => typeof p.rating === 'number' && p.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    if (topParks.length < 2) return null;

    const getVibe = (park: DogPark) => {
        if (park.businessType === 'Indoor Dog Park') return 'Weather-proof';
        if (park.amenities?.agilityCourse) return 'Active Play';
        if (park.amenities?.socializing) return 'Social Hub';
        if (park.amenities?.smallDogArea) return 'Peace of Mind';
        if (park.businessType === 'Dog-Friendly Establishment') return 'Casual Hangout';
        return 'Community Favorite';
    };

    const getTopAmenity = (park: DogPark) => {
        const amenities = park.amenities || {};
        if (amenities.agilityCourse) return 'Agility Course';
        if (amenities.swimming) return 'Swimming Yard';
        if (amenities.dogWashStation) return 'Bath Station';
        if (amenities.socializing) return 'Social Bar';
        if (amenities.smallDogArea) return 'Small Dog Zone';
        return 'Fenced Run';
    };

    return (
        <div className="city-comparison-container" style={{ marginTop: 60, marginBottom: 60 }}>
            <div className="section-heading">
                <span className="section-eyebrow">Direct Comparison</span>
                <h2>Best for your next outing</h2>
                <p>A quick breakdown of the top-rated dog-friendly spots in {cityName}.</p>
            </div>

            <div className="comparison-table-wrapper" style={{ overflowX: 'auto', background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f8fafc' }}>
                            <th style={{ padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Park Name</th>
                            <th style={{ padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                            <th style={{ padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                            <th style={{ padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Feature</th>
                            <th style={{ padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</th>
                            <th style={{ padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Local Vibe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topParks.map((park) => (
                            <tr key={park.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }} className="comparison-row">
                                <td style={{ padding: '20px 12px' }}>
                                    <Link href={`/parks/${park.slug || park.id}`} style={{ fontWeight: 700, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {park.name}
                                        <i className="bi bi-arrow-up-right" style={{ fontSize: '0.75rem', color: '#6366f1' }} />
                                    </Link>
                                </td>
                                <td style={{ padding: '20px 12px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fef9c3', color: '#854d0e', padding: '4px 8px', borderRadius: 999, fontSize: '0.875rem', fontWeight: 600 }}>
                                        <i className="bi bi-star-fill" style={{ fontSize: '0.75rem' }} />
                                        {park.rating.toFixed(1)}
                                    </div>
                                </td>
                                <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.875rem' }}>
                                    {park.businessType}
                                </td>
                                <td style={{ padding: '20px 12px', color: '#475569', fontSize: '0.875rem' }}>
                                    {getTopAmenity(park)}
                                </td>
                                <td style={{ padding: '20px 12px', color: '#059669', fontWeight: 600 }}>
                                    {park.pricing?.priceRange || '—'}
                                </td>
                                <td style={{ padding: '20px 12px' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: 999,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: park.businessType === 'Indoor Dog Park' ? '#e0e7ff' : '#f1f5f9',
                                        color: park.businessType === 'Indoor Dog Park' ? '#4338ca' : '#475569'
                                    }}>
                                        {getVibe(park)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
        .comparison-row:hover {
          background-color: #f8fafc;
        }
        @media (max-width: 768px) {
          .comparison-table-wrapper {
            padding: 20px 16px;
            margin-left: -16px;
            margin-right: -16px;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
        </div>
    );
};

export default CityParkComparison;
