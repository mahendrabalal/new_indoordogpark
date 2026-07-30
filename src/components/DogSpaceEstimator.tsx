'use client';

import { useState } from 'react';
import Link from 'next/link';

type DogSize = 'small' | 'medium' | 'large' | 'giant';
type ActivityLevel = 'sniffing' | 'training' | 'fetch' | 'sprinting';

export default function DogSpaceEstimator() {
  const [size, setSize] = useState<DogSize | ''>('');
  const [activity, setActivity] = useState<ActivityLevel | ''>('');
  const [result, setResult] = useState<{ sqft: number; description: string; dimension: string } | null>(null);

  const calculateSpace = () => {
    if (!size || !activity) return;

    let sqft = 0;
    let dimension = '';
    let description = '';

    // Base logic for calculating minimum safe square footage
    if (activity === 'sniffing') {
      sqft = size === 'small' ? 200 : size === 'medium' ? 400 : size === 'large' ? 600 : 800;
      dimension = size === 'small' ? '10x20 ft' : size === 'medium' ? '20x20 ft' : size === 'large' ? '20x30 ft' : '20x40 ft';
      description = 'For casual sniffing and wandering, you don\'t need a massive area. A small patio, apartment living room, or tiny yard works fine as long as there are interesting smells or puzzle toys involved.';
    } else if (activity === 'training') {
      sqft = size === 'small' ? 400 : size === 'medium' ? 800 : size === 'large' ? 1200 : 1500;
      dimension = size === 'small' ? '20x20 ft' : size === 'medium' ? '20x40 ft' : size === 'large' ? '30x40 ft' : '30x50 ft';
      description = 'Basic obedience and light agility training requires enough room for your dog to walk by your side, pivot, and lie down without hitting walls or furniture.';
    } else if (activity === 'fetch') {
      sqft = size === 'small' ? 800 : size === 'medium' ? 1500 : size === 'large' ? 2500 : 3500;
      dimension = size === 'small' ? '20x40 ft' : size === 'medium' ? '30x50 ft' : size === 'large' ? '40x60 ft' : '50x70 ft';
      description = 'A good game of fetch requires enough linear distance for the dog to build up speed, grab the toy, and safely decelerate. Avoid slippery indoor floors for this activity!';
    } else if (activity === 'sprinting') {
      sqft = size === 'small' ? 1200 : size === 'medium' ? 3000 : size === 'large' ? 5000 : 7000;
      dimension = size === 'small' ? '30x40 ft' : size === 'medium' ? '50x60 ft' : size === 'large' ? '50x100 ft' : '70x100 ft';
      description = 'Full-speed "zoomies" and sprinting require significant open space. Large dogs can cover 20-30 feet per second, so they need a long runway to sprint and brake safely without colliding with fences or walls.';
    }

    setResult({ sqft, description, dimension });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl mx-auto">
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Estimate Required Space</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">
              1. Your Dog's Size
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'small', label: 'Small', weight: '< 20 lbs', icon: 'bi-bug' },
                { id: 'medium', label: 'Medium', weight: '20-50 lbs', icon: 'bi-moon' },
                { id: 'large', label: 'Large', weight: '50-90 lbs', icon: 'bi-moon-fill' },
                { id: 'giant', label: 'Giant', weight: '90+ lbs', icon: 'bi-globe' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSize(s.id as DogSize); setResult(null); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    size === s.id
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${size === s.id ? 'text-indigo-900' : 'text-slate-800'}`}>{s.label}</span>
                    <i className={`bi ${s.icon} ${size === s.id ? 'text-indigo-500' : 'text-slate-400'}`}></i>
                  </div>
                  <span className={`text-xs ${size === s.id ? 'text-indigo-700' : 'text-slate-500'}`}>{s.weight}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">
              2. Activity Type
            </label>
            <div className="flex flex-col gap-3">
              {[
                { id: 'sniffing', label: 'Casual Sniffing & Walking', desc: 'Mental enrichment, slow pace' },
                { id: 'training', label: 'Basic Training & Agility', desc: 'Obedience, pivoting, short movements' },
                { id: 'fetch', label: 'Playing Fetch', desc: 'Short sprints, sudden stops' },
                { id: 'sprinting', label: 'Full Sprinting & Zoomies', desc: 'Top speed running, wide turns' },
              ].map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setActivity(a.id as ActivityLevel); setResult(null); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    activity === a.id
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div>
                    <span className={`block font-bold mb-0.5 ${activity === a.id ? 'text-indigo-900' : 'text-slate-800'}`}>{a.label}</span>
                    <span className={`text-xs ${activity === a.id ? 'text-indigo-700' : 'text-slate-500'}`}>{a.desc}</span>
                  </div>
                  {activity === a.id && <i className="bi bi-check-circle-fill text-indigo-500 text-xl"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={calculateSpace}
          disabled={!size || !activity}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
        >
          Calculate Minimum Space Required
        </button>

        {/* Results Section */}
        {result && (
          <div className="mt-8 animate-fade-in border-t border-slate-100 pt-8">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-lg shadow-indigo-600/20 relative overflow-hidden">
              <i className="bi bi-rulers absolute -right-4 -bottom-4 text-9xl text-white/10 rotate-[-15deg]"></i>
              <h3 className="text-xl text-indigo-100 font-bold mb-2 relative z-10">Recommended Minimum Space:</h3>
              <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight relative z-10">
                {result.sqft.toLocaleString()} <span className="text-2xl md:text-3xl font-bold opacity-80">sq ft</span>
              </div>
              <p className="text-indigo-200 font-medium text-lg relative z-10 mb-6">
                (Roughly {result.dimension})
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-left relative z-10">
                <div className="flex gap-3">
                  <i className="bi bi-info-circle-fill text-xl text-indigo-200 shrink-0"></i>
                  <p className="text-white text-sm md:text-base leading-relaxed">
                    {result.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Living in an apartment?</h4>
                <p className="text-sm text-slate-600 mb-4">If you don't have this much space at home, you'll need to rely on public spaces or facilities.</p>
                <Link href="/parks" className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                  Find indoor dog parks near you <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-2">Safety Warning</h4>
                <p className="text-sm text-amber-800">
                  When playing indoors on hard floors (like wood or tile), dogs can easily slip and tear a cruciate ligament (CCL). Always ensure they have traction (like rugs) before engaging in high-speed play indoors.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
