'use client';

import { DogPark } from '@/types/dog-park';

interface CityInsightCard {
  tag: string;
  title: string;
  copy: string;
  accent?: boolean;
}

interface TopAmenity {
  key: string;
  label: string;
  share: number;
}

interface CityStatsProps {
  parks: DogPark[];
  cityName: string;
  insightCards?: CityInsightCard[];
  topAmenities?: TopAmenity[];
  insightIntro?: string;
}

export default function CityStats({
  parks,
  cityName,
  insightCards,
  topAmenities = [],
  insightIntro
}: CityStatsProps) {
  // Calculate statistics
  const totalParks = parks.length;
  const ratedParks = parks.filter((park) => typeof park.rating === 'number' && park.rating > 0);
  const avgRating = ratedParks.length > 0
    ? (ratedParks.reduce((sum, park) => sum + park.rating, 0) / ratedParks.length).toFixed(1)
    : '—';
  const totalReviews = parks.reduce((sum, park) => sum + (park.reviewCount || park.userRatingsTotal || 0), 0);
  const premiumParks = parks.filter(p => p.rating >= 4.5).length;
  const indoorParks = parks.filter(p => p.businessType?.toLowerCase().includes('indoor')).length;
  const indoorPercentage = totalParks > 0 ? Math.round((indoorParks / totalParks) * 100) : 0;

  // Group parks by type
  const parksByType = parks.reduce((acc, park) => {
    const type = park.businessType || 'Unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(park);
    return acc;
  }, {} as Record<string, DogPark[]>);

  // Rating distribution
  const ratingDistribution = parks.reduce((acc, park) => {
    const rating = Math.floor(park.rating || 0);
    if (rating < 1) return acc;
    if (!acc[rating]) acc[rating] = 0;
    acc[rating]++;
    return acc;
  }, {} as Record<number, number>);

  // Default insight cards if none provided
  const defaultInsightCards: CityInsightCard[] = [
    {
      tag: 'Community rating',
      title: avgRating,
      copy: `Average rating across every verified listing in ${cityName}. Reflects cleanliness, amenities, and community feedback.`,
      accent: true,
    },
    {
      tag: 'Verified reviews',
      title: totalReviews.toLocaleString(),
      copy: 'Community reviews informing our quality score. Tap any park card below to see highlights.',
    },
    {
      tag: 'Park availability',
      title: totalParks.toString(),
      copy: `Total verified listings currently live for ${cityName}. Fresh listings added weekly.`,
    },
    {
      tag: 'Indoor options',
      title: indoorParks ? `${indoorPercentage}%` : '—',
      copy: indoorParks
        ? `${indoorParks} indoor park${indoorParks === 1 ? '' : 's'} with climate control for weather-proof play sessions.`
        : 'Indoor options are being scouted—submit a favorite and we will feature it.',
    },
  ];

  const displayInsightCards = insightCards || defaultInsightCards;

  return (
    <section id="city-statistics" className="city-stats-unified">
      {/* Section Header */}
      <div className="stats-section-header">
        <span className="stats-eyebrow">City Statistics</span>
        <h2>How {cityName} stacks up for dog families</h2>
        <p className="stats-intro">
          {insightIntro || 'Verified ratings, review volume, and park availability updated directly from our community directory.'}
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats-row">
        {displayInsightCards.map((card, idx) => (
          <div key={idx} className={`quick-stat-card ${card.accent ? 'accent' : ''}`}>
            <span className="stat-tag">{card.tag}</span>
            <h3 className="stat-value">{card.title}</h3>
            <p className="stat-copy">{card.copy}</p>
          </div>
        ))}
      </div>

      {/* Amenities Row */}
      {topAmenities.length > 0 && (
        <div className="amenities-row">
          <div className="amenities-header">
            <h3>Most common amenities</h3>
            <p>What people are looking for and finding in {cityName}.</p>
          </div>
          <div className="amenities-chips">
            {topAmenities.map((amenity) => (
              <span key={amenity.key} className="amenity-chip">
                <span className="chip-percentage">{amenity.share}%</span>
                <span className="chip-label">{amenity.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Data Grid: Key Metrics + Charts */}
      <div className="data-grid-container">
        {/* Key Metrics */}
        <div className="key-metrics-grid">
          <div className="metric-item primary">
            <div className="metric-icon">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <div className="metric-details">
              <span className="metric-number">{totalParks}</span>
              <span className="metric-label">Total Dog Parks</span>
              <span className="metric-sub">All types combined</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon">
              <i className="bi bi-star-fill"></i>
            </div>
            <div className="metric-details">
              <span className="metric-number">{avgRating}</span>
              <span className="metric-label">Average Rating</span>
              <span className="metric-sub">Based on {totalReviews.toLocaleString()} reviews</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon">
              <i className="bi bi-chat-heart-fill"></i>
            </div>
            <div className="metric-details">
              <span className="metric-number">{totalReviews.toLocaleString()}</span>
              <span className="metric-label">Total Reviews</span>
              <span className="metric-sub">Community feedback</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon">
              <i className="bi bi-trophy-fill"></i>
            </div>
            <div className="metric-details">
              <span className="metric-number">{premiumParks}</span>
              <span className="metric-label">Premium Parks</span>
              <span className="metric-sub">4.5+ star ratings</span>
            </div>
          </div>
        </div>

        {/* Charts Side by Side */}
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Park Types Distribution</h4>
            <div className="chart-content">
              {Object.entries(parksByType).map(([type, typeParks], index) => {
                const percentage = ((typeParks.length / totalParks) * 100).toFixed(0);
                const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];
                const color = colors[index % colors.length];

                return (
                  <div key={type} className="bar-item">
                    <div className="bar-header">
                      <span className="bar-label">{type}</span>
                      <span className="bar-value">{typeParks.length} parks</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="bar-percentage">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-card">
            <h4>Rating Distribution</h4>
            <div className="chart-content rating-chart">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating] || 0;
                const percentage = totalParks > 0 ? (count / totalParks) * 100 : 0;

                return (
                  <div key={rating} className="rating-row">
                    <div className="rating-label">
                      <span>{rating}</span>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <div className="rating-track">
                      <div
                        className="rating-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="rating-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .city-stats-unified {
          padding: 0;
          background: transparent;
        }

        .stats-section-header {
          margin-bottom: 32px;
        }

        .stats-eyebrow {
          display: inline-block;
          padding: 6px 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .stats-section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
          line-height: 1.25;
        }

        .stats-intro {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
          max-width: 60ch;
        }

        /* Quick Stats Row */
        .quick-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .quick-stat-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .quick-stat-card:hover {
          border-color: #c7d2fe;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
        }

        .quick-stat-card.accent {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: transparent;
          color: white;
        }

        .stat-tag {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 8px;
        }

        .quick-stat-card.accent .stat-tag {
          color: rgba(255, 255, 255, 0.85);
        }

        .quick-stat-card .stat-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
          line-height: 1;
        }

        .quick-stat-card.accent .stat-value {
          color: white;
        }

        .stat-copy {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }

        .quick-stat-card.accent .stat-copy {
          color: rgba(255, 255, 255, 0.9);
        }

        /* Amenities Row */
        .amenities-row {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
        }

        .amenities-header {
          margin-bottom: 16px;
        }

        .amenities-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .amenities-header p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        .amenities-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .amenity-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .amenity-chip:hover {
          border-color: #c7d2fe;
          background: #eef2ff;
        }

        .chip-percentage {
          font-weight: 700;
          color: #6366f1;
        }

        .chip-label {
          color: #334155;
          font-weight: 500;
        }

        /* Data Grid Container */
        .data-grid-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Key Metrics Grid */
        .key-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: white;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .metric-item:hover {
          border-color: #c7d2fe;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
        }

        .metric-item.primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: transparent;
          color: white;
        }

        .metric-item .metric-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #6366f1;
          flex-shrink: 0;
        }

        .metric-item.primary .metric-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .metric-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .metric-number {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .metric-item.primary .metric-number {
          color: white;
        }

        .metric-details .metric-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
        }

        .metric-item.primary .metric-details .metric-label {
          color: rgba(255, 255, 255, 0.95);
        }

        .metric-sub {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .metric-item.primary .metric-sub {
          color: rgba(255, 255, 255, 0.8);
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .chart-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 16px;
        }

        .chart-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Bar Items for Park Types */
        .bar-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .bar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bar-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #334155;
        }

        .bar-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: #6366f1;
        }

        .bar-track {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .bar-percentage {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Rating Rows */
        .rating-chart {
          gap: 10px;
        }

        .rating-row {
          display: grid;
          grid-template-columns: 50px 1fr 32px;
          align-items: center;
          gap: 10px;
        }

        .rating-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          color: #334155;
          font-size: 0.85rem;
        }

        .rating-label i {
          color: #fbbf24;
          font-size: 11px;
        }

        .rating-track {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }

        .rating-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .rating-count {
          font-weight: 700;
          color: #6366f1;
          text-align: center;
          font-size: 0.85rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .quick-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .key-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-section-header {
            text-align: center;
          }

          .stats-intro {
            margin: 0 auto;
          }

          .stats-section-header h2 {
            font-size: 1.5rem;
          }

          .quick-stats-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .key-metrics-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .charts-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .amenities-row {
            padding: 16px;
          }

          .amenities-chips {
            gap: 8px;
          }

          .amenity-chip {
            padding: 6px 12px;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .key-metrics-grid {
            grid-template-columns: 1fr;
          }

          .metric-item {
            padding: 14px;
          }
        }
      `}</style>
    </section>
  );
}