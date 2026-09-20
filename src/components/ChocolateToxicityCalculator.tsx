'use client';

import React, { useState } from 'react';
import { ExclamationTriangleIcon, ShieldCheckIcon, PhoneIcon } from '@heroicons/react/24/outline';

type ChocolateType = 'white' | 'milk' | 'dark' | 'baking' | 'cocoa';

const CHOCOLATE_DATA: Record<ChocolateType, { label: string; theobromineMgPerOz: number; color: string }> = {
  white:  { label: 'White Chocolate',           theobromineMgPerOz: 0.25,  color: '#FFF8E1' },
  milk:   { label: 'Milk Chocolate',            theobromineMgPerOz: 58,    color: '#8D6E63' },
  dark:   { label: 'Dark Chocolate (60-70%)',    theobromineMgPerOz: 155,   color: '#4E342E' },
  baking: { label: 'Baking / Unsweetened',       theobromineMgPerOz: 420,   color: '#3E2723' },
  cocoa:  { label: 'Dry Cocoa Powder',           theobromineMgPerOz: 570,   color: '#5D4037' },
};

type Severity = 'none' | 'mild' | 'moderate' | 'severe';

function getSeverity(mgPerKg: number): { level: Severity; title: string; description: string; color: string; bgColor: string } {
  if (mgPerKg < 20) {
    return {
      level: 'none',
      title: 'Low Risk',
      description: 'This amount is unlikely to cause serious toxicity, but minor stomach upset (vomiting, diarrhea) is still possible. Monitor your dog closely.',
      color: '#16a34a',
      bgColor: '#f0fdf4',
    };
  } else if (mgPerKg < 40) {
    return {
      level: 'mild',
      title: 'Mild to Moderate Risk',
      description: 'Your dog may experience vomiting, diarrhea, restlessness, increased urination, and elevated heart rate. Contact your veterinarian.',
      color: '#ca8a04',
      bgColor: '#fefce8',
    };
  } else if (mgPerKg < 60) {
    return {
      level: 'moderate',
      title: 'Moderate to Severe Risk',
      description: 'This dose can cause significant cardiac symptoms including rapid heart rate, muscle tremors, and hyperactivity. Seek veterinary care immediately.',
      color: '#ea580c',
      bgColor: '#fff7ed',
    };
  } else {
    return {
      level: 'severe',
      title: 'SEVERE — Emergency',
      description: 'This is a potentially life-threatening dose. Seizures, cardiac failure, and death are possible. Rush your dog to an emergency vet NOW.',
      color: '#dc2626',
      bgColor: '#fef2f2',
    };
  }
}

export interface ChocolateToxicityCalculatorProps {
  isEmbed?: boolean;
}

export default function ChocolateToxicityCalculator({ isEmbed = false }: ChocolateToxicityCalculatorProps) {
  const [weightLbs, setWeightLbs] = useState<string>('30');
  const [chocolateType, setChocolateType] = useState<ChocolateType>('milk');
  const [amountOz, setAmountOz] = useState<string>('2');

  const weight = parseFloat(weightLbs) || 0;
  const amount = parseFloat(amountOz) || 0;
  const weightKg = weight * 0.453592;

  const theobromineMg = amount * CHOCOLATE_DATA[chocolateType].theobromineMgPerOz;
  const mgPerKg = weightKg > 0 ? theobromineMg / weightKg : 0;
  const severity = getSeverity(mgPerKg);

  const isValidInput = weight > 0 && amount > 0;

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ${isEmbed ? 'm-0 shadow-sm border-slate-200' : 'mb-12'}`}>
      {/* Header */}
      <div className={`p-6 text-white ${isEmbed ? 'p-4 sm:p-5' : 'p-6 md:p-8'}`} style={{ background: 'linear-gradient(135deg, #4E342E 0%, #3E2723 100%)' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className={`${isEmbed ? 'text-xl sm:text-2xl' : 'text-2xl md:text-3xl'} font-bold flex items-center gap-2.5`}>
            <span>🍫</span> Chocolate Toxicity Calculator
          </h2>
          {isEmbed && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
              ASPCA APCC Standards
            </span>
          )}
        </div>
        <p className="text-amber-200 text-sm mt-1">
          Calculate theobromine dose & emergency toxicity risk for your dog.
        </p>
      </div>

      <div className={`${isEmbed ? 'p-4 sm:p-6' : 'p-6 md:p-8'} grid ${isEmbed ? 'grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2'} gap-6 md:gap-8`}>
        {/* Controls */}
        <div className="space-y-5">
          {/* Dog Weight */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Dog&apos;s Weight (lbs)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="250"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="e.g. 30"
              />
              <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">lbs ({weightKg.toFixed(1)} kg)</span>
            </div>
          </div>

          {/* Chocolate Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Type of Chocolate Ingested
            </label>
            <div className="space-y-2">
              {(Object.keys(CHOCOLATE_DATA) as ChocolateType[]).map((type) => {
                const item = CHOCOLATE_DATA[type];
                const isSelected = chocolateType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChocolateType(type)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold shadow-xs'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm">{item.label}</span>
                    <span className="text-xs text-gray-400 font-mono">~{item.theobromineMgPerOz} mg/oz</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Eaten */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Amount Eaten (ounces)
            </label>
            <input
              type="number"
              min="0.1"
              max="100"
              step="0.5"
              value={amountOz}
              onChange={(e) => setAmountOz(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-800"
              placeholder="e.g. 2"
            />
            <p className="text-xs text-gray-400 mt-1">1 oz ≈ 28g &bull; A standard candy bar is ~1.5 oz</p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: isValidInput ? severity.bgColor : '#f8fafc' }}>
          {isValidInput ? (
            <>
              {/* Severity Badge */}
              <div>
                <div
                  className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4 text-white"
                  style={{ backgroundColor: severity.color }}
                >
                  {severity.title}
                </div>

                <div className="bg-white rounded-xl p-5 shadow-xs mb-5">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Theobromine Dose</p>
                  <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: severity.color }}>
                    {mgPerKg.toFixed(1)} <span className="text-base text-gray-400 font-medium">mg/kg body weight</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Total theobromine: {theobromineMg.toFixed(0)} mg</p>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-5">{severity.description}</p>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl p-4 shadow-xs border-2" style={{ borderColor: severity.color }}>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: severity.color }} />
                  <div>
                    <p className="font-bold text-gray-800 text-xs sm:text-sm">24/7 Emergency Hotlines</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5"><strong>ASPCA Poison Control:</strong> (888) 426-4435</p>
                    <p className="text-xs sm:text-sm text-gray-600"><strong>Pet Poison Helpline:</strong> (855) 764-7661</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShieldCheckIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium">Enter your dog&apos;s weight and the amount of chocolate eaten to see results.</p>
            </div>
          )}
        </div>
      </div>

      {isEmbed && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>Based on <strong>ASPCA APCC & Merck Manual Guidelines</strong></span>
          </div>
          <a
            href="https://www.indoordogpark.org/tools/chocolate-toxicity-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-900 hover:text-amber-700 font-bold inline-flex items-center gap-1"
          >
            Powered by IndoorDogPark.org <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
