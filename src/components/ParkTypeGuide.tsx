'use client';

import { DogPark } from '@/types/dog-park';
import Link from 'next/link';
import { useState } from 'react';

interface ParkTypeGuideProps {
  parksByType: Record<string, DogPark[]>;
}

export default function ParkTypeGuide({ parksByType }: ParkTypeGuideProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const parkTypeDescriptions = {
    "Dog Park": {
      shortDescription: "Traditional outdoor off‑leash areas and fenced runs, optimized for everyday exercise.",
      description: "Traditional outdoor off-leash areas where dogs can run freely and socialize with other dogs.",
      features: ["Fenced enclosures", "Open grass areas", "Agility equipment", "Water stations", "Waste disposal"],
      bestFor: ["High-energy dogs", "Social dogs", "Owners looking for free exercise options"],
      whatToBring: ["Leash (for entering/exiting)", "Water bowl", "Waste bags", "Toys", "Treats"],
      tips: [
        "Check park rules before visiting",
        "Keep your dog's vaccinations up to date",
        "Supervise your dog at all times",
        "Clean up after your dog immediately",
        "Respect other dogs and owners"
      ]
    },
    "Indoor Dog Park": {
      shortDescription: "Climate-controlled facilities perfect for year-round play regardless of weather.",
      description: "Climate-controlled indoor facilities perfect for year-round exercise regardless of weather conditions.",
      features: ["Climate control", "Specialized flooring", "Agility courses", "Training areas", "Air filtration"],
      bestFor: ["Small dogs", "Dogs with weather sensitivities", "Training and socialization", "Extreme weather days"],
      whatToBring: ["Proof of vaccinations", "Indoor toys", "Treats for training", "Clean towel"],
      tips: [
        "Many indoor parks require membership or advance booking",
        "Check vaccination requirements",
        "Bring indoor-safe toys",
        "Consider your dog's comfort with enclosed spaces",
        "Follow facility-specific rules and guidelines"
      ]
    },
    "Dog-Friendly Establishment": {
      shortDescription: "Restaurants, pet stores, and beaches that welcome your four-legged companion.",
      description: "Businesses that welcome dogs, such as restaurants with patios, pet stores, and dog-friendly beaches.",
      features: ["Outdoor seating", "Water bowls", "Dog treats", "Pet products", "Social atmosphere"],
      bestFor: ["Casual outings", "Dining with pets", "Shopping trips", "Social experiences"],
      whatToBring: ["Leash", "Portable water bowl", "Calm temperament", "Training treats"],
      tips: [
        "Call ahead to confirm pet policy",
        "Keep your dog leashed at all times",
        "Ensure your dog is well-behaved in public",
        "Respect other customers",
        "Be prepared to leave if your dog becomes anxious"
      ]
    }
  };

  const toggleExpand = (type: string) => {
    setExpandedType(expandedType === type ? null : type);
  };

  return (
    <section id="park-types-guide" className="park-types-guide-section">


      <div className="collection-cards-grid">
        {Object.entries(parksByType).map(([type, parks]) => {
          const typeInfo = parkTypeDescriptions[type as keyof typeof parkTypeDescriptions];
          if (!typeInfo || parks.length === 0) return null;

          const avgRating = parks.length
            ? (parks.reduce((sum, park) => sum + (park.rating || 0), 0) / parks.length).toFixed(1)
            : '—';
          const isExpanded = expandedType === type;

          return (
            <article key={type} className={`collection-guide-card ${isExpanded ? 'expanded' : ''}`}>
              {/* Collection Header */}
              <div className="card-header">
                <div className="card-header-top">
                  <span className="spots-pill">{parks.length} spots</span>
                  <div className="card-rating">
                    <i className="bi bi-star-fill"></i>
                    <span>{avgRating} avg</span>
                  </div>
                </div>
                <div className="card-type-info">
                  <div className="type-icon">
                    {type === "Dog Park" && <i className="bi bi-tree-fill"></i>}
                    {type === "Indoor Dog Park" && <i className="bi bi-house-fill"></i>}
                    {type === "Dog-Friendly Establishment" && <i className="bi bi-shop-fill"></i>}
                  </div>
                  <div>
                    <h3>{type}</h3>
                    <p className="short-description">{typeInfo.shortDescription}</p>
                  </div>
                </div>
              </div>

              {/* Expandable Guide Content */}
              <div className={`guide-content ${isExpanded ? 'show' : ''}`}>
                <div className="guide-section">
                  <h4>What is it?</h4>
                  <p>{typeInfo.description}</p>
                </div>

                <div className="guide-section">
                  <h4>Key Features</h4>
                  <div className="features-chips">
                    {typeInfo.features.map((feature, index) => (
                      <span key={index} className="feature-chip">
                        <i className="bi bi-check-circle-fill"></i>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="guide-section">
                  <h4>Best For</h4>
                  <div className="best-for-list">
                    {typeInfo.bestFor.map((item, index) => (
                      <span key={index} className="best-for-tag">{item}</span>
                    ))}
                  </div>
                </div>

                <div className="guide-section">
                  <h4>What to Bring</h4>
                  <div className="bring-list">
                    {typeInfo.whatToBring.map((item, index) => (
                      <div key={index} className="bring-item">
                        <i className="bi bi-bag-check"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="guide-section">
                  <h4>Pro Tips</h4>
                  <ul className="tips-list">
                    {typeInfo.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <button
                  className="expand-toggle"
                  onClick={() => toggleExpand(type)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <>
                      <span>Hide guide</span>
                      <i className="bi bi-chevron-up"></i>
                    </>
                  ) : (
                    <>
                      <span>View guide</span>
                      <i className="bi bi-chevron-down"></i>
                    </>
                  )}
                </button>
                <Link href={`#${type.toLowerCase().replace(/\s+/g, '-')}-parks`} className="jump-link">
                  Jump to list
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .park-types-guide-section {
          padding: 0;
          background: transparent;
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
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
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .collection-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
          margin-top: 0;
        }

        .collection-guide-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .collection-guide-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .collection-guide-card.expanded {
          grid-row: span 2;
          border-color: #6366f1;
          box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.15);
        }

        /* Card Header */
        .card-header {
          padding: 24px;
          background: #ffffff;
          position: relative;
          z-index: 2;
        }

        .card-header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .spots-pill {
          background: #f1f5f9;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 999px;
          letter-spacing: 0.02em;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: #0f172a;
          font-size: 14px;
        }

        .card-rating i {
          color: #fbbf24;
        }

        .card-type-info {
          display: flex;
          gap: 16px;
        }

        .type-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: #eff6ff;
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .collection-guide-card:nth-child(2) .type-icon {
          background: #fdf2f8;
          color: #ec4899;
        }

        .collection-guide-card:nth-child(3) .type-icon {
          background: #f0fdf4;
          color: #22c55e;
        }

        .card-type-info h3 {
          margin: 0 0 6px;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
        }

        .short-description {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
        }

        /* Expanded Content */
        .guide-content {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .guide-content.show {
          max-height: 800px; /* Large enough to fit content */
          opacity: 1;
          padding: 24px;
        }

        .guide-section {
          margin-bottom: 24px;
        }

        .guide-section:last-child {
          margin-bottom: 0;
        }

        .guide-section h4 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .guide-section p {
          font-size: 15px;
          color: #334155;
          line-height: 1.6;
          margin: 0;
        }

        /* Feature Chips */
        .features-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          color: #475569;
          font-weight: 500;
        }

        .feature-chip i {
          color: #10b981;
        }

        /* Best For Tags */
        .best-for-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .best-for-tag {
          padding: 4px 10px;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
        }

        /* What to Bring */
        .bring-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }

        .bring-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #475569;
        }

        .bring-item i {
          color: #6366f1;
        }

        /* Tips List */
        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .tips-list li {
          position: relative;
          padding-left: 16px;
          font-size: 14px;
          color: #475569;
          line-height: 1.5;
        }

        .tips-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #cbd5e1;
          font-weight: bold;
        }

        /* Card Footer */
        .card-footer {
          padding: 16px 24px;
          border-top: 1px solid #f1f5f9;
          background: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .expand-toggle {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .expand-toggle:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .jump-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .jump-link:hover {
          background: #eff6ff;
        }

        @media (max-width: 768px) {
          .collection-cards-grid {
            grid-template-columns: 1fr;
          }
          
          .card-header {
            padding: 20px;
          }

          .guide-content.show {
            max-height: 1200px;
          }
        }
      `}</style>
    </section>
  );
}