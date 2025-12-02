'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map());
  const isScrollingRef = useRef<boolean>(false);

  // Calculate scroll progress
  useEffect(() => {
    const handleScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    handleScrollProgress(); // Initial call

    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);

  // Intersection Observer for section highlighting (best practice)
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sections = items
      .map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
        level: item.level
      }))
      .filter(section => section.element);

    if (sections.length === 0) return;

    // Configure Intersection Observer with proper thresholds
    const observerOptions = {
      root: null, // Use viewport
      rootMargin: '-80px 0px -80% 0px', // Account for header + trigger earlier
      threshold: [0, 0.25, 0.5, 0.75, 1.0] // Multiple thresholds for better accuracy
    };

    observerRef.current = new IntersectionObserver((entries) => {
      // Don't update while user is clicking TOC links
      if (isScrollingRef.current) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionRefs.current.set(entry.target.id, entry);
        } else {
          sectionRefs.current.delete(entry.target.id);
        }
      });

      // Determine which section should be active
      // Priority: visible sections with highest intersection ratio
      const visibleSections = Array.from(sectionRefs.current.values())
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          // Sort by intersection ratio (highest first)
          if (b.intersectionRatio !== a.intersectionRatio) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          // If ratios are equal, prefer the one closer to top
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0];
        setActiveSection(mostVisible.target.id);
      } else {
        // Fallback: Find the section closest to the top
        const allSections = sections.map(s => ({
          id: s.id,
          element: s.element!,
          top: s.element!.getBoundingClientRect().top
        }));

        const topSection = allSections
          .filter(s => s.top <= 120) // Within header offset
          .sort((a, b) => b.top - a.top)[0]; // Closest to top

        if (topSection) {
          setActiveSection(topSection.id);
        } else if (allSections.length > 0) {
          // If scrolled past all sections, highlight the last one
          const lastSection = allSections[allSections.length - 1];
          if (lastSection.top < window.innerHeight) {
            setActiveSection(lastSection.id);
          }
        }
      }
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      if (section.element) {
        observerRef.current!.observe(section.element);
      }
    });

    // Initial check
    const checkInitialSection = () => {
      const allSections = sections.map(s => ({
        id: s.id,
        element: s.element!,
        top: s.element!.getBoundingClientRect().top
      }));

      const topSection = allSections
        .filter(s => s.top <= 120)
        .sort((a, b) => b.top - a.top)[0] || allSections[0];

      if (topSection) {
        setActiveSection(topSection.id);
      }
    };

    // Delay initial check to ensure DOM is ready
    setTimeout(checkInitialSection, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Prevent observer updates while scrolling
      isScrollingRef.current = true;
      
      // Set active section immediately for instant feedback
      setActiveSection(sectionId);

      const offset = 80; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      // Re-enable observer updates after scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  }, []);

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
          <div className="toc-title">Table of Contents</div>
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

        .toc-title {
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 14px;
          color: #4b5563;
          text-align: left;
          gap: 10px;
          position: relative;
        }

        .toc-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px;
          height: 0;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 0 3px 3px 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toc-link:hover::before {
          height: 60%;
          transform: translateY(-50%) scaleY(1);
        }

        .toc-link:hover {
          background: #f9fafb;
          color: #7c3aed;
        }

        .toc-item-active .toc-link {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
          transform: translateX(4px);
        }

        .toc-item-active.toc-item-sub .toc-link {
          border-left: 3px solid rgba(255, 255, 255, 0.5);
          padding-left: 9px;
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