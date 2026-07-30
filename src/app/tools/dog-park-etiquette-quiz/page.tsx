import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogParkEtiquetteQuiz from '@/components/DogParkEtiquetteQuiz';

export const metadata: Metadata = {
  title: 'Dog Park Etiquette Quiz & Certification',
  description: 'Test your knowledge of dog park safety, rules, and etiquette. Pass the test to earn your Certified Good Human badge!',
  keywords: [
    'dog park etiquette',
    'dog park rules',
    'dog park safety',
    'dog body language',
    'dog training quiz'
  ],
  alternates: {
    canonical: '/tools/dog-park-etiquette-quiz',
  },
  openGraph: {
    title: 'Dog Park Etiquette Quiz | IndoorDogPark.org',
    description: 'Do you know how to safely navigate a busy dog park? Take our interactive quiz and earn your Certified Good Human badge.',
    url: 'https://www.indoordogpark.org/tools/dog-park-etiquette-quiz',
    type: 'website',
  },
};

export default function DogParkEtiquetteQuizPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Interactive Quiz
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Dog Park Etiquette Quiz
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              Test your knowledge of dog park safety and unspoken rules. Can you earn the &quot;Certified Good Human&quot; badge?
            </p>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="py-16 px-4 -mt-10">
          <div className="max-w-5xl mx-auto">
            <DogParkEtiquetteQuiz />
            
            {/* SEO Article Area */}
            <article className="mt-16 prose prose-slate lg:prose-lg max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Dog Park Etiquette Matters</h2>
              
              <p>
                Dog parks are incredible resources for urban and suburban pet owners. They offer a rare opportunity for dogs to run off-leash, socialize, and burn off excess energy. However, putting dozens of strange dogs in a fenced area is inherently risky.
              </p>

              <p>
                Veterinarians and professional dog trainers frequently warn against dog parks not because the parks themselves are bad, but because <strong>uneducated owners</strong> often bring under-socialized dogs or fail to supervise them properly.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">The Golden Rules of the Dog Park</h3>
              
              <ul className="space-y-3">
                <li>
                  <strong>Active Supervision:</strong> Your eyes should be on your dog at all times. Do not scroll on your phone, read a book, or get so lost in conversation that you miss the signs of an impending scuffle.
                </li>
                <li>
                  <strong>Leave High-Value Items at Home:</strong> Toys, balls, and treats can trigger intense resource guarding. If you bring a ball and another dog steals it, a fight can break out instantly.
                </li>
                <li>
                  <strong>Know When to Leave:</strong> If your dog is being bullied, or if your dog is the one bullying others, it is your responsibility to leash them and leave. A dog park is not a place for dogs to &quot;work it out themselves.&quot;
                </li>
                <li>
                  <strong>Clean Up Immediately:</strong> Always bring extra bags and clean up your dog&apos;s waste immediately to prevent the spread of diseases and parasites.
                </li>
              </ul>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 mt-8 rounded-r-xl">
                <h4 className="text-lg font-bold text-indigo-900 mb-2 mt-0">Looking for a safer alternative?</h4>
                <p className="text-indigo-800 mb-0">
                  Many indoor dog parks and private membership parks require temperament evaluations, vaccination records, and have trained staff (&quot;park rangers&quot;) on duty to intervene in fights. Check our <Link href="/parks" className="font-bold underline hover:text-indigo-600">directory</Link> to find a premium park near you.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
