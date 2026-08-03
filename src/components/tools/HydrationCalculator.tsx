'use client';

import { useState, useEffect } from 'react';

export default function HydrationCalculator() {
  const [weight, setWeight] = useState<number | ''>(50);
  const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [climate, setClimate] = useState<'normal' | 'hot'>('normal');

  const [ounces, setOunces] = useState(0);
  const [cups, setCups] = useState(0);

  // Calculate logic
  useEffect(() => {
    if (typeof weight !== 'number' || weight <= 0) {
      setOunces(0);
      setCups(0);
      return;
    }

    // Base: 1 oz per lb
    let totalOz = weight * 1.0;

    // Activity multiplier
    if (activity === 'high') {
      totalOz += (weight * 0.5); // Add 0.5oz per lb for high activity
    } else if (activity === 'low') {
      totalOz -= (weight * 0.2); // Subtract 0.2oz per lb for low activity
    }

    // Climate multiplier
    if (climate === 'hot') {
      totalOz += (weight * 0.5); // Add 0.5oz per lb for hot climate
    }

    // Convert to cups (1 cup = 8 oz)
    const totalCups = totalOz / 8;

    setOunces(Math.round(totalOz));
    setCups(Math.round(totalCups * 10) / 10); // Round to 1 decimal place
  }, [weight, activity, climate]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <i className="bi bi-droplet-half text-3xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-black">Hydration Calculator</h2>
            <p className="text-blue-50 font-medium">Find out exactly how much water your dog needs.</p>
          </div>
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-5 gap-12">
        
        {/* Controls - Left side (3 columns) */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Weight */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Dog's Weight (lbs)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="250"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-3xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 50"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">lbs</span>
            </div>
            
            <input 
              type="range" 
              min="1" 
              max="200" 
              value={typeof weight === 'number' ? weight : 1}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full mt-6 accent-blue-500"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Activity Level Today
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'moderate', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActivity(level)}
                  className={`py-3 px-4 rounded-xl border-2 font-bold capitalize transition-all ${
                    activity === level 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Climate */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Climate / Environment
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setClimate('normal')}
                className={`py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${
                  climate === 'normal' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <i className="bi bi-cloud-sun text-lg"></i> Normal
              </button>
              <button
                onClick={() => setClimate('hot')}
                className={`py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${
                  climate === 'hot' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <i className="bi bi-thermometer-sun text-lg"></i> Hot & Humid
              </button>
            </div>
          </div>

        </div>

        {/* Results - Right side (2 columns) */}
        <div className="md:col-span-2">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 h-full flex flex-col justify-center relative overflow-hidden">
            
            {/* Background decorative wave */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-blue-100/50 rounded-t-full -mb-16 -mx-8"></div>
            
            <div className="relative z-10 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                Daily Water Target
              </p>
              
              <div className="text-6xl font-black text-blue-600 mb-1">
                {ounces} <span className="text-2xl text-blue-400">oz</span>
              </div>
              
              <div className="text-xl font-bold text-slate-700 mb-8">
                approx {cups} cups
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50 flex items-start text-left gap-3">
                <i className="bi bi-info-circle-fill text-blue-500 mt-1"></i>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Active dogs in hot weather lose water quickly through panting. Always ensure clean, fresh water is available.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
