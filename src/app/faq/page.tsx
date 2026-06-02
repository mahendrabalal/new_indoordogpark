import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import FAQSection from '@/components/FAQSection';

const parkCount = 500;

export const metadata: Metadata = {
  title: 'IndoorDogPark FAQs',
  description: 'Answers to common questions about IndoorDogPark, listings, safety standards, and community guidelines.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'IndoorDogPark FAQs',
    description: 'Get answers about listing requirements, safety standards, and how our directory works.',
    url: 'https://www.indoordogpark.org/faq',
    type: 'website',
    images: ['/images/hero/hero.webp'],
  },
};

export default function FAQPage() {
  return (
    <PageLayout hideSafetyChecker={true}>
      <div className="min-h-screen bg-[#FCFBF8] relative overflow-hidden font-sans pt-24 pb-32">
        {/* SVG background dotted lines matching the design */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <path d="M-100,100 Q300,-50 900,150 T1800,400" fill="none" stroke="#e5e5e5" strokeWidth="1.5" strokeDasharray="6,6" />
          <path d="M-50,600 Q400,900 1000,700 T2000,200" fill="none" stroke="#e5e5e5" strokeWidth="1.5" strokeDasharray="6,6" />
        </svg>

        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
              Frequently asked
            </h1>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none">
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 drop-shadow-sm" 
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')", 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}
              >
                questions
              </span>
            </h1>
            <p className="mt-8 text-slate-500 max-w-sm mx-auto text-[15px] md:text-base leading-relaxed">
              Do you need some help with something or do you have questions on some features ?
            </p>
          </div>

          <FAQSection cityName="the United States" parkCount={parkCount} />
        </div>
      </div>
    </PageLayout>
  );
}
