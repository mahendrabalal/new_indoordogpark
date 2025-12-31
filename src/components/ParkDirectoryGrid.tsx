'use client';

import { useState, useEffect } from 'react';
import ParkCard from './ParkCard';
import type { DogPark } from '@/types/dog-park';

interface ParkDirectoryGridProps {
  parks: DogPark[];
}

export default function ParkDirectoryGrid({ parks }: ParkDirectoryGridProps) {
  const [showAll, setShowAll] = useState(false);
  const [initialCount, setInitialCount] = useState(6); // Default to 6 (2 rows × 3 columns)

  useEffect(() => {
    // Calculate initial count based on viewport width
    const updateInitialCount = () => {
      const width = window.innerWidth;
      if (width >= 900) {
        // Desktop: 3 columns per row, 2 rows = 6 parks
        setInitialCount(6);
      } else if (width >= 600) {
        // Tablet: 2 columns per row, 2 rows = 4 parks
        setInitialCount(4);
      } else {
        // Mobile: 1 column per row, 2 rows = 2 parks
        setInitialCount(2);
      }
    };

    updateInitialCount();
    window.addEventListener('resize', updateInitialCount);
    return () => window.removeEventListener('resize', updateInitialCount);
  }, []);

  const displayedParks = showAll ? parks : parks.slice(0, initialCount);
  const hasMore = parks.length > initialCount;

  if (parks.length === 0) {
    return (
      <div className="directory-empty">
        <i className="bi bi-chat-square" />
        <p>No listings yet—submit a favorite to help other pet parents.</p>
      </div>
    );
  }

  return (
    <>
      <div className="directory-grid">
        {displayedParks.map((park) => (
          <ParkCard key={park.id} park={park} />
        ))}
      </div>
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="hero-cta primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            {showAll ? (
              <>
                <i className="bi bi-chevron-up" />
                Show Less
              </>
            ) : (
              <>
                <i className="bi bi-chevron-down" />
                Show More ({parks.length - initialCount} more)
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}






