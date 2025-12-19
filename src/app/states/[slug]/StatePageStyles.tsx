'use client';

export default function StatePageStyles() {
  return (
    <style jsx global>{`
      .state-page-layout {
        padding: 32px 32px 72px;
        background: #ffffff;
      }

      @media (max-width: 1024px) {
        .state-page-layout {
          padding: 68px 20px 64px;
        }
      }

      .section-shell {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }

      .state-hero-section {
        position: relative;
        padding: 24px 0 72px;
      }

      .state-hero-shell {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
        gap: 48px;
      }

      @media (max-width: 900px) {
        .state-hero-shell {
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
        color: #FF5722;
        margin-bottom: 12px;
        font-weight: 700;
      }

      .state-hero-copy h1 {
        font-size: clamp(28px, 3.4vw, 48px);
        line-height: 1.1;
        color: #2c3e50;
        margin-bottom: 16px;
      }

      .hero-description {
        font-size: 16px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 28px;
      }

      .hero-chip-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        margin-bottom: 28px;
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
        color: #2c3e50;
      }

      .chip-label {
        font-size: 12px;
        color: #777;
        text-transform: uppercase;
        letter-spacing: 0.08em;
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
        text-decoration: none;
      }

      .hero-cta.primary {
        background: #FF5722;
        color: white;
        box-shadow: 0 15px 30px rgba(255, 87, 34, 0.2);
      }

      .hero-cta.ghost {
        background: white;
        color: #2c3e50;
        border: 1px solid #e2e8f0;
      }

      .hero-footnotes {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 13px;
        color: #666;
      }

      .hero-footnotes i {
        color: #FF5722;
        margin-right: 6px;
      }

      .state-hero-visual {
        position: relative;
      }

      .hero-image-card {
        position: relative;
        min-height: 420px;
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
        gap: 6px;
        font-size: 13px;
        color: #475569;
        margin-top: 8px;
      }

      .state-section {
        padding: 56px 0;
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
        font-size: clamp(28px, 3vw, 40px);
        color: #2c3e50;
        margin-bottom: 12px;
      }

      .section-heading p {
        color: #666;
        font-size: 16px;
        line-height: 1.6;
        max-width: 70ch;
        margin: 0;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
      }

      .feature-card {
        background: white;
        border-radius: 20px;
        padding: 24px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
      }

      .feature-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: rgba(255, 87, 34, 0.1);
        color: #FF5722;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        margin-bottom: 12px;
      }

      .feature-card h3 {
        margin: 0 0 8px;
        font-size: 18px;
        color: #2c3e50;
      }

      .feature-card p {
        margin: 0;
        color: #666;
        line-height: 1.6;
        font-size: 14px;
      }

      .cities-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
      }

      .cta-band {
        border-radius: 28px;
        overflow: hidden;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.18));
        border: 1px solid rgba(124, 58, 237, 0.12);
        padding: 28px;
        display: flex;
        gap: 18px;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .cta-band h3 {
        margin: 0;
        font-size: 20px;
        color: #1e1b4b;
      }

      .cta-band p {
        margin: 6px 0 0;
        color: #4338ca;
      }

      @media (max-width: 768px) {
        .section-heading {
          text-align: center;
        }

        .section-heading p {
          margin: 0 auto;
        }
      }
    `}</style>
  );
}



