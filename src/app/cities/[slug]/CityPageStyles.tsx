'use client';

export default function CityPageStyles() {
  return (
    <style jsx global>{`
        .city-page-layout {
          padding: 0 32px 72px 320px;
          background: #ffffff;
        }

        @media (min-width: 1440px) {
          .city-page-layout {
            padding-left: 320px;
            padding-right: 32px;
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
          background: linear-gradient(135deg, #FF5722, #E64A19);
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(255, 87, 34, 0.18);
        }

        @media (max-width: 1024px) {
          .mobile-toc-button {
            display: block;
          }
        }

        .section-shell {
          width: 100%;
          max-width: 1200px;
          margin: 0;
          padding: 0 16px;
        }

        .city-hero-section {
          position: relative;
          padding: 0 0 64px;
          background: #ffffff;
          overflow: hidden;
        }

        .city-hero-section.no-image {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 80px 0 100px;
        }

        .city-hero-section.no-image::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(#FF5722 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          opacity: 0.03;
          pointer-events: none;
        }

        .city-hero-shell {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 64px;
          align-items: start;
        }

        .city-hero-section.no-image .city-hero-shell {
          grid-template-columns: 1fr;
          max-width: 800px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .city-hero-shell {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .city-hero-visual {
            position: relative;
            top: 0;
          }
        }

        .hero-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .city-hero-section.no-image .hero-breadcrumbs {
          justify-content: center;
        }

        .hero-breadcrumbs a {
          color: inherit;
          text-decoration: none;
        }

        .hero-eyebrow {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #FF5722;
          margin-bottom: 8px;
          font-weight: 800;
        }

        .city-hero-copy h1 {
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #0f172a;
          margin-bottom: 8px;
          font-weight: 800;
        }

        .hero-description {
          font-size: 18px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 20px;
          max-width: 60ch;
        }

        .city-hero-section.no-image .hero-description {
          margin-left: auto;
          margin-right: auto;
        }

        .city-rich-description {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rich-description-paragraph {
          font-size: 16px;
          color: #4b5563;
          line-height: 1.75;
          margin: 0;
          max-width: 70ch;
        }

        .rich-link {
          color: #FF5722;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 87, 34, 0.2);
          transition: all 0.2s ease;
        }

        .rich-link:hover {
          color: #E64A19;
          border-bottom-color: #E64A19;
        }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-breadcrumbs, .hero-eyebrow, .city-hero-copy h1, .hero-description, 
        .hero-chip-row, .hero-metrics, .hero-cta-row, .hero-footnotes {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .hero-breadcrumbs { animation-delay: 0.1s; }
        .hero-eyebrow { animation-delay: 0.15s; }
        .city-hero-copy h1 { animation-delay: 0.2s; }
        .hero-description { animation-delay: 0.25s; }
        .hero-chip-row { animation-delay: 0.3s; }
        .hero-metrics { animation-delay: 0.35s; }
        .city-hero-visual { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.3s; }


        .hero-chip-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .city-hero-section.no-image .hero-chip-row {
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-chip {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          padding: 16px 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
          border-color: #e2e8f0;
        }
        
        .city-hero-section.no-image .hero-chip {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
        }

        .chip-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
        }

        .chip-label {
          font-size: 12px;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .city-hero-section.no-image .hero-metrics {
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-metric {
          background: #0f172a;
          color: white;
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .hero-metric:hover {
          transform: scale(1.02);
        }

        .hero-metric::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 87, 34, 0.1), transparent 70%);
          opacity: 0.5;
          pointer-events: none;
        }

        .hero-metric span {
          position: relative;
          z-index: 1;
        }

        .metric-label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.8);
        }

        .metric-value {
          display: block;
          font-size: 34px;
          font-weight: 700;
          margin: 6px 0 4px;
        }

        .metric-caption {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        .hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .city-hero-section.no-image .hero-cta-row {
          justify-content: center;
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
          background: #FF5722;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(255, 87, 34, 0.4);
        }

        .hero-cta.primary:hover {
          background: #E64A19;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -5px rgba(255, 87, 34, 0.5);
        }

        .hero-cta.ghost {
          background: white;
          color: #2c3e50;
          border: 1px solid #e2e8f0;
        }

        .hero-cta.text-link {
          background: transparent;
          color: #FF5722;
          padding-left: 0;
        }

        .hero-footnotes {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 14px;
          color: #64748b;
        }

        .city-hero-section.no-image .hero-footnotes {
          justify-content: center;
        }

        .hero-footnotes i {
          color: #FF5722;
          margin-right: 6px;
        }

        .city-hero-visual {
          position: sticky;
          top: 100px;
          align-self: start;
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
          color: #FF5722;
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
          background: rgba(255, 87, 34, 0.1);
          color: #FF5722;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .section-heading h2 {
          font-size: clamp(32px, 3.5vw, 44px);
          color: #0f172a;
          margin-bottom: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .section-heading p {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          max-width: 70ch;
          margin: 0;
        }

        .city-premium-section {
          padding: 48px 0 16px;
        }

        .city-premium-header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .city-premium-header p {
          color: #666;
        }

        .city-premium-header-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (max-width: 900px) {
          .city-premium-header {
            flex-direction: column;
          }

          .city-premium-header-actions {
            width: 100%;
          }
        }

        .city-premium-values {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .city-premium-value-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .city-premium-value-card h4 {
          margin: 8px 0 6px;
          font-size: 16px;
          color: #2c3e50;
        }

        .city-premium-value-card p {
          margin: 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .city-premium-value-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 87, 34, 0.1);
          color: #FF5722;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .city-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .city-premium-grid.city-premium-grid-single {
          max-width: 720px;
          margin: 0 auto;
        }

        .city-premium-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 16px;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }

        .city-premium-media {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          height: 160px;
        }

        .city-premium-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.9);
          color: #d97706;
          font-weight: 600;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.08em;
        }

        .city-premium-copy h3 {
          margin: 6px 0;
          font-size: 20px;
          color: #2c3e50;
        }

        .city-premium-eyebrow {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5722;
          font-weight: 600;
        }

        .city-premium-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .city-premium-description {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .city-premium-card-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .city-premium-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          font-weight: 600;
          text-decoration: none;
          width: fit-content;
        }

        .city-premium-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 14px;
          color: #666;
        }

        .city-premium-meta a {
          color: #FF5722;
          text-decoration: none;
        }

        .city-premium-empty {
          margin-top: 20px;
          border: 2px dashed #cbd5f5;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.12));
        }

        .city-premium-empty h3 {
          margin: 0;
          font-size: 20px;
          color: #1e1b4b;
        }

        .city-premium-empty p {
          margin: 6px 0 0;
          color: #4338ca;
        }

        .city-premium-error {
          margin-top: 16px;
          font-size: 14px;
          color: #b45309;
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
          background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
          color: white;
          border: none;
        }

        .insight-tag {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #FF5722;
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
          color: #666;
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
          background: #fff7f3;
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
          color: #FF5722;
        }

        .collection-card h3 {
          margin: 0;
          font-size: 24px;
        }

        .collection-card p {
          color: #666;
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
          color: #FF5722;
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
          background: #2c3e50;
          color: rgba(255, 255, 255, 0.9);
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
          color: #666;
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
          color: #777;
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
          background: rgba(255, 87, 34, 0.1);
          color: #FF5722;
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
          color: #666;
          line-height: 1.6;
        }

        .park-directory-section {
          background: #f9fafb;
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
          color: #666;
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
          background: #2c3e50;
          color: white;
          border-radius: 999px;
          padding: 6px 14px;
          font-weight: 700;
        }

        /* Grid handled by global CSS */

        .directory-empty {
          text-align: center;
          color: #94a3b8;
          padding: 40px 0;
        }

        .city-faq-section {
          background: white;
        }

        .related-resources-section {
          background: #2c3e50;
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
            padding-top: 72px;
            padding-left: 12px;
            padding-right: 12px;
            padding-bottom: 32px;
          }

          .section-shell {
            padding: 0 8px;
          }

          .city-hero-section {
            padding: 12px 0 32px;
          }

          .city-hero-shell {
            gap: 24px;
          }

          .hero-breadcrumbs {
            font-size: 11px;
            margin-bottom: 8px;
            gap: 6px;
          }

          .hero-eyebrow {
            font-size: 10px;
            margin-bottom: 8px;
            padding: 4px 10px;
          }

          .city-hero-copy h1 {
            font-size: 26px;
            margin-bottom: 10px;
            line-height: 1.2;
          }

          .hero-description {
            font-size: 14px;
            margin-bottom: 16px;
            line-height: 1.5;
          }

          .hero-chip-row {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 16px;
          }

          .hero-chip {
            padding: 8px 10px;
          }

          .chip-value {
            font-size: 16px;
          }

          .chip-label {
            font-size: 10px;
          }

          .hero-metrics {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 16px;
          }

          .hero-metric {
            padding: 14px;
          }

          .metric-value {
            font-size: 26px;
            margin: 4px 0 2px;
          }

          .metric-label,
          .metric-caption {
            font-size: 11px;
          }

          .hero-cta-row {
            flex-direction: column;
            gap: 8px;
            margin-bottom: 16px;
          }

          .hero-cta {
            width: 100%;
            justify-content: center;
            padding: 12px 18px;
            font-size: 14px;
          }

          .hero-footnotes {
            flex-direction: column;
            gap: 6px;
            font-size: 11px;
            margin-top: 0;
          }

          .hero-image-card {
            min-height: 280px;
            border-radius: 20px;
            margin-top: 16px;
          }

          .section-heading {
            text-align: center;
            margin-bottom: 20px;
          }

          .section-heading h2 {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .section-heading p {
            font-size: 13px;
            margin: 0 auto;
          }

          .section-eyebrow {
            font-size: 10px;
            padding: 4px 10px;
            margin-bottom: 8px;
          }

          .city-insights-section,
          .park-collections-section,
          .map-experience-section,
          .planning-essentials-section,
          .park-directory-section,
          .city-faq-section,
          .related-resources-section {
            padding: 32px 0;
          }

          .insights-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 24px;
          }

          .insight-card {
            padding: 16px;
          }

          .insight-card h3 {
            font-size: 24px;
            margin: 8px 0;
          }

          .insight-card p {
            font-size: 13px;
          }

          .collection-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 24px;
          }

          .collection-card {
            padding: 16px;
          }

          .collection-card h3 {
            font-size: 18px;
          }

          .map-grid {
            gap: 16px;
          }

          .map-panel {
            min-height: 280px;
            border-radius: 16px;
          }

          .map-sidebar-card {
            padding: 14px;
          }

          .map-chip-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .planning-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .planning-card {
            padding: 16px;
          }

          .planning-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
            margin-bottom: 10px;
          }

          .directory-category {
            padding: 16px 12px;
            border-radius: 16px;
            margin-bottom: 24px;
          }

          .directory-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            padding-bottom: 16px;
            margin-bottom: 16px;
          }

          .directory-header h3 {
            font-size: 18px;
            margin: 0;
          }

          .directory-header p {
            font-size: 13px;
            margin: 0;
          }

          .directory-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .category-chip-row {
            gap: 6px;
            margin-bottom: 20px;
          }

          .category-chip-row button {
            padding: 6px 12px;
            font-size: 13px;
          }

          .resources-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .resource-card {
            padding: 16px;
          }

          .city-premium-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .city-premium-card {
            padding: 14px;
          }

          .city-premium-media {
            height: 120px;
          }

          .hero-meta-card {
            position: static;
            width: 100%;
            margin-top: 12px;
          }
        }

        @media (max-width: 480px) {
          .city-page-layout {
            padding-top: 64px;
            padding-left: 10px;
            padding-right: 10px;
            padding-bottom: 24px;
          }

          .section-shell {
            padding: 0 6px;
          }

          .city-hero-section {
            padding: 8px 0 24px;
          }

          .city-hero-shell {
            gap: 20px;
          }

          .hero-breadcrumbs {
            font-size: 10px;
            margin-bottom: 6px;
          }

          .city-hero-copy h1 {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .hero-description {
            font-size: 13px;
            margin-bottom: 12px;
          }

          .hero-chip-row {
            grid-template-columns: 1fr;
            gap: 6px;
            margin-bottom: 12px;
          }

          .hero-chip {
            padding: 10px;
          }

          .chip-value {
            font-size: 15px;
          }

          .chip-label {
            font-size: 9px;
          }

          .hero-metrics {
            gap: 8px;
            margin-bottom: 12px;
          }

          .hero-metric {
            padding: 12px;
          }

          .metric-value {
            font-size: 22px;
          }

          .hero-cta-row {
            gap: 6px;
            margin-bottom: 12px;
          }

          .hero-cta {
            padding: 11px 16px;
            font-size: 13px;
          }

          .hero-footnotes {
            gap: 4px;
            font-size: 10px;
          }

          .hero-image-card {
            min-height: 240px;
            border-radius: 16px;
            margin-top: 12px;
          }

          .section-heading {
            margin-bottom: 16px;
          }

          .section-heading h2 {
            font-size: 20px;
            margin-bottom: 6px;
          }

          .section-heading p {
            font-size: 12px;
          }

          .city-insights-section,
          .park-collections-section,
          .map-experience-section,
          .planning-essentials-section,
          .park-directory-section,
          .city-faq-section,
          .related-resources-section {
            padding: 24px 0;
          }

          .insights-grid {
            gap: 10px;
            margin-bottom: 20px;
          }

          .insight-card {
            padding: 14px;
          }

          .insight-card h3 {
            font-size: 22px;
            margin: 6px 0;
          }

          .insight-card p {
            font-size: 12px;
          }

          .collection-grid {
            gap: 10px;
            margin-bottom: 20px;
          }

          .collection-card {
            padding: 14px;
          }

          .collection-card h3 {
            font-size: 16px;
          }

          .map-panel {
            min-height: 240px;
          }

          .map-sidebar-card {
            padding: 12px;
          }

          .planning-grid {
            gap: 10px;
          }

          .planning-card {
            padding: 14px;
          }

          .directory-category {
            padding: 14px 10px;
            margin-bottom: 20px;
          }

          .directory-header {
            gap: 8px;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }

          .directory-header h3 {
            font-size: 16px;
          }

          .directory-grid {
            gap: 10px;
          }

          .category-chip-row {
            gap: 5px;
            margin-bottom: 16px;
          }

          .category-chip-row button {
            padding: 5px 10px;
            font-size: 12px;
          }

          .resources-grid {
            gap: 10px;
          }

          .resource-card {
            padding: 14px;
          }
        }
    `}</style>
  );
}

