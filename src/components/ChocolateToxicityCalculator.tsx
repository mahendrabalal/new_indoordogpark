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

export default function ChocolateToxicityCalculator() {
  const [weightLbs, setWeightLbs] = useState<string>('30');
  const [chocolateType, setChocolateType] = useState<ChocolateType>('milk');
  const [amountOz, setAmountOz] = useState<string>('2');

  const weight = parseFloat(weightLbs) || 0;
  const amount = parseFloat(amountOz) || 0;
  const weightKg = weight * 0.4536;

  const theobromineMg = amount * CHOCOLATE_DATA[chocolateType].theobromineMgPerOz;
  const mgPerKg = weightKg > 0 ? theobromineMg / weightKg : 0;
  const severity = getSeverity(mgPerKg);

  const isValidInput = weight > 0 && amount > 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-12 transform transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="p-8 text-white" style={{ background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)' }}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-8 h-8 text-yellow-300" />
          Chocolate Toxicity Calculator
        </h2>
        <p className="text-amber-100 opacity-90">Determine if the amount of chocolate your dog ate is dangerous. Always call your vet if in doubt.</p>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-10">
        {/* Inputs */}
        <div className="space-y-6">
          {/* Dog Weight */}
          <div>
            <label htmlFor="dog-weight" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Dog&apos;s Weight (lbs)
            </label>
            <input
              id="dog-weight"
              type="number"
              min="1"
              max="300"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-lg font-semibold text-gray-800 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="e.g. 30"
            />
            <p className="text-xs text-gray-400 mt-1">{weightKg > 0 ? `≈ ${weightKg.toFixed(1)} kg` : ''}</p>
          </div>

          {/* Chocolate Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type of Chocolate</label>
            <div className="space-y-2">
              {(Object.entries(CHOCOLATE_DATA) as [ChocolateType, typeof CHOCOLATE_DATA[ChocolateType]][]).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setChocolateType(key)}
                  className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    chocolateType === key
                      ? 'bg-amber-800 text-white shadow-md border-2 border-transparent'
                      : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-amber-300'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: data.color }}
                  />
                  <span>{data.label}</span>
                  <span className="ml-auto text-xs opacity-70">{data.theobromineMgPerOz} mg/oz</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="chocolate-amount" className="block text-sm font-semibold text-gray-700 mb-2">
              Amount Eaten (ounces)
            </label>
            <input
              id="chocolate-amount"
              type="number"
              min="0.1"
              max="100"
              step="0.5"
              value={amountOz}
              onChange={(e) => setAmountOz(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-lg font-semibold text-gray-800 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="e.g. 2"
            />
            <p className="text-xs text-gray-400 mt-1">1 oz ≈ 28g &bull; A standard candy bar is ~1.5 oz</p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: isValidInput ? severity.bgColor : '#f8fafc' }}>
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

                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Theobromine Dose</p>
                  <div className="text-3xl font-extrabold" style={{ color: severity.color }}>
                    {mgPerKg.toFixed(1)} <span className="text-lg text-gray-400 font-medium">mg/kg body weight</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Total theobromine: {theobromineMg.toFixed(0)} mg</p>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-6">{severity.description}</p>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-2" style={{ borderColor: severity.color }}>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: severity.color }} />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Emergency Contacts</p>
                    <p className="text-sm text-gray-600 mt-1"><strong>ASPCA Poison Control:</strong> (888) 426-4435</p>
                    <p className="text-sm text-gray-600"><strong>Pet Poison Helpline:</strong> (855) 764-7661</p>
                    <p className="text-xs text-gray-400 mt-2">Consultation fees may apply</p>
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
    </div>
  );
}
