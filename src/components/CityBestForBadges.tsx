import React from 'react';
import Link from 'next/link';

interface Amenity {
  label: string;
  share: number;
}

interface CityBestForBadgesProps {
  cityName: string;
  topAmenities: Amenity[];
}

// Icon mapping based on common amenities
const getIconForAmenity = (label: string): string => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('bar') || lowerLabel.includes('beer') || lowerLabel.includes('alcohol')) return 'bi-cup-straw';
  if (lowerLabel.includes('coffee') || lowerLabel.includes('cafe')) return 'bi-cup-hot';
  if (lowerLabel.includes('small dog')) return 'bi-info-circle'; // Or another suitable icon
  if (lowerLabel.includes('agility') || lowerLabel.includes('training')) return 'bi-activity';
  if (lowerLabel.includes('wash') || lowerLabel.includes('bath')) return 'bi-droplet';
  if (lowerLabel.includes('daycare') || lowerLabel.includes('boarding')) return 'bi-house-heart';
  if (lowerLabel.includes('wifi')) return 'bi-wifi';
  if (lowerLabel.includes('member')) return 'bi-star';
  return 'bi-check2-circle'; // Default
};

export default function CityBestForBadges({ cityName, topAmenities }: CityBestForBadgesProps) {
  if (!topAmenities || topAmenities.length === 0) return null;

  // Take top 4 amenities to keep it clean
  const displayAmenities = topAmenities.slice(0, 4);

  return (
    <div className="city-best-for-badges" style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>
        What {cityName} is known for:
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {displayAmenities.map((amenity, index) => {
          const icon = getIconForAmenity(amenity.label);
          return (
            <div 
              key={index}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <i className={`bi ${icon}`} style={{ color: '#6366f1' }} />
              Best for {amenity.label.toLowerCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
