'use client';

import { DogPark } from '@/types/dog-park';
import Link from 'next/link';

interface ParkTypeGuideProps {
  parksByType: Record<string, DogPark[]>;
  cityName: string;
}

export default function ParkTypeGuide({ parksByType, cityName }: ParkTypeGuideProps) {
  const parkTypeDescriptions = {
    "Dog Park": {
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

  return (
    <section id="park-types-guide" className="park-types-guide-section">
      <div className="section-header">
        <span className="section-eyebrow">Educational Guide</span>
        <h2>Understanding Dog Park Types in {cityName}</h2>
        <p className="section-description">
          Learn about the different types of dog-friendly spaces available in {cityName} and find the perfect match for your dog&rsquo;s needs and personality.
        </p>
      </div>

      <div className="park-types-grid">
        {Object.entries(parksByType).map(([type, parks]) => {
          const typeInfo = parkTypeDescriptions[type as keyof typeof parkTypeDescriptions];
          if (!typeInfo || parks.length === 0) return null;

          return (
            <article key={type} className="park-type-card">
              <div className="park-type-header">
                <div className="park-type-icon">
                  {type === "Dog Park" && <i className="bi bi-tree-fill"></i>}
                  {type === "Indoor Dog Park" && <i className="bi bi-house-fill"></i>}
                  {type === "Dog-Friendly Establishment" && <i className="bi bi-shop-fill"></i>}
                </div>
                <div>
                  <h3>{type}</h3>
                  <span className="park-count">{parks.length} locations in {cityName}</span>
                </div>
              </div>

              <div className="park-type-content">
                <div className="park-type-description">
                  <h4>What is it?</h4>
                  <p>{typeInfo.description}</p>
                </div>

                <div className="park-type-features">
                  <h4>Key Features</h4>
                  <div className="features-list">
                    {typeInfo.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="park-type-best-for">
                  <h4>Best For</h4>
                  <div className="best-for-list">
                    {typeInfo.bestFor.map((item, index) => (
                      <span key={index} className="best-for-tag">{item}</span>
                    ))}
                  </div>
                </div>

                <div className="park-type-checklist">
                  <h4>What to Bring</h4>
                  <div className="checklist">
                    {typeInfo.whatToBring.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <input type="checkbox" id={`bring-${type}-${index}`} readOnly />
                        <label htmlFor={`bring-${type}-${index}`}>{item}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="park-type-tips">
                  <h4>Pro Tips</h4>
                  <ul>
                    {typeInfo.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="park-type-cta">
                  <Link href={`#${type.toLowerCase().replace(/\s+/g, '-')}-parks`} className="cta-button">
                    <i className="bi bi-geo-alt"></i>
                    Explore {type}s in {cityName}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="park-type-comparison">
        <h3>Quick Comparison</h3>
        <div className="comparison-table">
          <div className="comparison-header">
            <div>Feature</div>
            <div>Dog Park</div>
            <div>Indoor Dog Park</div>
            <div>Dog-Friendly Establishment</div>
          </div>

          <div className="comparison-row">
            <div>Weather Protection</div>
            <div><i className="bi bi-x-circle text-red-500"></i> Limited</div>
            <div><i className="bi bi-check-circle-fill text-green-500"></i> Full</div>
            <div><i className="bi bi-check-circle-fill text-green-500"></i> Varies</div>
          </div>

          <div className="comparison-row">
            <div>Cost</div>
            <div><i className="bi bi-currency-dollar text-green-500"></i> Free</div>
            <div><i className="bi bi-currency-dollar text-yellow-500"></i> Paid</div>
            <div><i className="bi bi-currency-dollar text-yellow-500"></i> Varies</div>
          </div>

          <div className="comparison-row">
            <div>Socialization</div>
            <div><i className="bi bi-star-fill text-yellow-500"></i> High</div>
            <div><i className="bi bi-star-fill text-yellow-500"></i> High</div>
            <div><i className="bi bi-star text-gray-400"></i> Limited</div>
          </div>

          <div className="comparison-row">
            <div>Training Environment</div>
            <div><i className="bi bi-star text-gray-400"></i> Basic</div>
            <div><i className="bi bi-star-fill text-yellow-500"></i> Excellent</div>
            <div><i className="bi bi-x-circle text-red-500"></i> Not suitable</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .park-types-guide-section {
          padding: 80px 20px;
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

        .park-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .park-type-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .park-type-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .park-type-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f3f4f6;
        }

        .park-type-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FF5722, #E64A19);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }

        .park-type-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .park-count {
          font-size: 14px;
          color: #FF5722;
          font-weight: 500;
        }

        .park-type-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 20px 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .park-type-description p {
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .features-list {
          display: grid;
          gap: 8px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4b5563;
        }

        .feature-item i {
          color: #10b981;
          font-size: 14px;
        }

        .best-for-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .best-for-tag {
          padding: 6px 12px;
          background: #ede9fe;
          color: #FF5722;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .checklist {
          display: grid;
          gap: 8px;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checklist-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #FF5722;
        }

        .checklist-item label {
          color: #4b5563;
          cursor: pointer;
          user-select: none;
        }

        .park-type-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }

        .park-type-tips li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #4b5563;
          line-height: 1.5;
        }

        .park-type-tips li::before {
          content: "💡";
          flex-shrink: 0;
        }

        .park-type-cta {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 2px solid #f3f4f6;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #FF5722, #E64A19);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .cta-button:hover {
          background: linear-gradient(135deg, #E64A19, #D84315);
          transform: translateY(-1px);
        }

        .park-type-comparison {
          max-width: 900px;
          margin: 60px auto 0;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .park-type-comparison h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 24px;
          text-align: center;
        }

        .comparison-table {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .comparison-header {
          display: grid;
          grid-template-columns: 200px repeat(3, 1fr);
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .comparison-header > div {
          padding: 16px;
          border-right: 1px solid #e5e7eb;
          text-align: center;
        }

        .comparison-header > div:last-child {
          border-right: none;
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 200px repeat(3, 1fr);
          border-top: 1px solid #e5e7eb;
        }

        .comparison-row > div {
          padding: 16px;
          border-right: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #4b5563;
        }

        .comparison-row > div:first-child {
          justify-content: flex-start;
          font-weight: 500;
        }

        .comparison-row > div:last-child {
          border-right: none;
        }

        @media (max-width: 768px) {
          .park-types-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .park-type-card {
            padding: 20px;
          }

          .comparison-table {
            font-size: 14px;
          }

          .comparison-header,
          .comparison-row {
            grid-template-columns: 150px repeat(3, 1fr);
          }

          .section-header h2 {
            font-size: 32px;
          }
        }
      `}</style>
    </section>
  );
}