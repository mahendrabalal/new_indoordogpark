'use client';

import { useState, useEffect } from 'react';

export interface HydrationCalculatorProps {
  isEmbed?: boolean;
}

export default function HydrationCalculator({ isEmbed = false }: HydrationCalculatorProps) {
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
    <div className={`bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden ${isEmbed ? 'm-0 shadow-sm border-slate-200' : ''}`}>
      
      {/* Header */}
      <div className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white ${isEmbed ? 'p-4 sm:p-6' : 'p-8'}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-xs">
              <i className="bi bi-droplet-half text-2xl sm:text-3xl"></i>
            </div>
            <div>
              <h2 className={`${isEmbed ? 'text-xl sm:text-2xl' : 'text-2xl'} font-black`}>Dog Hydration Calculator</h2>
              <p className="text-blue-50 text-xs sm:text-sm font-medium">Daily fluid needs based on weight, heat, and exercise.</p>
            </div>
          </div>
          {isEmbed && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
              Merck Vet Manual
            </span>
          )}
        </div>
      </div>

      <div className={`${isEmbed ? 'p-4 sm:p-6' : 'p-8'} grid ${isEmbed ? 'grid-cols-1 md:grid-cols-5' : 'md:grid-cols-5'} gap-6 md:gap-10`}>
        
        {/* Controls - Left side (3 columns) */}
        <div className="md:col-span-3 space-y-5">
          
          {/* Weight */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              1. Dog&apos;s Weight (lbs)
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 50"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-base sm:text-lg font-bold text-slate-800"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                lbs
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              2. Activity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Low', sub: 'Couch Potato' },
                { id: 'moderate', label: 'Moderate', sub: 'Daily Walks' },
                { id: 'high', label: 'High', sub: 'Parks & Agility' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivity(item.id as 'low' | 'moderate' | 'high')}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 text-center transition-all ${
                    activity === item.id 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">{item.label}</div>
                  <div className="text-[10px] opacity-75">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Climate */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              3. Outdoor Climate
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setClimate('normal')}
                className={`py-2.5 px-3 rounded-xl border-2 font-bold flex items-center justify-center gap-2 text-xs sm:text-sm transition-all ${
                  climate === 'normal' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <i className="bi bi-cloud-sun text-base"></i> Normal / Mild
              </button>
              <button
                type="button"
                onClick={() => setClimate('hot')}
                className={`py-2.5 px-3 rounded-xl border-2 font-bold flex items-center justify-center gap-2 text-xs sm:text-sm transition-all ${
                  climate === 'hot' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <i className="bi bi-thermometer-sun text-base"></i> Hot & Humid
              </button>
            </div>
          </div>

        </div>

        {/* Results - Right side (2 columns) */}
        <div className="md:col-span-2">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-center relative overflow-hidden text-center">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">
              Daily Target Water Intake
            </p>
            
            <div className="text-5xl sm:text-6xl font-black text-blue-600 mb-1">
              {ounces} <span className="text-xl sm:text-2xl text-blue-400">oz</span>
            </div>
            
            <div className="text-lg sm:text-xl font-bold text-slate-700 mb-6">
              approx {cups} cups
            </div>

            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-blue-50 flex items-start text-left gap-2.5">
              <i className="bi bi-info-circle-fill text-blue-500 mt-0.5 text-sm"></i>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active dogs in hot weather lose water quickly through panting. Always ensure clean water is available.
              </p>
            </div>
          </div>
        </div>

      </div>

      {isEmbed && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span>Based on <strong>Merck Veterinary Fluid Guidelines</strong></span>
          </div>
          <a
            href="https://www.indoordogpark.org/tools/dog-hydration-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 hover:text-cyan-900 font-bold inline-flex items-center gap-1"
          >
            Powered by IndoorDogPark.org <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
