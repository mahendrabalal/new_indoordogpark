import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
const siteName = 'Indoor Dog Park';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Research & Reports | Indoor Dog Park Insights | IndoorDogPark.org',
  description:
    'Quarterly data-driven reports on indoor dog park trends, canine safety statistics, and pet industry insights by IndoorDogPark.org. Freely available for media and researchers.',
  keywords:
    'indoor dog park reports, dog park statistics, canine safety data, pet industry research, dog park trends, dog heatstroke data',
  alternates: {
    canonical: '/reports',
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/reports`,
    title: 'Research & Reports | IndoorDogPark.org',
    description:
      'Quarterly data-driven reports on indoor dog park trends, canine safety statistics, and pet industry insights.',
    siteName,
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'IndoorDogPark.org Research Reports' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research & Reports | IndoorDogPark.org',
    description: 'Quarterly data-driven reports on canine safety & indoor dog park trends.',
    images: [ogImageUrl],
    site: '@indoordogpark',
  },
  robots: { index: true, follow: true },
};

// ──────────────────────────────────────────────────────────────────────────────
//  Static report data (add new reports here each quarter)
// ──────────────────────────────────────────────────────────────────────────────
const reports = [
  {
    quarter: 'Q3 2026',
    badge: 'Latest',
    badgeColor: 'badge-hot',
    icon: 'bi-bar-chart-fill',
    iconColor: 'icon-blue',
    title: 'The 2026 State of Indoor Dog Parks in America: Industry Report',
    excerpt:
      'We analyzed data from 6,200 active indoor dog facilities across the United States. Find out which states and cities are dominating the rapidly growing indoor canine recreation industry.',
    slug: '2026-state-of-indoor-dog-parks',
    publishedAt: 'July 2026',
    category: 'Industry Data',
    readTime: '5 min read',
    stats: [
      { value: '6,200', label: 'Facilities Analyzed' },
      { value: '20%', label: 'of parks located in Texas' },
      { value: '83.5%', label: 'Digital Adoption Rate' },
    ],
  },
  {
    quarter: 'Q3 2026',
    badge: '',
    badgeColor: '',
    icon: 'bi-thermometer-sun',
    iconColor: 'icon-orange',
    title: 'The Hidden Dangers of Summer Heat for Urban Dogs',
    excerpt:
      'New data reveals that asphalt temperatures in major U.S. cities can exceed 140°F — scorching a dog\'s paw pads in under 60 seconds. We also document a 315% surge in searches for "indoor dog parks near me" during peak summer months.',
    slug: 'q3-2026-summer-dog-heat-safety',
    publishedAt: 'July 2026',
    category: 'Safety & Health',
    readTime: '8 min read',
    stats: [
      { value: '315%', label: 'Spike in indoor park searches' },
      { value: '140°F', label: 'Max asphalt temp at 85°F air' },
      { value: '2×', label: 'Higher ER risk for brachycephalic breeds' },
    ],
  },
];

const upcomingReports = [
  {
    quarter: 'Q4 2026',
    icon: 'bi-snow',
    title: 'Winter Wellness: Indoor Exercise & Canine Mental Health',
    description: 'How cold months and reduced daylight affect dog behaviour and what indoor facilities can do about it.',
    expectedDate: 'October 2026',
  },
  {
    quarter: 'Q1 2027',
    icon: 'bi-bar-chart-line',
    title: 'The State of the Indoor Dog Park Industry: 2027 Edition',
    description: 'Annual deep-dive into park growth, pricing benchmarks, and the most dog-friendly cities in America.',
    expectedDate: 'January 2027',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Research & Reports — IndoorDogPark.org',
    description:
      'Quarterly data-driven reports on indoor dog park trends, canine safety, and the pet industry from IndoorDogPark.org.',
    url: `${siteUrl}/reports`,
    publisher: {
      '@type': 'Organization',
      name: 'IndoorDogPark.org',
      url: siteUrl,
    },
  };

  return (
    <div className="reports-page">
      <Header variant="light" />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="reports-hero">
        <div className="reports-hero-bg" aria-hidden="true" />
        <div className="reports-hero-inner">
          {/* Left: Text */}
          <div className="reports-hero-content">
            <span className="reports-eyebrow">
              <i className="bi bi-bar-chart-line" /> Research & Data
            </span>
            <h1 className="reports-hero-title">
              Canine Safety &<br />
              <span className="reports-hero-accent">Industry Reports</span>
            </h1>
            <p className="reports-hero-subtitle">
              Quarterly data-driven insights on indoor dog park trends, canine
              safety, and the pet industry — open access for media,
              researchers, and dog lovers.
            </p>
            <div className="reports-hero-pills">
              <span className="reports-pill"><i className="bi bi-calendar3" /> Published Quarterly</span>
              <span className="reports-pill"><i className="bi bi-unlock" /> Open Access</span>
              <span className="reports-pill"><i className="bi bi-newspaper" /> Cite Freely</span>
            </div>
          </div>

          {/* Right: Live stat cards */}
          <div className="reports-hero-stats">
            <div className="reports-hero-stat-card reports-hero-stat-card--blue">
              <i className="bi bi-thermometer-sun reports-hero-stat-icon" />
              <span className="reports-hero-stat-value">140°F</span>
              <span className="reports-hero-stat-desc">Peak summer asphalt temp in U.S. cities</span>
            </div>
            <div className="reports-hero-stat-card reports-hero-stat-card--purple">
              <i className="bi bi-graph-up-arrow reports-hero-stat-icon" />
              <span className="reports-hero-stat-value">315%</span>
              <span className="reports-hero-stat-desc">Surge in indoor park searches in July</span>
            </div>
            <div className="reports-hero-stat-card reports-hero-stat-card--teal">
              <i className="bi bi-shield-check reports-hero-stat-icon" />
              <span className="reports-hero-stat-value">Q3 2026</span>
              <span className="reports-hero-stat-desc">Latest report now available</span>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="reports-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>


      {/* ── Report Cards ───────────────────────────────────────────────── */}
      <section className="reports-list-section">
        <div className="reports-container">
          <div className="reports-section-header">
            <h2 className="reports-section-title">Published Reports</h2>
            <p className="reports-section-sub">
              Click any report to read the full findings. All data may be cited with attribution to IndoorDogPark.org.
            </p>
          </div>

          <div className="reports-grid">
            {reports.map((report) => (
              <article key={report.slug} className="report-card">
                {/* Card header strip */}
                <div className="report-card-header">
                  <div className={`report-icon-wrap ${report.iconColor}`}>
                    <i className={`bi ${report.icon}`} />
                  </div>
                  <div className="report-card-meta-top">
                    <span className={`report-badge ${report.badgeColor}`}>{report.badge}</span>
                    <span className="report-quarter">{report.quarter}</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="report-card-body">
                  <span className="report-category">{report.category}</span>
                  <h3 className="report-card-title">{report.title}</h3>
                  <p className="report-card-excerpt">{report.excerpt}</p>

                  {/* Key stats */}
                  <div className="report-stats-row">
                    {report.stats.map((stat) => (
                      <div key={stat.label} className="report-stat">
                        <span className="report-stat-value">{stat.value}</span>
                        <span className="report-stat-label">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className="report-card-footer">
                  <div className="report-card-footer-meta">
                    <span><i className="bi bi-calendar3" /> {report.publishedAt}</span>
                    <span><i className="bi bi-clock" /> {report.readTime}</span>
                  </div>
                  <Link href={`/blog/${report.slug}`} className="report-read-btn">
                    Read Full Report <i className="bi bi-arrow-right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Kit CTA ──────────────────────────────────────────────── */}
      <section className="reports-media-section">
        <div className="reports-container">
          <div className="reports-media-card">
            <div className="reports-media-icon-wrap">
              <i className="bi bi-camera-reels" />
            </div>
            <div className="reports-media-text">
              <h2 className="reports-media-title">For Journalists & Media</h2>
              <p className="reports-media-sub">
                All statistics published in our reports are freely available to cite. We are happy to provide
                expert commentary, localized data for your city, or high-resolution infographic assets
                to accompany your story.
              </p>
            </div>
            <div className="reports-media-actions">
              <Link href="/contact" className="reports-media-btn-primary">
                <i className="bi bi-envelope-paper" /> Request a Quote
              </Link>
              <a href="mailto:outreach@indoordogpark.org" className="reports-media-btn-secondary">
                outreach@indoordogpark.org
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Reports ───────────────────────────────────────────── */}
      <section className="reports-upcoming-section">
        <div className="reports-container">
          <div className="reports-section-header">
            <h2 className="reports-section-title">Coming Soon</h2>
            <p className="reports-section-sub">Upcoming quarterly research topics — submit your data request or story idea.</p>
          </div>
          <div className="reports-upcoming-grid">
            {upcomingReports.map((r) => (
              <div key={r.quarter} className="upcoming-card">
                <div className="upcoming-card-header">
                  <span className="upcoming-quarter-tag">{r.quarter}</span>
                  <i className={`bi ${r.icon} upcoming-icon`} />
                </div>
                <h3 className="upcoming-title">{r.title}</h3>
                <p className="upcoming-desc">{r.description}</p>
                <span className="upcoming-date"><i className="bi bi-calendar-event" /> Expected: {r.expectedDate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Resources ──────────────────────────────────────────── */}
      <section className="reports-related-section">
        <div className="reports-container">
          <h2 className="reports-section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            More Resources
          </h2>
          <div className="reports-related-grid">
            <Link href="/blog" className="reports-related-card" prefetch={false}>
              <i className="bi bi-journal-text reports-related-icon" style={{ color: '#8b5cf6' }} />
              <h3>Blog & Guides</h3>
              <p>Expert articles on dog care, training tips, and park reviews.</p>
            </Link>
            <Link href="/parks" className="reports-related-card">
              <i className="bi bi-geo-alt-fill reports-related-icon" style={{ color: '#10b981' }} />
              <h3>Park Directory</h3>
              <p>Browse our national database of indoor dog parks and training facilities.</p>
            </Link>
            <Link href="/contact" className="reports-related-card">
              <i className="bi bi-people-fill reports-related-icon" style={{ color: '#f59e0b' }} />
              <h3>Partner With Us</h3>
              <p>List your park, submit data, or collaborate on research with our team.</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
