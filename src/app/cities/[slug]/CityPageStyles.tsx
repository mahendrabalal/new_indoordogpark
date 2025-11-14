'use client';

export default function CityPageStyles() {
  return (
    <style jsx global>{`
        .city-page-layout {
          padding: 32px 32px 72px 320px;
          background: linear-gradient(180deg, #faf7ff 0%, #ffffff 40%, #f6f7fb 100%);
        }

        @media (min-width: 1440px) {
          .city-page-layout {
            padding-left: 360px;
            padding-right: 64px;
          }
        }

        @media (max-width: 1200px) {
          .city-page-layout {
            padding-left: 280px;
          }
        }

        @media (max-width: 1024px) {
          .city-page-layout {
            padding: 68px 20px 64px;
          }
        }

        .mobile-toc-button {
          display: none;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 50;
        }

        .mobile-toc-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
        }

        @media (max-width: 1024px) {
          .mobile-toc-button {
            display: block;
          }
        }

        .section-shell {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .city-hero-section {
          position: relative;
          padding: 24px 0 72px;
        }

        .city-hero-shell {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 48px;
        }

        @media (max-width: 900px) {
          .city-hero-shell {
            grid-template-columns: 1fr;
          }
        }

        .hero-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .hero-breadcrumbs a {
          color: inherit;
          text-decoration: none;
        }

        .hero-eyebrow {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #a855f7;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .city-hero-copy h1 {
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .hero-description {
          font-size: 18px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .hero-chip-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 32px;
        }

        .hero-chip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 15px 40px rgba(15, 23, 42, 0.05);
        }

        .chip-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .chip-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .hero-metric {
          background: #111827;
          color: white;
          border-radius: 16px;
          padding: 18px;
          position: relative;
          overflow: hidden;
        }

        .hero-metric::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.3), transparent);
          opacity: 0.4;
        }

        .hero-metric span {
          position: relative;
          z-index: 1;
        }

        .metric-label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #cbd5f5;
        }

        .metric-value {
          display: block;
          font-size: 34px;
          font-weight: 700;
          margin: 6px 0 4px;
        }

        .metric-caption {
          font-size: 12px;
          color: #cbd5f5;
        }

        .hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 999px;
          padding: 12px 22px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-cta.primary {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          box-shadow: 0 15px 30px rgba(124, 58, 237, 0.2);
        }

        .hero-cta.ghost {
          background: white;
          color: #111827;
          border: 1px solid #e2e8f0;
        }

        .hero-cta.text-link {
          background: transparent;
          color: #7c3aed;
          padding-left: 0;
        }

        .hero-footnotes {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          color: #475569;
        }

        .hero-footnotes i {
          color: #7c3aed;
          margin-right: 6px;
        }

        .city-hero-visual {
          position: relative;
        }

        .hero-image-card {
          position: relative;
          min-height: 480px;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.2);
        }

        .hero-image-card img {
          object-fit: cover;
        }

        .hero-image-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.8));
        }

        .hero-image-pill {
          position: absolute;
          top: 20px;
          left: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.9);
          color: #111827;
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 600;
        }

        .hero-featured-card {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 18px;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
        }

        .hero-featured-card p {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 11px;
          color: #a855f7;
          margin-bottom: 4px;
        }

        .hero-featured-card h4 {
          margin: 0;
          font-size: 20px;
          color: #111827;
        }

        .hero-featured-card span {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #475569;
        }

        .hero-featured-card button {
          margin-top: 12px;
          border: none;
          background: #111827;
          color: white;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 13px;
          cursor: pointer;
        }

        .hero-meta-card {
          position: absolute;
          top: 20px;
          right: -20px;
          background: white;
          border-radius: 18px;
          padding: 16px 20px;
          width: 220px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }

        .meta-label {
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #94a3b8;
        }

        .meta-value {
          font-size: 18px;
          font-weight: 700;
          margin: 6px 0;
        }

        .meta-caption {
          font-size: 12px;
          color: #64748b;
        }

        .section-heading {
          max-width: 960px;
          margin: 0 auto 32px;
          text-align: left;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .section-heading h2 {
          font-size: clamp(28px, 3vw, 40px);
          color: #0f172a;
          margin-bottom: 12px;
        }

        .section-heading p {
          color: #475569;
          font-size: 18px;
          line-height: 1.6;
          max-width: 70ch;
          margin: 0;
        }

        .city-insights-section,
        .park-collections-section,
        .map-experience-section,
        .planning-essentials-section,
        .park-directory-section,
        .city-faq-section,
        .related-resources-section {
          padding: 56px 0;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .insight-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
        }

        .insight-card.accent {
          background: linear-gradient(135deg, #111827, #312e81);
          color: white;
          border: none;
        }

        .insight-tag {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #a855f7;
        }

        .insight-card.accent .insight-tag {
          color: rgba(255, 255, 255, 0.7);
        }

        .insight-card h3 {
          font-size: 32px;
          margin: 12px 0;
        }

        .insight-card p {
          font-size: 15px;
          color: inherit;
        }

        .insight-card:not(.accent) p {
          color: #475569;
        }

        .insight-footer {
          margin-top: 16px;
          font-size: 13px;
          display: inline-flex;
          gap: 6px;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
        }

        .park-collections-section {
          background: #f7f0ff;
        }

        .collection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }

        .collection-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid rgba(124, 58, 237, 0.12);
          box-shadow: 0 20px 45px rgba(124, 58, 237, 0.08);
        }

        .collection-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7c3aed;
        }

        .collection-card h3 {
          margin: 0;
          font-size: 24px;
        }

        .collection-card p {
          color: #475569;
          flex: 1;
        }

        .collection-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }

        .collection-card-footer button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: transparent;
          color: #7c3aed;
          font-weight: 600;
          cursor: pointer;
        }

        .map-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
        }

        @media (max-width: 960px) {
          .map-grid {
            grid-template-columns: 1fr;
          }
        }

        .map-panel {
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 35px 60px rgba(15, 23, 42, 0.15);
          min-height: 420px;
        }

        .map-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .map-sidebar-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
        }

        .map-sidebar-card.muted {
          background: #0f172a;
          color: #cbd5f5;
        }

        .map-sidebar-card h3 {
          margin-top: 0;
          margin-bottom: 12px;
        }

        .map-chip-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .map-chip-grid button {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }

        .mini-park-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mini-park-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .mini-park-card p {
          margin: 0;
          font-weight: 600;
        }

        .mini-park-card span {
          font-size: 12px;
          color: #64748b;
        }

        .planning-essentials-section {
          background: #fff;
        }

        .planning-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .planning-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
        }

        .planning-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .planning-card h3 {
          margin-top: 0;
        }

        .planning-card ul {
          padding-left: 18px;
          color: #475569;
          line-height: 1.6;
        }

        .park-directory-section {
          background: #f8f8ff;
        }

        .category-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .category-chip-row button {
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 999px;
          padding: 8px 18px;
          font-weight: 600;
          cursor: pointer;
          color: #475569;
        }

        .directory-category {
          background: white;
          border-radius: 28px;
          padding: 32px;
          margin-bottom: 40px;
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08);
        }

        @media (max-width: 640px) {
          .directory-category {
            padding: 20px;
          }
        }

        .directory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }

        .directory-count {
          background: #111827;
          color: white;
          border-radius: 999px;
          padding: 6px 14px;
          font-weight: 700;
        }

        .directory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .directory-empty {
          text-align: center;
          color: #94a3b8;
          padding: 40px 0;
        }

        .city-faq-section {
          background: white;
        }

        .related-resources-section {
          background: #0f172a;
          color: white;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .resource-card {
          background: rgba(255, 255, 255, 0.08);
          padding: 24px;
          border-radius: 20px;
          text-decoration: none;
          color: inherit;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, border 0.2s ease;
        }

        .resource-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .resource-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .city-page-layout {
            padding-top: 80px;
          }

          .section-heading {
            text-align: center;
          }

          .section-heading p {
            margin: 0 auto;
          }

          .hero-metrics {
            grid-template-columns: 1fr;
          }

          .hero-chip-row {
            grid-template-columns: 1fr 1fr;
          }

          .directory-grid {
            grid-template-columns: 1fr;
          }
        }
    `}</style>
  );
}

