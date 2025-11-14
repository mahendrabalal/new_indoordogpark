'use client';

import { useEffect, useMemo, useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

interface FAQSectionProps {
  cityName: string;
  parkCount: number;
}

export default function FAQSection({ cityName, parkCount }: FAQSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const faqData: FAQItem[] = useMemo(() => [
    {
      question: `How many dog parks are available in ${cityName}?`,
      answer: `${cityName} has ${parkCount} dog parks and dog-friendly establishments, including traditional outdoor dog parks, indoor dog parks, and dog-friendly businesses like restaurants and shops. Each type offers unique benefits for different situations and dog personalities.`,
      category: 'general',
      popular: true
    },
    {
      question: `Are dog parks in ${cityName} free to use?`,
      answer: 'Most traditional outdoor dog parks in public spaces are free to use. However, indoor dog parks and specialized facilities typically require membership fees or day passes. Dog-friendly establishments like restaurants may have minimum purchase requirements or special pet menus.',
      category: 'pricing',
      popular: true
    },
    {
      question: `What are the requirements to visit dog parks in ${cityName}?`,
      answer: 'Most dog parks require that your dog be current on vaccinations (rabies, DHPP), licensed, and well-behaved. Some indoor facilities may require proof of vaccinations, health certificates, or temperament assessments. Always check specific park rules before visiting.',
      category: 'requirements',
      popular: true
    },
    {
      question: `What's the best time to visit dog parks in ${cityName}?`,
      answer: 'Early mornings (6-9 AM) and early evenings (4-7 PM) are typically the busiest times, offering great socialization opportunities. Midday visits are usually quieter, better for dogs who may be overwhelmed by crowds. Weekends are generally busier than weekdays. Consider your dog\'s personality and social comfort level when planning visits.',
      category: 'planning',
      popular: true
    },
    {
      question: `Are there any size restrictions or separate areas for different sized dogs?`,
      answer: 'Many dog parks in ${cityName} offer separate areas for small dogs (under 25 lbs) and large dogs (over 25 lbs). This helps ensure safe play experiences. However, not all parks have this separation, so it\'s important to check ahead and supervise your dog\'s interactions.',
      category: 'safety'
    },
    {
      question: `What should I bring when visiting a dog park in ${cityName}?`,
      answer: 'Essential items include: a leash (for entering and exiting), poop bags, fresh water and a bowl, your dog\'s vaccination records (especially for indoor facilities), and your phone for emergencies. Optional items include toys (check park rules first), treats for training, and a first-aid kit.',
      category: 'planning'
    },
    {
      question: `Are there indoor dog park options available in ${cityName}?`,
      answer: 'Yes, ${cityName} offers indoor dog park facilities that provide climate-controlled environments perfect for hot summers, rainy days, or dogs with weather sensitivities. These facilities typically offer specialized flooring, agility equipment, and training areas. Most require membership or advance booking.',
      category: 'facilities'
    },
    {
      question: `Can I bring multiple dogs to the park?`,
      answer: 'Most parks welcome multiple dogs from the same household, but you must be able to control all dogs at once. Some facilities limit the number of dogs per person (usually 2-3). For safety, ensure you can give adequate attention to each dog and be prepared to leave if any dog becomes overwhelmed or aggressive.',
      category: 'rules'
    },
    {
      question: `What are the most common dog park rules in ${cityName}?`,
      answer: 'Common rules include: dogs must be leashed when entering and exiting, owners must remain within the park and supervise their dogs at all times, aggressive dogs must be removed immediately, all waste must be picked up, and dogs should not be left unattended. Many parks also have rules about toys, food, and children.',
      category: 'rules'
    },
    {
      question: `Are there dog parks with special features like swimming areas or agility courses?`,
      answer: 'Yes! Several dog parks in ${cityName} offer special features including swimming pools, agility equipment, obstacle courses, and training areas. Indoor facilities often have specialized equipment for training and exercise. Check individual park listings for specific amenities.',
      category: 'facilities'
    },
    {
      question: `How do I know if a dog park is safe and well-maintained?`,
      answer: 'Look for parks with regular maintenance schedules, secure fencing, double-gated entries, clean water sources, waste disposal stations, and visible rules postings. Online reviews and local dog owner groups can provide insights about park conditions and community experiences.',
      category: 'safety'
    },
    {
      question: `What should I do if my dog gets into a fight at the park?`,
      answer: 'Immediately intervene by making a loud noise to distract the dogs, then separate them using leashes or objects (not your hands). Check both dogs for injuries and exchange contact information with the other owner. Leave the park to allow everyone to calm down. Report serious incidents to park management if applicable.',
      category: 'safety'
    },
    {
      question: `Are there any breed restrictions at ${cityName} dog parks?`,
      answer: 'Most public dog parks in ${cityName} do not have breed-specific restrictions, focusing instead on individual dog behavior. However, some private facilities and indoor parks may have their own policies. Always check specific park requirements, especially for facilities requiring membership.',
      category: 'requirements'
    },
    {
      question: `Can I host a dog birthday party or event at a dog park?`,
      answer: 'Many dog parks allow small gatherings, but some may require permits for larger events. Indoor facilities often offer party packages and private rental options. Always check with park management first, be prepared to clean up thoroughly, and consider other park users who may be present.',
      category: 'events'
    },
    {
      question: `What training opportunities are available at dog parks in ${cityName}?`,
      answer: 'Many dog parks in ${cityName} have professional trainers offering classes, or you can work on basic obedience and socialization skills yourself. Indoor facilities often provide structured training programs, agility classes, and behavior workshops. Dog parks are excellent environments for practicing recall and social skills under controlled conditions.',
      category: 'training'
    }
  ], [cityName, parkCount]);

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'general', name: 'General', count: faqData.filter(item => item.category === 'general').length },
    { id: 'pricing', name: 'Pricing & Costs', count: faqData.filter(item => item.category === 'pricing').length },
    { id: 'requirements', name: 'Requirements', count: faqData.filter(item => item.category === 'requirements').length },
    { id: 'planning', name: 'Planning Your Visit', count: faqData.filter(item => item.category === 'planning').length },
    { id: 'safety', name: 'Safety', count: faqData.filter(item => item.category === 'safety').length },
    { id: 'facilities', name: 'Facilities & Features', count: faqData.filter(item => item.category === 'facilities').length },
    { id: 'rules', name: 'Rules & Etiquette', count: faqData.filter(item => item.category === 'rules').length },
    { id: 'events', name: 'Events & Parties', count: faqData.filter(item => item.category === 'events').length },
    { id: 'training', name: 'Training', count: faqData.filter(item => item.category === 'training').length }
  ];

  const categoryLabelMap = categories.reduce<Record<string, string>>((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  const filteredFAQs = useMemo(
    () => (activeCategory === 'all'
      ? faqData
      : faqData.filter(item => item.category === activeCategory)),
    [activeCategory, faqData]
  );

  useEffect(() => {
    setExpandedQuestion(filteredFAQs.length ? filteredFAQs[0].question : null);
  }, [filteredFAQs]);

  const getPreview = (answer: string) => {
    const parts = answer.split(/(?<=[.!?])\s+/);
    return parts[0];
  };

  const toggleItem = (question: string) => {
    setExpandedQuestion(prev => (prev === question ? null : question));
  };

  const popularFAQs = faqData.filter(item => item.popular);
  const totalFAQs = faqData.length;
  const visibleCount = filteredFAQs.length;

  return (
    <section id="faq-section" className="faq-section">
      <div className="faq-shell">
        <div className="faq-header" aria-labelledby="faq-heading">
          <div>
            <span className="section-eyebrow">Helpful Information</span>
            <h2 id="faq-heading">Frequently asked questions about {cityName} dog parks</h2>
            <p>
              Real-world guidance covering pricing, safety, etiquette, and planning for more than {parkCount} parks
              and dog-friendly spaces across {cityName}. Tap a topic to reveal deeper context.
            </p>
          </div>
          <div className="faq-header-meta">
            <div className="meta-card">
              <span className="meta-label">Answer library</span>
              <strong>{totalFAQs}</strong>
              <small>Verified responses</small>
            </div>
            <div className="meta-card">
              <span className="meta-label">Coverage</span>
              <strong>{parkCount}</strong>
              <small>Parks referenced</small>
            </div>
            <div className="meta-card">
              <span className="meta-label">View</span>
              <strong>{visibleCount}</strong>
              <small>Visible for this filter</small>
            </div>
          </div>
        </div>

        <div className="faq-grid">
          <aside className="faq-sidebar">
            <div className="sidebar-card snapshot-card">
              <p className="snapshot-kicker">Need a quick overview?</p>
              <ul>
                <li><strong>{popularFAQs.length}</strong> questions trending this week</li>
                <li><strong>{categories.length - 1}</strong> expert-backed topics</li>
                <li>Updated weekly with community feedback</li>
              </ul>
            </div>

            <div className="sidebar-card categories-card">
              <div className="sidebar-card-header">
                <span>Browse by topic</span>
                <span className="muted">{categories.length - 1} categories</span>
              </div>
              <div className="category-list">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  >
                    <div>
                      <span className="category-name">{category.name}</span>
                      {category.id !== 'all' && (
                        <span className="category-preview">
                          {category.count} {category.count === 1 ? 'answer' : 'answers'}
                        </span>
                      )}
                    </div>
                    <span className="category-count">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-card support-card">
              <p className="support-label">Still stuck?</p>
              <h3>Chat with our team</h3>
              <p>Share your situation and we&apos;ll recommend the best park, indoor option, or community meetup.</p>
              <div className="support-actions">
                <a href="/contact">Contact us</a>
                <a href="/signup" className="secondary">Join community</a>
              </div>
            </div>
          </aside>

          <div className="faq-main">
            <div className="popular-rail">
              <div>
                <span className="popular-eyebrow">Popular right now</span>
                <p>Tap to jump to the full answer.</p>
              </div>
              <div className="popular-chip-row">
                {popularFAQs.map((faq) => (
                  <button
                    key={faq.question}
                    type="button"
                    onClick={() => toggleItem(faq.question)}
                    className="popular-chip"
                  >
                    <i className="bi bi-question-circle" />
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>

            <div className="faq-accordion" role="list">
              {filteredFAQs.map((faq, idx) => {
                const isExpanded = expandedQuestion === faq.question;

                return (
                  <article
                    role="listitem"
                    key={faq.question}
                    className={`faq-row ${isExpanded ? 'open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      onClick={() => toggleItem(faq.question)}
                      aria-expanded={isExpanded}
                    >
                      <div className="faq-trigger-main">
                        <span className="faq-index">{String(idx + 1).padStart(2, '0')}</span>
                        <div>
                          <h4>{faq.question}</h4>
                          <p className="faq-preview">{getPreview(faq.answer)}</p>
                        </div>
                      </div>
                      <div className="faq-trigger-meta">
                        <span className="category-chip">{categoryLabelMap[faq.category] || faq.category}</span>
                        <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} />
                      </div>
                    </button>

                    <div className={`faq-panel ${isExpanded ? 'open' : ''}`}>
                      <p>{faq.answer}</p>
                      <div className="faq-panel-actions">
                        <span>Category · {categoryLabelMap[faq.category] || faq.category}</span>
                        <div className="panel-buttons">
                          <button type="button"><i className="bi bi-hand-thumbs-up" /> Helpful</button>
                          <button type="button"><i className="bi bi-share" /> Share</button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 72px 20px;
          background: #ffffff;
        }

        .faq-shell {
          max-width: 1200px;
          margin: 0 auto;
        }

        .faq-header {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 40px;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7c3aed;
          background: #f5f3ff;
          padding: 6px 14px;
          border-radius: 999px;
        }

        .faq-header h2 {
          margin: 6px 0;
          font-size: clamp(28px, 3vw, 44px);
          line-height: 1.15;
          color: #0f172a;
          font-weight: 700;
        }

        .faq-header p {
          color: #475569;
          line-height: 1.5;
          margin: 8px 0 0;
        }

        .faq-header-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }

        .meta-card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          background: #f8fafc;
        }

        .meta-label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .meta-card strong {
          font-size: 26px;
          display: block;
          color: #0f172a;
        }

        .meta-card small {
          color: #64748b;
          font-size: 13px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
        }

        .faq-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-card {
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 20px;
          background: #fdfcff;
        }

        .snapshot-card ul {
          margin: 12px 0 0;
          padding-left: 18px;
          color: #475569;
          line-height: 1.5;
        }

        .snapshot-kicker {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7c3aed;
          margin: 0;
        }

        .sidebar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .muted {
          font-size: 13px;
          color: #94a3b8;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 14px;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
          font-size: 14px;
        }

        .category-btn.active {
          border-color: #7c3aed;
          background: #f5f3ff;
        }

        .category-name {
          font-weight: 600;
          color: #0f172a;
        }

        .category-preview {
          display: block;
          font-size: 12px;
          color: #94a3b8;
        }

        .category-count {
          min-width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #475569;
        }

        .category-btn.active .category-count {
          background: #7c3aed;
          color: #fff;
        }

        .support-card {
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
        }

        .support-label {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .support-card h3 {
          margin: 0 0 8px;
        }

        .support-card p {
          margin: 0 0 16px;
          color: rgba(255,255,255,0.9);
          line-height: 1.5;
        }

        .support-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .support-actions a {
          flex: 1;
          min-width: 120px;
          text-align: center;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.4);
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        .support-actions .secondary {
          background: rgba(255,255,255,0.12);
        }

        .faq-main {
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 28px;
          background: #fff;
        }

        .popular-rail {
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .popular-eyebrow {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7c3aed;
        }

        .popular-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }

        .popular-chip {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          cursor: pointer;
          font-size: 13px;
          color: #0f172a;
        }

        .popular-chip:hover {
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .faq-accordion {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-row {
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          background: #fafafb;
        }

        .faq-row.open {
          border-color: #7c3aed;
          background: #f5f3ff;
        }

        .faq-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .faq-trigger-main {
          display: flex;
          gap: 16px;
          text-align: left;
        }

        .faq-index {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #7c3aed;
          flex-shrink: 0;
        }

        .faq-trigger-main h4 {
          margin: 0;
          font-size: 16px;
          color: #0f172a;
        }

        .faq-preview {
          margin: 6px 0 0;
          font-size: 14px;
          color: #475569;
        }

        .faq-row.open .faq-preview {
          display: none;
        }

        .faq-trigger-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .category-chip {
          background: #ede9fe;
          color: #7c3aed;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .faq-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
          padding: 0 20px;
        }

        .faq-panel.open {
          padding-bottom: 20px;
          max-height: 600px;
        }

        .faq-panel p {
          margin: 0;
          color: #334155;
          line-height: 1.55;
          padding-top: 4px;
        }

        .faq-panel-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(15,23,42,0.08);
        }

        .panel-buttons {
          display: flex;
          gap: 8px;
        }

        .panel-buttons button {
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 999px;
          padding: 6px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          cursor: pointer;
          color: #475569;
        }

        .panel-buttons button:hover {
          border-color: #7c3aed;
          color: #7c3aed;
        }

        @media (max-width: 1024px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .faq-main {
            padding: 20px;
          }

          .faq-trigger {
            flex-direction: column;
          }

          .faq-panel-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  );
}