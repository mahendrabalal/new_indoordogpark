'use client';

import { useMemo, useState } from 'react';
import { buildDefaultFAQs } from '@/lib/faq-data';
import { FAQItem } from '@/types/faq';
import { SupportCTA } from '@/types/city-content';
import { trackFaqHelpful, trackFaqShare } from '@/lib/analytics';

interface FAQSectionProps {
  cityName: string;
  parkCount: number;
  faqs?: FAQItem[];
  supportCard?: SupportCTA;
}

export default function FAQSection({ cityName, parkCount, faqs, supportCard }: FAQSectionProps) {
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleHelpful = (question: string) => {
    setHelpfulVotes(prev => {
      const isNowHelpful = !prev[question];
      if (isNowHelpful) {
        trackFaqHelpful(question, cityName);
      }
      return { ...prev, [question]: isNowHelpful };
    });
  };

  const handleShare = async (question: string) => {
    try {
      trackFaqShare(question, cityName);
      const url = `${window.location.origin}${window.location.pathname}#faq-section`;
      if (navigator.share) {
        await navigator.share({
          title: question,
          text: `Check out this FAQ: ${question}`,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(`${question}\n${url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing', err);
      }
    }
  };

  const defaultFaqs = useMemo(() => buildDefaultFAQs(cityName, parkCount), [cityName, parkCount]);
  const faqData = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(faqData.map(f => f.category));
    const sorted = Array.from(cats).sort((a, b) => {
      if (a === 'general') return -1;
      if (b === 'general') return 1;
      return a.localeCompare(b);
    });
    // Add "All" to the beginning
    return ['All', ...sorted];
  }, [faqData]);

  // Format category names nicely
  const formatCategory = (cat: string) => {
    if (cat === 'All') return 'All Categories';
    if (cat === 'general') return 'General Information';
    return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqData, searchQuery, activeCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage) || 1;
  const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <section id="faq-section" className="faq-section">
      <div className="faq-shell">
        <div className="faq-header" aria-labelledby="faq-heading">
          {/* Replaced generic header with a cleaner approach matching the screenshot */}
          <h2 id="faq-heading">Frequently Asked Questions</h2>
        </div>

        {/* Search Bar matching the design */}
        <div className="faq-search-container">
          <input 
            type="text" 
            placeholder="Type your question here" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="faq-search-input"
            aria-label="Search FAQs"
          />
          <button className="faq-search-button">
            SEARCH
          </button>
        </div>

        {/* Horizontal Category Tabs */}
        <div className="faq-tabs-container">
          <div className="faq-tabs-scroll">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => handleTabClick(cat)}
                className={`faq-tab ${activeCategory === cat ? 'active' : ''}`}
                aria-selected={activeCategory === cat}
              >
                {formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info & Pagination Header */}
        <div className="faq-results-header">
          <span className="results-count">{filteredFaqs.length} Results</span>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="page-nav-btn"
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="page-indicator">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="page-nav-btn"
                aria-label="Next page"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </div>

        {/* FAQ List */}
        <div className="faq-content">
          <div className="faq-list">
            {paginatedFaqs.length > 0 ? (
              paginatedFaqs.map((faq) => (
                <details key={faq.question} className="faq-item group">
                  <summary className="faq-question">
                    <div className="faq-question-left">
                      <span className="q-icon">Q</span>
                      <span className="question-text">{faq.question}</span>
                    </div>
                    <span className="faq-expand-icon">
                      {/* CSS will swap these icons based on the details open state */}
                      <i className="bi bi-plus-lg icon-plus"></i>
                      <i className="bi bi-dash-lg icon-minus"></i>
                    </span>
                  </summary>
                  <div className="faq-answer">
                    <div className="faq-answer-content">
                      {faq.answer.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.trim().startsWith('•')) {
                          const bulletItems = paragraph.split('\n').filter(line => line.trim().startsWith('•'));
                          return (
                            <ul key={idx} className="faq-list-items">
                              {bulletItems.map((item, itemIdx) => (
                                <li key={itemIdx}>{item.replace(/^•\s*/, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (paragraph.trim()) {
                          return <p key={idx}>{paragraph.trim()}</p>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <div className="faq-actions">
                      <button 
                        type="button" 
                        onClick={() => handleHelpful(faq.question)}
                        className={`action-btn ${helpfulVotes[faq.question] ? 'active' : ''}`}
                      >
                        <i className={`bi bi-hand-thumbs-up${helpfulVotes[faq.question] ? '-fill' : ''}`} /> 
                        {helpfulVotes[faq.question] ? 'Helpful!' : 'Helpful'}
                      </button>
                      <button type="button" onClick={() => handleShare(faq.question)} className="action-btn">
                        <i className="bi bi-share" /> Share
                      </button>
                    </div>
                  </div>
                </details>
              ))
            ) : (
              <div className="no-results">
                <i className="bi bi-search" style={{ fontSize: '2rem', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
                <p>No answers found for "{searchQuery}". Try a different keyword.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .faq-section {
          padding: 60px 20px;
          background: #ffffff;
        }

        .faq-shell {
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .faq-header h2 {
          font-size: clamp(32px, 4vw, 42px);
          color: #0f172a; /* Slate 900 */
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Search Bar */
        .faq-search-container {
          display: flex;
          max-width: 800px;
          margin: 0 auto 48px;
        }

        .faq-search-input {
          flex: 1;
          padding: 16px 20px;
          font-size: 16px;
          border: 1px solid #cbd5e1;
          border-right: none;
          border-radius: 8px 0 0 8px;
          outline: none;
          color: #334155;
          transition: border-color 0.2s;
        }

        .faq-search-input::placeholder {
          color: #94a3b8;
        }

        .faq-search-input:focus {
          border-color: #94a3b8;
        }

        .faq-search-button {
          background-color: #b91c1c; /* Deep Red to match screenshot */
          color: white;
          font-weight: 700;
          font-size: 14px;
          padding: 0 40px;
          border: none;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: background-color 0.2s;
        }

        .faq-search-button:hover {
          background-color: #991b1b;
        }

        /* Tabs */
        .faq-tabs-container {
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .faq-tabs-scroll {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          gap: 32px;
          padding-bottom: 1px;
        }
        
        .faq-tabs-scroll::-webkit-scrollbar {
          display: none;
        }

        .faq-tab {
          background: none;
          border: none;
          padding: 0 0 16px;
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .faq-tab:hover {
          color: #1e293b;
        }

        .faq-tab.active {
          color: #1e3a8a; /* Deep blue text for active */
        }

        /* Active Tab indicator with downward triangle */
        .faq-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #1e3a8a; /* Deep blue border */
        }

        .faq-tab.active::before {
          content: '';
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px 5px 0 5px;
          border-style: solid;
          border-color: #1e3a8a transparent transparent transparent;
          z-index: 10;
        }

        /* Results Header */
        .faq-results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }

        .results-count {
          font-weight: 700;
          color: #1e3a8a;
          font-size: 15px;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #1e3a8a;
          font-size: 13px;
          font-weight: 600;
        }

        .page-nav-btn {
          background: none;
          border: none;
          color: #1e3a8a;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
        }
        
        .page-nav-btn:disabled {
          color: #cbd5e1;
          cursor: default;
        }

        /* FAQ List */
        .faq-list {
          display: flex;
          flex-direction: column;
        }

        .faq-item {
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          cursor: pointer;
          list-style: none; /* Hide default triangle */
        }

        .faq-question::-webkit-details-marker {
          display: none; /* Hide default triangle in Safari */
        }

        .faq-question-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .q-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #1e3a8a;
          color: #1e3a8a;
          font-weight: 400;
          font-size: 16px;
          flex-shrink: 0;
        }

        .question-text {
          font-size: 20px;
          font-weight: 400;
          color: #1e3a8a;
          line-height: 1.4;
        }

        .faq-expand-icon {
          color: #64748b;
          font-size: 24px;
          margin-left: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-minus {
          display: none;
        }

        .faq-item[open] .icon-plus {
          display: none;
        }

        .faq-item[open] .icon-minus {
          display: block;
        }

        .faq-answer {
          padding: 0 0 32px 52px; /* Indent to align with text, not the Q icon */
          color: #475569;
          line-height: 1.6;
          font-size: 16px;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .faq-answer-content p {
          margin: 0 0 16px;
        }
        
        .faq-answer-content p:last-child {
          margin-bottom: 0;
        }

        .faq-list-items {
          margin: 0 0 16px;
          padding-left: 20px;
        }

        .faq-list-items li {
          margin-bottom: 8px;
        }

        /* Actions */
        .faq-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          padding-top: 16px;
        }

        .action-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .action-btn.active {
          background: #ede9fe;
          border-color: #c4b5fd;
          color: #6d28d9;
        }

        .no-results {
          text-align: center;
          padding: 64px 0;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .faq-search-container {
            flex-direction: column;
            gap: 12px;
          }
          .faq-search-input {
            border-right: 1px solid #cbd5e1;
            border-radius: 8px;
          }
          .faq-search-button {
            border-radius: 8px;
            padding: 16px;
          }
          .question-text {
            font-size: 18px;
          }
          .faq-answer {
            padding-left: 0;
            padding-top: 16px;
          }
          .faq-question {
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}