'use client';

import { useState } from 'react';

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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0])); // First item expanded by default

  const faqData: FAQItem[] = [
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
  ];

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

  const filteredFAQs = activeCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const popularFAQs = faqData.filter(item => item.popular);

  return (
    <section id="faq-section" className="faq-section">
      <div className="section-header">
        <span className="section-eyebrow">Helpful Information</span>
        <h2>Frequently Asked Questions</h2>
        <p className="section-description">
          Get answers to common questions about dog parks in {cityName}. Find everything you need to know for a safe and enjoyable experience.
        </p>
      </div>

      {/* Popular Questions */}
      <div className="popular-questions">
        <h3>Popular Questions</h3>
        <div className="popular-grid">
          {popularFAQs.map((faq, index) => (
            <button
              key={index}
              onClick={() => toggleItem(faqData.indexOf(faq))}
              className="popular-question-btn"
            >
              <i className="bi bi-question-circle"></i>
              {faq.question}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        <div className="filter-header">
          <h3>Browse by Category</h3>
          <span className="filter-count">{filteredFAQs.length} questions</span>
        </div>
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
            >
              {category.name}
              <span className="filter-count-badge">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="faq-container">
        <div className="faq-list">
          {filteredFAQs.map((faq) => {
            const originalIndex = faqData.indexOf(faq);
            const isExpanded = expandedItems.has(originalIndex);

            return (
              <article
                key={originalIndex}
                className={`faq-item ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  onClick={() => toggleItem(originalIndex)}
                  className="faq-question"
                >
                  <div className="question-content">
                    <span className="question-number">
                      {String(filteredFAQs.indexOf(faq) + 1).padStart(2, '0')}
                    </span>
                    <span className="question-text">{faq.question}</span>
                    {faq.popular && (
                      <span className="popular-badge">Popular</span>
                    )}
                  </div>
                  <div className="question-toggle">
                    <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                  </div>
                </button>

                <div className={`faq-answer ${isExpanded ? 'show' : ''}`}>
                  <div className="answer-content">
                    <p>{faq.answer}</p>

                    <div className="answer-actions">
                      <span className="category-tag">{faq.category}</span>
                      <div className="helpful-buttons">
                        <span className="helpful-label">Was this helpful?</span>
                        <button className="helpful-btn">
                          <i className="bi bi-hand-thumbs-up"></i>
                          Yes
                        </button>
                        <button className="helpful-btn">
                          <i className="bi bi-hand-thumbs-down"></i>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="faq-contact">
        <div className="contact-content">
          <h3>Still Have Questions?</h3>
          <p>Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help you plan the perfect visit to {cityName}&rsquo;s dog parks.</p>
          <div className="contact-actions">
            <a href="/contact" className="contact-btn primary">
              <i className="bi bi-envelope"></i>
              Contact Us
            </a>
            <a href="/signup" className="contact-btn secondary">
              <i className="bi bi-person-plus"></i>
              Join Community
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 80px 20px;
          background: white;
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
        }

        .section-eyebrow {
          display: inline-block;
          padding: 6px 16px;
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 42px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px;
          line-height: 1.2;
        }

        .section-description {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .popular-questions {
          max-width: 1200px;
          margin: 0 auto 60px;
        }

        .popular-questions h3 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px;
          text-align: center;
        }

        .popular-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .popular-question-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-size: 15px;
          color: #374151;
          font-weight: 500;
        }

        .popular-question-btn:hover {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border-color: #7c3aed;
          transform: translateY(-2px);
        }

        .popular-question-btn i {
          font-size: 18px;
          color: #7c3aed;
        }

        .popular-question-btn:hover i {
          color: white;
        }

        .category-filters {
          max-width: 1200px;
          margin: 0 auto 40px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filter-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .filter-count {
          font-size: 14px;
          color: #6b7280;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .filter-btn:hover {
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border-color: #7c3aed;
        }

        .filter-count-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .filter-btn.active .filter-count-badge {
          background: rgba(255, 255, 255, 0.2);
        }

        .faq-container {
          max-width: 900px;
          margin: 0 auto 60px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item.expanded {
          border-color: #7c3aed;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          background: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .faq-question:hover {
          background: #f9fafb;
        }

        .faq-item.expanded .faq-question {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
        }

        .question-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          text-align: left;
        }

        .question-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #f3f4f6;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          flex-shrink: 0;
        }

        .faq-item.expanded .question-number {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .question-text {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
        }

        .popular-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          background: #fef3c7;
          color: #d97706;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .faq-item.expanded .popular-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .question-toggle i {
          font-size: 20px;
          color: #9ca3af;
          transition: transform 0.2s ease;
        }

        .faq-item.expanded .question-toggle i {
          color: white;
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-answer.show {
          max-height: 500px;
        }

        .answer-content {
          padding: 0 24px 24px;
        }

        .answer-content p {
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 16px;
        }

        .answer-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .category-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background: #ede9fe;
          color: #7c3aed;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .helpful-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .helpful-label {
          font-size: 14px;
          color: #6b7280;
        }

        .helpful-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .helpful-btn:hover {
          background: #f9fafb;
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .faq-contact {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-contact h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px;
        }

        .faq-contact p {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 24px;
        }

        .contact-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .contact-btn.primary {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
        }

        .contact-btn.primary:hover {
          background: linear-gradient(135deg, #6d28d9, #9333ea);
          transform: translateY(-1px);
        }

        .contact-btn.secondary {
          background: white;
          color: #7c3aed;
          border: 2px solid #7c3aed;
        }

        .contact-btn.secondary:hover {
          background: #7c3aed;
          color: white;
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 32px;
          }

          .popular-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            justify-content: center;
          }

          .question-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .question-text {
            font-size: 15px;
          }

          .answer-actions {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .contact-actions {
            flex-direction: column;
            align-items: center;
          }

          .contact-btn {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}