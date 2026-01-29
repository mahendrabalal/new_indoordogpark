'use client';

export default function CitiesPageStyles() {
  return (
    <style jsx global>{`
      .cities-page-layout {
        padding: 32px 32px 72px;
        background: #ffffff;
      }

      @media (max-width: 1024px) {
        .cities-page-layout {
          padding: 68px 20px 64px;
        }
      }

      .section-shell {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }

      .cities-hero {
        padding: 48px 0 24px;
      }

      .state-section {
        padding: 48px 0;
      }

      .state-section.alt {
        background: #fff7f3;
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
        font-size: clamp(26px, 2.5vw, 36px);
        color: #2c3e50;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.2;
      }

      .section-heading p {
        color: #666;
        font-size: 16px;
        line-height: 1.6;
        max-width: 70ch;
        margin: 0;
      }

      .cities-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }



      .cta-band {
        border-radius: 28px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.15));
        border: 1px solid rgba(124, 58, 237, 0.1);
        padding: 40px;
        display: flex;
        gap: 24px;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .cta-band h3 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #1e1b4b;
      }

      .cta-band p {
        margin: 8px 0 0;
        color: #4338ca;
        font-size: 16px;
      }

      .hero-cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 999px;
        padding: 14px 28px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
      }

      .hero-cta.primary {
        background: #FF5722;
        color: white;
        box-shadow: 0 10px 20px rgba(255, 87, 34, 0.2);
      }

      .hero-cta.primary:hover {
        background: #e64a19;
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .cta-band {
          text-align: center;
          justify-content: center;
        }
        
        .directory-columns {
          column-count: 1 !important;
        }
      }

      /* New Directory Styles */
      .city-directory-container {
        margin-top: 24px;
      }

      .search-container {
        margin-bottom: 40px;
        max-width: 600px;
      }

      .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: 16px;
        color: #94a3b8;
        font-size: 18px;
        pointer-events: none;
      }

      .directory-search-input {
        width: 100%;
        padding: 14px 48px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        font-size: 16px;
        color: #1e293b;
        background: white;
        transition: all 0.2s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      .directory-search-input:focus {
        outline: none;
        border-color: #FF5722;
        box-shadow: 0 0 0 4px rgba(255, 87, 34, 0.1);
      }

      .clear-search-btn {
        position: absolute;
        right: 16px;
        background: none;
        border: none;
        color: #cbd5e1;
        cursor: pointer;
        padding: 0;
        font-size: 16px;
        transition: color 0.2s;
      }

      .clear-search-btn:hover {
        color: #94a3b8;
      }

      .no-results {
        text-align: center;
        padding: 48px 0;
        color: #64748b;
        background: white;
        border-radius: 12px;
        border: 1px dashed #e2e8f0;
      }

      .reset-search-link {
        display: inline-block;
        margin-top: 12px;
        color: #FF5722;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 600;
        text-decoration: underline;
      }

      /* Masonry Layout with CSS Columns */
      .directory-columns {
        column-count: 5;
        column-gap: 32px;
      }
      
      @media (max-width: 1200px) {
        .directory-columns {
          column-count: 3;
        }
      }
      
      @media (max-width: 900px) {
        .directory-columns {
          column-count: 2;
        }
      }

      .state-block {
        break-inside: avoid; /* Prevent splitting across columns */
        margin-bottom: 40px;
        display: inline-block; /* Helps with some browser column rendering quirks */
        width: 100%;
      }

      .state-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #e2e8f0;
        font-size: 15px; /* Slightly smaller but bolder */
        font-weight: 700;
        color: #334155;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .state-link {
        color: inherit;
        text-decoration: none;
      }
      
      .state-link:hover {
        color: #FF5722;
      }

      .state-count-badge {
        font-size: 11px;
        background: #f1f5f9;
        color: #64748b;
        padding: 2px 8px;
        border-radius: 99px;
        font-weight: 600;
      }

      .city-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .city-list li {
        margin-bottom: 6px; /* Tighter spacing */
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        font-size: 15px;
        line-height: 1.4;
      }

      .city-link {
        color: #475569;
        text-decoration: none;
        transition: color 0.15s;
        flex: 1;
      }

      .city-link:hover {
        color: #FF5722;
        text-decoration: none; /* Clean look */
      }

      .count-pill {
        font-size: 11px;
        color: #94a3b8;
        margin-left: 8px;
      }
    `}</style>
  );
}
