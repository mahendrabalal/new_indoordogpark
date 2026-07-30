import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DogWeatherSafetyCalculator from '@/components/DogWeatherSafetyCalculator';

export const metadata: Metadata = {
  title: 'Dog Weather Safety & Walk Calculator | IndoorDogPark.org',
  description: 'Is it too hot or cold to walk your dog? Use our free Dog Weather Safety Calculator to find out if conditions are safe based on your dog\'s breed and age.',
  keywords: [
    'dog weather safety calculator',
    'is it too hot to walk my dog',
    'is it too cold to walk my dog',
    'dog walking temperature guide',
    'dog heatstroke risk',
    'safe temperature for dogs outside',
  ],
  alternates: {
    canonical: '/tools/weather-safety-calculator',
  },
  openGraph: {
    title: 'Dog Weather Safety & Walk Calculator | IndoorDogPark.org',
    description: 'Find out instantly if the weather is safe for your dog\'s walk today.',
    url: 'https://www.indoordogpark.org/tools/weather-safety-calculator',
    type: 'website',
  },
};

export default function WeatherSafetyCalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-white py-20 px-4" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-blue-200 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link> / Weather Safety
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Dog Weather Safety Calculator
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Wondering if it&apos;s too hot or too cold for a walk? Enter your local temperature and dog&apos;s details to see if it&apos;s safe to head outside.
            </p>
          </div>
        </section>

        {/* Calculator and Content */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <DogWeatherSafetyCalculator />

            {/* SEO Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold mb-6">When Is It Too Hot or Cold to Walk a Dog?</h2>

              <p>
                A quick walk around the block might seem harmless, but extreme temperatures pose serious risks to dogs. Unlike humans, dogs cannot sweat through their skin to cool down. They rely on panting and releasing heat through their paw pads, making them highly susceptible to <strong>heatstroke</strong> in the summer and <strong>hypothermia</strong> in the winter.
              </p>

              <h3 className="text-2xl font-bold mt-10 mb-4">The Pavement Test for Hot Days</h3>
              <p>
                When the air temperature is 85°F (29°C), the asphalt can be a scorching 135°F (57°C) — hot enough to cause severe burns to your dog&apos;s paw pads within seconds.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl my-6">
                <h4 className="font-bold text-lg m-0 text-orange-800">The 7-Second Rule</h4>
                <p className="text-sm text-orange-700 mt-2 mb-0">
                  Place the back of your hand on the pavement. If you cannot hold it there comfortably for 7 seconds, it is too hot for your dog to walk on.
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-10 mb-4">Risk Factors to Consider</h3>
              <ul>
                <li><strong>Breed (Brachycephalic):</strong> Flat-faced breeds like Pugs, French Bulldogs, and Boxers have a much harder time panting effectively. They are at extreme risk in hot weather.</li>
                <li><strong>Coat Type:</strong> Huskies and Malamutes thrive in the cold but struggle in the heat. Conversely, short-haired breeds like Greyhounds get cold very quickly.</li>
                <li><strong>Age and Health:</strong> Puppies and senior dogs have a harder time regulating their body temperature. Dogs with heart or respiratory conditions should avoid extreme weather altogether.</li>
              </ul>

              <h3 className="text-2xl font-bold mt-10 mb-4">Great Alternatives to Outdoor Walks</h3>
              <p>
                Just because the weather is bad doesn&apos;t mean your dog has to miss out on exercise! If our calculator suggests it&apos;s dangerous outside, consider these alternatives:
              </p>
              <ol>
                <li><strong>Visit an <Link href="/" className="font-bold">Indoor Dog Park</Link>:</strong> These climate-controlled environments are perfect for socializing and burning off energy safely.</li>
                <li><strong>Indoor Agility Courses:</strong> Set up some pillows and chairs in your living room for a makeshift obstacle course.</li>
                <li><strong>Mental Stimulation (Puzzle Toys):</strong> Mental fatigue can be just as tiring as physical exercise. Try a snuffle mat or a stuffed Kong.</li>
                <li><strong>Hide and Seek:</strong> Hide treats around your house and let your dog use their nose to find them.</li>
              </ol>

            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
