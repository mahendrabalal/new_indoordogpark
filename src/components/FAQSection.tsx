'use client';

import { useMemo } from 'react';
import { buildDefaultFAQs } from '@/lib/faq-data';
import { FAQItem } from '@/types/faq';
import { SupportCTA } from '@/types/city-content';
import SafetyCheckerFooter from '@/components/tools/SafetyCheckerFooter';

interface FAQSectionProps {
  cityName: string;
  parkCount: number;
  faqs?: FAQItem[];
  supportCard?: SupportCTA;
}

export default function FAQSection({ cityName, parkCount, faqs, supportCard }: FAQSectionProps) {
  const defaultFaqs = useMemo(() => buildDefaultFAQs(cityName, parkCount), [cityName, parkCount]);
  const faqData = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const handleCopyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText('contact@indoordogpark.org');
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'copied <i class="bi bi-check2"></i>';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  };

  return (
    <div className="mt-16 mb-12">
      <div className="bg-[#F6F4F0] rounded-[24px] p-6 md:p-12 mx-auto shadow-sm max-w-[800px]">
        <div className="flex flex-col">
          {faqData.map((faq, index) => (
            <details key={faq.question} className="group border-b border-gray-200/60 last:border-0">
              <summary className="flex justify-between items-center py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-bold text-slate-900 pr-6">{faq.question}</span>
                <span className="text-2xl font-light text-slate-900 flex-shrink-0 relative w-6 h-6 flex items-center justify-center">
                  <i className="bi bi-plus-lg absolute transition-opacity duration-200 group-open:opacity-0"></i>
                  <i className="bi bi-dash-lg absolute transition-opacity duration-200 opacity-0 group-open:opacity-100"></i>
                </span>
              </summary>
              <div className="pb-6 pr-8 text-slate-600 text-[15px] leading-relaxed animate-fadeIn">
                {faq.answer.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.trim().startsWith('•')) {
                    const bulletItems = paragraph.split('\n').filter(line => line.trim().startsWith('•'));
                    return (
                      <ul key={idx} className="list-disc pl-5 mb-4">
                        {bulletItems.map((item, itemIdx) => (
                          <li key={itemIdx} className="mb-2">{item.replace(/^•\s*/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.trim()) {
                    return <p key={idx} className="mb-4 last:mb-0">{paragraph.trim()}</p>;
                  }
                  return null;
                })}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 w-full flex flex-col justify-center text-center hover:shadow-md transition-all duration-500">
          <h2 className="text-3xl font-extrabold text-slate-900">Have any other questions ?</h2>
          <p className="mt-4 text-slate-500 max-w-sm mx-auto text-[15px]">
            Don't hesitate to send us an email with your enquiry or statement at:
          </p>
          
          <div className="mt-8 mx-auto inline-flex items-center bg-[#F6F4F0] rounded-xl p-1.5 pl-5 transition-transform hover:scale-[1.02]">
            <span className="text-slate-900 font-semibold text-[15px] mr-4">media@indoordogpark.org</span>
            <button 
              onClick={handleCopyEmail}
              className="bg-white rounded-lg px-4 py-2 text-sm font-bold text-slate-800 shadow-sm hover:shadow flex items-center gap-2 transition-all border border-gray-100/50"
            >
              copy <i className="bi bi-front"></i>
            </button>
          </div>
        </div>

        <div className="flex w-full">
          <SafetyCheckerFooter />
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}