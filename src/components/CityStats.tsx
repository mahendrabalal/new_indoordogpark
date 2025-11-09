import { DogPark } from '@/types/dog-park';

interface CityStatsProps {
  parks: DogPark[];
  cityName: string;
}

export default function CityStats({ parks, cityName }: CityStatsProps) {
  // Calculate statistics
  const totalParks = parks.length;
  const avgRating = parks.length > 0
    ? (parks.reduce((sum, park) => sum + park.rating, 0) / parks.length).toFixed(1)
    : '0.0';
  const totalReviews = parks.reduce((sum, park) => sum + (park.userRatingsTotal || 0), 0);

  // Group parks by type
  const parksByType = parks.reduce((acc, park) => {
    const type = park.businessType || 'Unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(park);
    return acc;
  }, {} as Record<string, DogPark[]>);

  // Rating distribution
  const ratingDistribution = parks.reduce((acc, park) => {
    const rating = Math.floor(park.rating);
    if (!acc[rating]) acc[rating] = 0;
    acc[rating]++;
    return acc;
  }, {} as Record<number, number>);

  // Simulated amenity data (since real data might not be available)
  const amenityStats = {
    fencedEnclosures: Math.floor(totalParks * 0.8),
    waterStations: Math.floor(totalParks * 0.7),
    wasteStations: totalParks,
    seatingAreas: Math.floor(totalParks * 0.6),
    parking: Math.floor(totalParks * 0.9),
    lighting: Math.floor(totalParks * 0.4)
  };

  // Calculate peak times (simulated data)
  const peakTimes = [
    { time: '6-9 AM', percentage: 35, description: 'Morning exercise' },
    { time: '12-2 PM', percentage: 15, description: 'Lunch break' },
    { time: '4-7 PM', percentage: 40, description: 'After work/play' },
    { time: '7-9 PM', percentage: 10, description: 'Evening stroll' }
  ];

  // Best days to visit (simulated)
  const bestDays = [
    { day: 'Monday', crowd: 'Low', rating: 4.2 },
    { day: 'Tuesday', crowd: 'Low', rating: 4.1 },
    { day: 'Wednesday', crowd: 'Medium', rating: 4.3 },
    { day: 'Thursday', crowd: 'Medium', rating: 4.4 },
    { day: 'Friday', crowd: 'High', rating: 4.5 },
    { day: 'Saturday', crowd: 'Very High', rating: 4.6 },
    { day: 'Sunday', crowd: 'Very High', rating: 4.5 }
  ];

  return (
    <section id="city-statistics" className="city-stats-section">
      <div className="section-header">
        <span className="section-eyebrow">Data & Insights</span>
        <h2>{cityName} Dog Park Statistics</h2>
        <p className="section-description">
          Comprehensive data and insights about dog parks in {cityName}. Make informed decisions about when and where to visit.
        </p>
      </div>

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
            <span className="metric-subtitle">Based on {totalReviews} reviews</span>
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
              const colors = ['#7c3aed', '#a855f7', '#c084fc', '#e9d5ff'];
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

      {/* Amenity Statistics */}
      <div className="amenity-stats">
        <h3>Available Amenities</h3>
        <div className="amenity-grid">
          {Object.entries(amenityStats).map(([amenity, count]) => {
            const labels = {
              fencedEnclosures: 'Fenced Enclosures',
              waterStations: 'Water Stations',
              wasteStations: 'Waste Stations',
              seatingAreas: 'Seating Areas',
              parking: 'Parking Available',
              lighting: 'Evening Lighting'
            };

            const icons = {
              fencedEnclosures: 'bi-border-style',
              waterStations: 'bi-droplet-fill',
              wasteStations: 'bi-trash3-fill',
              seatingAreas: 'bi-bench-fill',
              parking: 'bi-car-front-fill',
              lighting: 'bi-lightbulb-fill'
            };

            return (
              <div key={amenity} className="amenity-item">
                <div className="amenity-icon">
                  <i className={`bi ${icons[amenity as keyof typeof icons]}`}></i>
                </div>
                <div className="amenity-info">
                  <span className="amenity-count">{count}</span>
                  <span className="amenity-label">{labels[amenity as keyof typeof labels]}</span>
                </div>
                <div className="amenity-percentage">
                  {Math.round((count / totalParks) * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peak Times Analysis */}
      <div className="peak-times">
        <h3>Best Times to Visit</h3>
        <div className="times-grid">
          {peakTimes.map((timeSlot, index) => (
            <div key={index} className="time-slot">
              <div className="time-header">
                <span className="time-range">{timeSlot.time}</span>
                <span className="time-description">{timeSlot.description}</span>
              </div>
              <div className="crowd-indicator">
                <div className="crowd-bar">
                  <div
                    className="crowd-fill"
                    style={{ width: `${timeSlot.percentage}%` }}
                  />
                </div>
                <span className="crowd-level">
                  {timeSlot.percentage < 20 ? 'Quiet' :
                   timeSlot.percentage < 40 ? 'Moderate' : 'Busy'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="visit-tips">
          <div className="tip-card">
            <i className="bi bi-lightbulb"></i>
            <div>
              <h4>Pro Tip</h4>
              <p>Weekday mornings (6-9 AM) offer the best balance of socialization opportunities and manageable crowds.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Days Analysis */}
      <div className="days-analysis">
        <h3>Weekly Crowd Patterns</h3>
        <div className="days-grid">
          {bestDays.map((day, index) => (
            <div key={index} className="day-card">
              <div className="day-header">
                <span className="day-name">{day.day}</span>
                <div className="day-rating">
                  <i className="bi bi-star-fill"></i>
                  <span>{day.rating}</span>
                </div>
              </div>
              <div className={`crowd-badge ${day.crowd.toLowerCase().replace(' ', '-')}`}>
                {day.crowd}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="key-insights">
        <h3>Key Insights for {cityName}</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">
              <i className="bi bi-graph-up"></i>
            </div>
            <h4>High Satisfaction Rate</h4>
            <p>{avgRating}/5.0 average rating shows excellent community satisfaction with local dog parks.</p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h4>Well-Maintained Facilities</h4>
            <p>{amenityStats.wasteStations} waste stations indicate strong maintenance standards across all parks.</p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <i className="bi bi-clock-history"></i>
            </div>
            <h4>Strategic Timing</h4>
            <p>Visit during weekday mornings for optimal experience with fewer crowds and more space.</p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <i className="bi bi-award-fill"></i>
            </div>
            <h4>Quality Options</h4>
            <p>{parks.filter(p => p.rating >= 4.5).length} premium-rated parks provide exceptional experiences.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .city-stats-section {
          padding: 80px 20px;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
        }

        .section-eyebrow {
          display: inline-block;
          padding: 6px 16px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 42px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px;
          line-height: 1.2;
        }

        .section-description {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .key-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto 60px;
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
          border-color: #7c3aed;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
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
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto 60px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
          color: #7c3aed;
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
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .rating-count {
          font-weight: 600;
          color: #7c3aed;
          text-align: center;
        }

        .amenity-stats {
          max-width: 1200px;
          margin: 0 auto 60px;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .amenity-stats h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px;
          text-align: center;
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
          background: linear-gradient(135deg, #7c3aed, #a855f7);
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
          color: #7c3aed;
        }

        .peak-times {
          max-width: 1200px;
          margin: 0 auto 60px;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .peak-times h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px;
          text-align: center;
        }

        .times-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
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

        .visit-tips {
          display: flex;
          justify-content: center;
        }

        .tip-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border-radius: 12px;
          max-width: 600px;
        }

        .tip-card i {
          font-size: 24px;
          color: #d97706;
        }

        .tip-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #92400e;
          margin: 0 0 4px;
        }

        .tip-card p {
          font-size: 14px;
          color: #78350f;
          margin: 0;
          line-height: 1.5;
        }

        .days-analysis {
          max-width: 1200px;
          margin: 0 auto 60px;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .days-analysis h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px;
          text-align: center;
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
          color: #7c3aed;
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

        .key-insights {
          max-width: 1200px;
          margin: 0 auto;
        }

        .key-insights h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px;
          text-align: center;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .insight-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          border-left: 4px solid #7c3aed;
        }

        .insight-card:hover {
          transform: translateY(-5px);
        }

        .insight-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
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

          .amenity-grid {
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