'use client';

import { useState, useMemo } from 'react';

type DogSize = 'small' | 'medium' | 'large' | 'giant';
type ActivityType = 'casual' | 'fetch' | 'sprint';

const MATRIX = {
  small: { casual: 50, fetch: 150, sprint: 200 },
  medium: { casual: 100, fetch: 300, sprint: 400 },
  large: { casual: 150, fetch: 500, sprint: 800 },
  giant: { casual: 250, fetch: 800, sprint: 1200 },
};

const SIZE_INFO = {
  small: { label: 'Small', desc: 'Under 20 lbs (e.g., Pug)', icon: 'bi-bug-fill' },
  medium: { label: 'Medium', desc: '20-50 lbs (e.g., Beagle)', icon: 'bi-moon-stars-fill' },
  large: { label: 'Large', desc: '50-90 lbs (e.g., Lab)', icon: 'bi-star-fill' },
  giant: { label: 'Giant', desc: '90+ lbs (e.g., Great Dane)', icon: 'bi-rocket-takeoff-fill' },
};

const ACTIVITY_INFO = {
  casual: { label: 'Casual / Tug', desc: 'Low velocity play', icon: 'bi-controller' },
  fetch: { label: 'Playing Fetch', desc: 'Medium velocity', icon: 'bi-bullseye' },
  sprint: { label: 'Full Sprint / Zoomies', desc: 'High velocity', icon: 'bi-lightning-fill' },
};

export default function SpaceEstimator() {
  const [size, setSize] = useState<DogSize>('medium');
  const [activity, setActivity] = useState<ActivityType>('fetch');

  const requiredSqFt = MATRIX[size][activity];

  const equivalentRoom = useMemo(() => {
    if (requiredSqFt <= 50) return '7x7 ft corner';
    if (requiredSqFt <= 100) return '10x10 ft small bedroom';
    if (requiredSqFt <= 150) return '10x15 ft average living room';
    if (requiredSqFt <= 200) return '10x20 ft large living room';
    if (requiredSqFt <= 300) return '15x20 ft open floor plan';
    if (requiredSqFt <= 400) return '20x20 ft standard 2-car garage';
    if (requiredSqFt <= 500) return '20x25 ft very large open basement';
    if (requiredSqFt <= 800) return '20x40 ft small indoor facility';
    return '30x40+ ft dedicated indoor park space';
  }, [requiredSqFt]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <i className="bi bi-rulers text-3xl text-emerald-400"></i>
          </div>
          <div>
            <h2 className="text-2xl font-black">Space Estimator</h2>
            <p className="text-slate-300 font-medium">Calculate the minimum safe area for indoor play.</p>
          </div>
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-5 gap-12">
        
        {/* Controls - Left side (3 columns) */}
        <div className="md:col-span-3 space-y-10">
          
          {/* Dog Size */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              1. Select Dog Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(SIZE_INFO) as DogSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col items-center text-center ${
                    size === s 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' 
                      : 'border-slate-100 text-slate-500 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <i className={`bi ${SIZE_INFO[s].icon} text-2xl mb-2 ${size === s ? 'text-emerald-500' : 'text-slate-400'}`}></i>
                  <span className="font-bold text-sm block">{SIZE_INFO[s].label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-2 italic text-center">
              {SIZE_INFO[size].desc}
            </p>
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              2. Planned Activity
            </label>
            <div className="flex flex-col gap-3">
              {(Object.keys(ACTIVITY_INFO) as ActivityType[]).map((act) => (
                <button
                  key={act}
                  onClick={() => setActivity(act)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    activity === act 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' 
                      : 'border-slate-100 text-slate-600 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-lg">{ACTIVITY_INFO[act].label}</span>
                    <span className={`text-sm ${activity === act ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {ACTIVITY_INFO[act].desc}
                    </span>
                  </div>
                  <i className={`bi ${ACTIVITY_INFO[act].icon} text-2xl ${activity === act ? 'text-emerald-500' : 'text-slate-300'}`}></i>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results - Right side (2 columns) */}
        <div className="md:col-span-2">
          <div className="bg-slate-900 rounded-3xl p-8 h-full flex flex-col justify-center relative overflow-hidden text-center shadow-inner">
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative z-10">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4">
                Required Open Space
              </p>
              
              <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                {requiredSqFt} <span className="text-3xl text-emerald-400 font-bold">sq ft</span>
              </div>
              
              <div className="inline-block border border-slate-700 bg-slate-800 rounded-full px-4 py-2 mt-4 mb-8">
                <span className="text-slate-300 font-medium text-sm flex items-center gap-2">
                  <i className="bi bi-house-door"></i>
                  Equivalent to a {equivalentRoom}
                </span>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 text-left">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill text-amber-500"></i> Safety First
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  This calculation assumes <strong className="text-slate-300">unobstructed space</strong>. 
                  Dogs lack spatial awareness when highly aroused. Remove coffee tables, breakables, and ensure non-slip flooring.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
