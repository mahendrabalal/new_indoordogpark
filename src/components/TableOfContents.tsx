'use client';

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setScrollProgress(progress);

      // Update active section based on scroll position
      const sections = items.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(section => section.element);

      if (sections.length === 0) return;

      let currentSection = '';
      sections.forEach(section => {
        const rect = section.element!.getBoundingClientRect();
        if (rect.top <= 100) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="table-of-contents">
      {/* Progress Bar */}
      <div className="toc-progress-bar">
        <div
          className="toc-progress-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* TOC Navigation */}
      <div className="toc-container">
        <div className="toc-header">
          <h4>Table of Contents</h4>
          <span className="toc-subtitle">Jump to any section</span>
        </div>

        <nav className="toc-nav">
          <ul className="toc-list">
            {items.map((item, index) => (
              <li
                key={item.id}
                className={`toc-item ${item.level > 1 ? 'toc-item-sub' : ''} ${
                  activeSection === item.id ? 'toc-item-active' : ''
                }`}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="toc-link"
                >
                  <span className="toc-number">{index + 1}</span>
                  <span className="toc-text">{item.title}</span>
                  {activeSection === item.id && (
                    <i className="bi bi-check-circle-fill toc-check"></i>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="toc-actions">
          <button
            onClick={() => scrollToSection(items[0]?.id || '')}
            className="toc-action-btn toc-action-top"
          >
            <i className="bi bi-arrow-up"></i>
            Back to Top
          </button>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="toc-action-btn"
          >
            <i className="bi bi-arrow-down"></i>
            To Bottom
          </button>
        </div>
      </div>

      <style jsx>{`
        .table-of-contents {
          position: fixed;
          left: 20px;
          top: 160px; /* Increased to avoid header overlap */
          width: 280px;
          max-height: calc(100vh - 180px); /* Adjusted accordingly */
          z-index: 40;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: block;
          transition: all 0.3s ease;
        }

        .toc-progress-bar {
          height: 3px;
          background: #f3f4f6;
          position: relative;
        }

        .toc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          transition: width 0.3s ease;
        }

        .toc-container {
          padding: 20px;
          max-height: calc(100vh - 150px);
          overflow-y: auto;
        }

        .toc-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
        }

        .toc-header h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .toc-subtitle {
          font-size: 12px;
          color: #6b7280;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .toc-item {
          margin-bottom: 2px;
        }

        .toc-item-sub {
          margin-left: 20px;
        }

        .toc-link {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #4b5563;
          text-align: left;
          gap: 10px;
        }

        .toc-link:hover {
          background: #f9fafb;
          color: #7c3aed;
        }

        .toc-item-active .toc-link {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 500;
        }

        .toc-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f3f4f6;
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          flex-shrink: 0;
        }

        .toc-item-active .toc-number {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .toc-text {
          flex: 1;
          line-height: 1.4;
        }

        .toc-check {
          font-size: 14px;
          opacity: 0;
          transform: scale(0);
          transition: all 0.2s ease;
        }

        .toc-item-active .toc-check {
          opacity: 1;
          transform: scale(1);
        }

        .toc-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
        }

        .toc-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .toc-action-btn:hover {
          background: #f9fafb;
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .toc-action-top {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border-color: #7c3aed;
        }

        .toc-action-top:hover {
          background: linear-gradient(135deg, #6d28d9, #9333ea);
        }

        /* Responsive Design - Match content breakpoints */
        @media (max-width: 1200px) {
          .table-of-contents {
            width: 260px;
            left: 10px;
          }
        }

        @media (max-width: 1024px) {
          .table-of-contents {
            display: none;
          }
        }

        /* Scrollbar Styling */
        .toc-container::-webkit-scrollbar {
          width: 4px;
        }

        .toc-container::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .toc-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .toc-container::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}