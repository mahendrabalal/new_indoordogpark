'use client';

import { DogPark } from '@/types/dog-park';

interface CityStatsProps {
  parks: DogPark[];
  cityName: string;
}

export default function CityStats({ parks, cityName }: CityStatsProps) {
  // Calculate statistics
  const totalParks = parks.length;
  const ratedParks = parks.filter((park) => typeof park.rating === 'number' && park.rating > 0);
  const avgRating = ratedParks.length > 0
    ? (ratedParks.reduce((sum, park) => sum + park.rating, 0) / ratedParks.length).toFixed(1)
    : '—';
  const totalReviews = parks.reduce((sum, park) => sum + (park.reviewCount || park.userRatingsTotal || 0), 0);

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

  return (
    <section id="city-statistics" className="city-stats-section">
      <div className="section-header">
        <span className="section-eyebrow">Data & Insights</span>
        <h2>{cityName} Dog Park Statistics</h2>
        <p className="section-description">
          Snapshot based on the listings on this page (ratings, reviews, and park types).
        </p>
      </div>

      <div className="city-stats-stack">
      {/* Key Metrics Grid */}
      <div className="key-metrics">
        <div className="metric-card primary">
          <div className="metric-icon">
            <i className="bi bi-geo-alt-fill"></i>
          </div>
          <div className="metric-content">
            <h3>{totalParks}</h3>
            <p>Total Dog Parks</p>
            <span className="metric-subtitle">All types combined</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="bi bi-star-fill"></i>
          </div>
          <div className="metric-content">
            <h3>{avgRating}</h3>
            <p>Average Rating</p>
            <span className="metric-subtitle">
              {totalReviews > 0 ? `Based on ${totalReviews.toLocaleString()} reviews` : 'Review totals not available for all listings'}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="metric-content">
            <h3>{totalReviews.toLocaleString()}</h3>
            <p>Total Reviews</p>
            <span className="metric-subtitle">Community feedback</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="bi bi-trophy-fill"></i>
          </div>
          <div className="metric-content">
            <h3>{parks.filter(p => p.rating >= 4.5).length}</h3>
            <p>Premium Parks</p>
            <span className="metric-subtitle">4.5+ star ratings</span>
          </div>
        </div>
      </div>

      {/* Park Types Breakdown */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Park Types Distribution</h3>
          <div className="park-types-chart">
            {Object.entries(parksByType).map(([type, typeParks], index) => {
              const percentage = ((typeParks.length / totalParks) * 100).toFixed(0);
              const colors = ['#FF5722', '#E64A19', '#FF8A65', '#FFD0C2'];
              const color = colors[index % colors.length];

              return (
                <div key={type} className="park-type-stat">
                  <div className="stat-header">
                    <span className="stat-label">{type}</span>
                    <span className="stat-value">{typeParks.length} parks</span>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                  <span className="stat-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stat-card">
          <h3>Rating Distribution</h3>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating] || 0;
              const percentage = totalParks > 0 ? (count / totalParks) * 100 : 0;

              return (
                <div key={rating} className="rating-stat">
                  <div className="rating-label">
                    <span>{rating}</span>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <div className="rating-bar">
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
        .city-stats-section {
          padding: 0;
          background: transparent;
        }

        .section-header {
          text-align: left;
          max-width: 960px;
          margin: 0 auto 48px;
        }

        .section-eyebrow {
          display: inline-block;
          padding: 6px 16px;
          background: linear-gradient(135deg, #FF5722, #E64A19);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 16px;
          line-height: 1.2;
        }

        .section-description {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin: 0;
          max-width: 70ch;
        }

        .city-stats-stack {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .key-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .metric-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid transparent;
        }

        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .metric-card.primary {
          border-color: #FF5722;
          background: linear-gradient(135deg, #FF5722, #E64A19);
          color: white;
        }

        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .metric-card.primary .metric-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .metric-content h3 {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 4px;
          color: #1f2937;
        }

        .metric-card.primary .metric-content h3 {
          color: white;
        }

        .metric-content p {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 4px;
          color: #6b7280;
        }

        .metric-card.primary .metric-content p {
          color: rgba(255, 255, 255, 0.9);
        }

        .metric-subtitle {
          font-size: 14px;
          color: #9ca3af;
        }

        .metric-card.primary .metric-subtitle {
          color: rgba(255, 255, 255, 0.8);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .stat-card h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px;
        }

        .park-types-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .park-type-stat {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-weight: 500;
          color: #374151;
        }

        .stat-value {
          font-weight: 600;
          color: #FF5722;
        }

        .stat-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .stat-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .stat-percentage {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .rating-distribution {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rating-stat {
          display: grid;
          grid-template-columns: 60px 1fr 40px;
          align-items: center;
          gap: 12px;
        }

        .rating-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          color: #374151;
        }

        .rating-label i {
          color: #fbbf24;
          font-size: 12px;
        }

        .rating-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .rating-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF5722, #E64A19);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .rating-count {
          font-weight: 600;
          color: #FF5722;
          text-align: center;
        }

        .secondary-panel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .panel-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #ede9fe;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
          height: 100%;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .panel-heading.stacked {
          flex-direction: column;
        }

        .panel-heading h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .panel-heading p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .panel-pill {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 999px;
          padding: 4px 12px;
          white-space: nowrap;
        }

        .amenity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .amenity-item:hover {
          background: #ede9fe;
          transform: translateY(-2px);
        }

        .amenity-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FF5722, #E64A19);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }

        .amenity-info {
          flex: 1;
        }

        .amenity-count {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .amenity-label {
          font-size: 14px;
          color: #6b7280;
        }

        .amenity-percentage {
          font-size: 14px;
          font-weight: 600;
          color: #FF5722;
        }

        .peak-times-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 240px;
          gap: 20px;
          align-items: stretch;
        }

        .times-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .time-slot {
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .time-slot:hover {
          background: #ede9fe;
          transform: translateY(-2px);
        }

        .time-header {
          margin-bottom: 12px;
        }

        .time-range {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .time-description {
          font-size: 14px;
          color: #6b7280;
        }

        .crowd-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .crowd-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .crowd-level {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }

        .visit-tip-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #78350f;
        }

        .visit-tip-card i {
          font-size: 22px;
          color: #b45309;
        }

        .tip-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        .visit-tip-card p {
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
          color: #7c2d12;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }

        .day-card {
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .day-card:hover {
          background: #ede9fe;
          transform: translateY(-2px);
        }

        .day-header {
          margin-bottom: 12px;
        }

        .day-name {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .day-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 14px;
          color: #FF5722;
          font-weight: 500;
        }

        .day-rating i {
          color: #fbbf24;
          font-size: 12px;
        }

        .crowd-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .crowd-badge.low {
          background: #d1fae5;
          color: #065f46;
        }

        .crowd-badge.moderate {
          background: #fed7aa;
          color: #92400e;
        }

        .crowd-badge.high {
          background: #fecaca;
          color: #991b1b;
        }

        .crowd-badge.very-high {
          background: #e5e7eb;
          color: #374151;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .insight-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
          transition: transform 0.3s ease;
          border-left: 4px solid #FF5722;
        }

        .insight-card:hover {
          transform: translateY(-5px);
        }

        .insight-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FF5722, #E64A19);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          margin-bottom: 16px;
        }

        .insight-card h4 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .insight-card p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .section-header {
            text-align: center;
          }

          .section-description {
            margin: 0 auto;
          }

          .section-header h2 {
            font-size: 32px;
          }

          .key-metrics {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .secondary-panel-grid {
            grid-template-columns: 1fr;
          }

          .panel-heading {
            flex-direction: column;
          }

          .amenity-grid {
            grid-template-columns: 1fr;
          }

          .peak-times-content {
            grid-template-columns: 1fr;
          }

          .times-grid {
            grid-template-columns: 1fr;
          }

          .days-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}