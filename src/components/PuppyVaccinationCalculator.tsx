'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <>
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
    </>
  );
}
