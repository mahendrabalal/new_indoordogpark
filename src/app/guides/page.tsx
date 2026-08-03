import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Free Dog Park Guides & Printables | IndoorDogPark.org',
  description: 'Download free, beautiful checklists, packing lists, and safety guides to make your next indoor dog park visit perfect.',
  keywords: [
    'dog park guides',
    'dog park printables',
    'dog park checklists',
    'indoor dog park rules',
    'dog care guides',
  ],
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Free Dog Park Guides & Printables | IndoorDogPark.org',
    description: 'Download free, beautiful checklists and packing lists for your next dog park visit.',
    url: 'https://www.indoordogpark.org/guides',
    type: 'website',
  },
};

const guides = [
  {
    title: 'The Ultimate Etiquette Checklist',
    description: 'A printable, visual checklist of the unspoken rules for visiting an indoor dog park safely.',
    href: '/guides/etiquette-checklist',
    icon: 'bi-card-checklist',
    color: 'from-violet-600 to-indigo-700',
    tag: 'Popular',
  },
  {
    title: 'What to Pack for Your First Visit',
    description: 'A complete checklist of everything you need to bring to an indoor dog park for a stress-free trip.',
    href: '/guides/what-to-pack',
    icon: 'bi-bag-check-fill',
    color: 'from-pink-500 to-rose-600',
    tag: 'New',
  },
  {
    title: 'Safety Assessment Guide',
    description: 'How to quickly assess if a new indoor dog park is safe, clean, and well-managed before you let your dog off-leash.',
    href: '/guides/safety-assessment',
    icon: 'bi-shield-check',
    color: 'from-emerald-500 to-teal-600',
    tag: 'New',
  },
  {
    title: 'Indoor Dog Park vs Daycare',
    description: 'Not sure which is right for your dog? A visual comparison guide to help you choose.',
    href: '/guides/park-vs-daycare',
    icon: 'bi-arrow-left-right',
    color: 'from-sky-500 to-blue-600',
    tag: 'New',
  },
  {
    title: 'Dog Body Language Poster',
    description: 'A visual guide to understanding play vs tension. Learn to read your dog\'s signals at the park.',
    href: '/guides/body-language',
    icon: 'bi-emoji-smile',
    color: 'from-amber-500 to-orange-600',
    tag: 'New',
  },
  {
    title: 'First-Aid Quick Reference',
    description: 'A printable cheat sheet for handling common dog park emergencies like overheating and cuts.',
    href: '/guides/first-aid',
    icon: 'bi-heart-pulse-fill',
    color: 'from-rose-500 to-red-600',
    tag: 'New',
  },
];

export default function GuidesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300 mb-4">Free Printables</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Dog Park Guides &amp; Checklists
            </h1>
            <p className="text-xl md:text-2xl text-violet-100 max-w-2xl mx-auto leading-relaxed">
              Beautiful, downloadable guides to help you and your dog have a safe and fun time at the indoor park.
            </p>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {guides.map((guide) => (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className={`group block bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ${guide.href !== '#' ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-60 cursor-default pointer-events-none'}`}
                >
                  <div className={`bg-gradient-to-r ${guide.color} p-6 flex items-center justify-between`}>
                    <i className={`bi ${guide.icon} text-white text-4xl`}></i>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {guide.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {guide.description}
                    </p>
                    {guide.href !== '#' && (
                      <div className="mt-4 text-violet-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        View guide <i className="bi bi-arrow-right"></i>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Suggest a Guide</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Is there a specific topic or checklist you wish you had for your dog park visits? Let us know!
            </p>
            <Link href="/contact" className="inline-block bg-violet-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-violet-800 transition-colors shadow-md">
              Send us an idea
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
