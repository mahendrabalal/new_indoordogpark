'use client';

import React from 'react';
import Link from 'next/link';

interface CityGuideExpandableProps {
  cityName: string;
  title: string;
  guideUrl?: string;
  badge?: string;
  readTime: string;
  publishDate: string;
  description: string;
}

export default function CityGuideExpandable({
  cityName,
  title,
  guideUrl,
  badge = 'Featured Local Guide',
  readTime,
  publishDate,
  description,
}: CityGuideExpandableProps) {
  const targetUrl = guideUrl || '#park-directory';

  return (
    <section id="featured-guide" className="city-guide-spotlight-section">
      <div className="section-shell">
        <div className="city-guide-card">
          <div className="city-guide-badge-row">
            <span className="city-guide-pill">
              <i className="bi bi-journal-bookmark-fill" /> {badge}
            </span>
            <span className="city-guide-meta">
              <i className="bi bi-clock" /> {readTime} · {publishDate}
            </span>
          </div>

          <h2 className="city-guide-title">
            {guideUrl ? (
              <Link href={guideUrl}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>

          <p className="city-guide-description">{description}</p>

          <div className="city-guide-action-row">
            {guideUrl ? (
              <Link href={guideUrl} className="city-guide-btn">
                <span>Read Full {cityName} Editorial Guide</span>
                <i className="bi bi-arrow-right" />
              </Link>
            ) : (
              <a href="#park-directory" className="city-guide-btn">
                <span>Browse {cityName} Directory</span>
                <i className="bi bi-arrow-down" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
