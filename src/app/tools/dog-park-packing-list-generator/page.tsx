import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogParkPackingListGenerator from '@/components/DogParkPackingListGenerator';

export const metadata: Metadata = {
  title: 'Dog Park Packing List Generator | IndoorDogPark.org',
  description: 'Create a custom, printable packing list for your next trip to the dog park. See exactly what you need to bring based on the park type, weather, and your dog\'s age.',
  keywords: [
    'dog park packing list',
    'what to bring to the dog park',
    'indoor dog park requirements',
    'dog park essentials',
    'printable dog checklist',
  ],
  alternates: {
    canonical: '/tools/dog-park-packing-list-generator',
  },
  openGraph: {
    title: 'Custom Dog Park Packing List Generator | IndoorDogPark.org',
    description: 'Never forget an essential item again. Build your custom dog park packing list instantly.',
    url: 'https://www.indoordogpark.org/tools/dog-park-packing-list-generator',
    type: 'website',
  },
};

export default function DogParkPackingListGeneratorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header variant="light" />

      <main className="flex-1 print:bg-white">
        {/* Hero Section */}
        <section className="text-white py-20 px-4 print:hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-purple-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Packing List
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Dog Park Packing List Generator
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Create a custom checklist of everything you need to bring to the dog park. Perfect for first-timers and seasoned pros alike!
            </p>
          </div>
        </section>

        {/* Tool and Content */}
        <section className="py-16 px-4 print:py-0 print:px-0">
          <div className="max-w-5xl mx-auto">
            <DogParkPackingListGenerator />

            {/* SEO Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 print:hidden">
              <h2 className="text-3xl font-bold mb-6">What to Bring to an Indoor Dog Park vs. Outdoor Dog Park</h2>

              <p>
                Taking your dog to the park should be a fun, stress-free experience. However, the items you need to pack can change drastically depending on whether you are visiting a traditional outdoor park or a modern indoor dog park facility.
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">Indoor Dog Park Requirements</h3>
              <p>
                Because indoor dog parks are highly regulated, private businesses, they have strict entry requirements to ensure the safety and health of all dogs. When visiting an indoor park, the most critical items on your packing list are:
              </p>
              <ul>
                <li><strong>Vaccination Records:</strong> Most indoor parks require proof of Rabies, DHLPP (Distemper, Hepatitis, Leptospirosis, Parainfluenza, Parvovirus), and Bordetella (Kennel Cough). Many now accept digital uploads prior to your visit.</li>
                <li><strong>Flea and Tick Prevention:</strong> You must attest that your dog is on an active preventative medication.</li>
                <li><strong>Clean Paws:</strong> Bring a towel! Indoor parks strive to maintain a clean facility, so wiping off muddy paws before entering the turf area is heavily appreciated.</li>
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-4">Outdoor Dog Park Essentials</h3>
              <p>
                Outdoor parks are usually less regulated but expose you and your dog to the elements. You are entirely responsible for your dog&apos;s comfort and hydration.
              </p>
              <ul>
                <li><strong>Water & Bowl:</strong> Never rely on communal water bowls at outdoor parks, which can harbor bacteria or be completely empty. Always bring your own fresh water.</li>
                <li><strong>Weather Gear:</strong> In the summer, a cooling vest and extra ice water are essential to prevent heatstroke. In the winter, dog booties or paw balm (like Musher&apos;s Secret) are necessary to protect their pads from freezing salt and ice.</li>
                <li><strong>Cleanup Supplies:</strong> Bring double the amount of poop bags you think you need, and wet wipes for cleaning your dog&apos;s paws before they jump back into your car.</li>
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-4">Why the 6-Foot Leash Rule Exists</h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl my-6">
                <h4 className="font-bold text-lg m-0 text-purple-800">Ditch the Retractable Leash</h4>
                <p className="text-sm text-purple-700 mt-2 mb-0">
                  You should never use a retractable leash at a dog park. They offer poor control in high-stress situations, can cause severe friction burns, and the thin cord can wrap around other dogs during play, causing serious injury. Always use a standard 4 to 6-foot flat leash.
                </p>
              </div>

              <p className="mt-8 font-bold">
                Has bad weather ruined your outdoor park plans? <Link href="/">Find an indoor dog park near you</Link> to guarantee a perfect day of play!
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
