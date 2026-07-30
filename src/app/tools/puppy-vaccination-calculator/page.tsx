'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PuppyVaccinationCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [timeline, setTimeline] = useState<any[] | null>(null);

  const calculateTimeline = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const addWeeks = (date: Date, weeks: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + weeks * 7);
      return result;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const newTimeline = [
      {
        week: '6-8 Weeks',
        date: `${formatDate(addWeeks(birth, 6))} - ${formatDate(addWeeks(birth, 8))}`,
        title: 'First Round of Shots',
        description: 'DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus) #1',
        safeForParks: false
      },
      {
        week: '10-12 Weeks',
        date: `${formatDate(addWeeks(birth, 10))} - ${formatDate(addWeeks(birth, 12))}`,
        title: 'Second Round of Shots',
        description: 'DHPP #2',
        safeForParks: false
      },
      {
        week: '14-16 Weeks',
        date: `${formatDate(addWeeks(birth, 14))} - ${formatDate(addWeeks(birth, 16))}`,
        title: 'Final Puppy Shots',
        description: 'DHPP #3 & Rabies Vaccine',
        safeForParks: false
      },
      {
        week: '18 Weeks',
        date: formatDate(addWeeks(birth, 18)),
        title: 'Fully Protected & Ready to Play!',
        description: 'Two weeks after final shots, immunity is fully built up.',
        safeForParks: true
      }
    ];

    setTimeline(newTimeline);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header variant="light" />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Puppy Vaccination & Park Readiness Calculator
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find out exactly when it's safe to take your puppy to the dog park.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Enter Puppy Details</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Puppy's Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900"
              />
            </div>
            
            <button
              onClick={calculateTimeline}
              disabled={!birthDate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
            >
              Calculate Readiness Timeline
            </button>
          </div>

          {timeline && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Your Custom Vaccination Timeline</h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${item.safeForParks ? 'bg-emerald-500 text-white shadow-emerald-500/50 shadow-lg scale-110' : ''}`}>
                      <i className={`bi ${item.safeForParks ? 'bi-check-lg' : 'bi-calendar3'} text-lg`}></i>
                    </div>
                    
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl shadow-md border ${item.safeForParks ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm ${item.safeForParks ? 'text-emerald-600' : 'text-indigo-600'}`}>{item.week}</span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{item.date}</span>
                      </div>
                      <h4 className={`text-lg font-bold mb-1 ${item.safeForParks ? 'text-emerald-900' : 'text-slate-800'}`}>{item.title}</h4>
                      <p className={`text-sm ${item.safeForParks ? 'text-emerald-700' : 'text-slate-600'}`}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
                <p className="font-semibold mb-2"><i className="bi bi-info-circle-fill mr-2"></i> Important Disclaimer</p>
                <p>This timeline is an estimate based on standard veterinary practices (AAHA guidelines). Always consult with your veterinarian before taking your puppy to public spaces or dog parks, as local disease risks and individual vaccine schedules may vary.</p>
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/parks" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                  Find a Dog Park Near You <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* SEO Content Section for Backlink Value */}
        <section className="bg-white py-16 px-4 border-t border-slate-100">
          <div className="max-w-4xl mx-auto prose prose-slate lg:prose-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why is it dangerous to take a puppy to a dog park too early?</h2>
            <p className="text-slate-600 mb-4">
              Dog parks are high-traffic areas where diseases can easily spread. Puppies do not have a fully developed immune system until they have completed their entire vaccination series.
            </p>
            <p className="text-slate-600 mb-4">
              The most significant threat to a young puppy is <strong>Canine Parvovirus (Parvo)</strong>. Parvo is highly contagious, easily transmitted through contaminated feces or soil, and can survive in the environment for months or even years. Because <Link href="/parks" className="text-indigo-600 hover:underline">public dog parks</Link> see so many dogs, the soil is often heavily contaminated.
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How the Parvo Vaccine Works</h3>
            <p className="text-slate-600 mb-4">
              When a puppy is born, they receive maternal antibodies from their mother's milk. These antibodies temporarily protect the puppy but also interfere with the effectiveness of vaccines. As maternal antibodies fade (usually between 6 and 14 weeks), the puppy becomes vulnerable.
            </p>
            <p className="text-slate-600 mb-4">
              Because it's impossible to know exactly when a specific puppy's maternal antibodies drop off without expensive testing, veterinarians administer a series of DHPP shots every 2 to 4 weeks. This ensures that as soon as the maternal antibodies wane, a vaccine is given to stimulate the puppy's own immune system to create long-lasting protection.
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">The "Two Week" Rule</h3>
            <p className="text-slate-600 mb-4">
              Even after the final shot is administered at 14-16 weeks, the puppy is not instantly protected. It takes the immune system approximately 10 to 14 days to fully respond to the vaccine and build up immunity. This is why our calculator recommends waiting until <strong>18 weeks of age</strong> before visiting high-risk areas like <Link href="/parks" className="text-indigo-600 hover:underline">dog parks</Link>. Once your puppy is fully vaccinated, check out our <Link href="/tools/dog-park-packing-list-generator" className="text-indigo-600 hover:underline">dog park packing list generator</Link> to ensure you bring everything you need for their first big adventure!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
