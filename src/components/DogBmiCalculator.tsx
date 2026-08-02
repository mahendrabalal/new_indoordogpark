"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type BCSCategory = 'underweight' | 'ideal' | 'overweight' | 'obese';

interface BCSOption {
  id: BCSCategory;
  label: string;
  description: string;
  color: string;
  multiplier: number;
}

const bcsOptions: BCSOption[] = [
  {
    id: 'underweight',
    label: 'Underweight',
    description: 'Ribs, lumbar vertebrae, and pelvic bones easily visible. No palpable fat.',
    color: 'border-yellow-400 bg-yellow-50 text-yellow-800',
    multiplier: 1.15, // Need to gain ~15%
  },
  {
    id: 'ideal',
    label: 'Ideal Weight',
    description: 'Ribs palpable without excess fat. Waist easily observed behind ribs.',
    color: 'border-green-500 bg-green-50 text-green-800',
    multiplier: 1.0, // Ideal
  },
  {
    id: 'overweight',
    label: 'Overweight',
    description: 'Ribs palpable with difficulty; heavy fat cover. Noticeable fat deposits over lumbar area.',
    color: 'border-orange-500 bg-orange-50 text-orange-800',
    multiplier: 1.15, // Current is 115% of ideal -> Ideal = Current / 1.15
  },
  {
    id: 'obese',
    label: 'Obese',
    description: 'Massive fat deposits over thorax, spine, and base of tail. Waist absent.',
    color: 'border-red-500 bg-red-50 text-red-800',
    multiplier: 1.3, // Current is 130% of ideal
  }
];

export default function DogBmiCalculator() {
  const [weight, setWeight] = useState<string>('');
  const [bcs, setBcs] = useState<BCSCategory | null>(null);
  const [result, setResult] = useState<{ status: string; idealWeight: number; category: BCSOption } | null>(null);

  const calculateBMI = () => {
    const currentWeight = parseFloat(weight);
    if (isNaN(currentWeight) || currentWeight <= 0 || !bcs) return;

    const selectedBcs = bcsOptions.find(o => o.id === bcs)!;
    
    let idealWeight = currentWeight;
    if (selectedBcs.id === 'underweight') {
      idealWeight = currentWeight * selectedBcs.multiplier;
    } else if (selectedBcs.id === 'overweight' || selectedBcs.id === 'obese') {
      idealWeight = currentWeight / selectedBcs.multiplier;
    }

    setResult({
      status: selectedBcs.label,
      idealWeight: Math.round(idealWeight * 10) / 10,
      category: selectedBcs,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16 border border-gray-100 max-w-3xl mx-auto -mt-10 relative z-10">
      <div className="p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Check Your Dog's Healthy Weight</h2>
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              1. Current Weight (lbs)
            </label>
            <input
              type="number"
              min="1"
              max="250"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
              placeholder="e.g. 45"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">
              2. Select Body Condition Score (BCS)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bcsOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setBcs(option.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    bcs === option.id 
                      ? option.color + ' ring-2 ring-offset-2 ring-' + option.color.split('-')[1] + '-500 scale-[1.02]' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{option.label}</div>
                  <div className="text-sm opacity-80">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateBMI}
            disabled={!weight || !bcs}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Calculate Target Weight
          </button>
        </div>

        {result && (
          <div className="mt-10 p-8 bg-gray-50 rounded-2xl border border-gray-100 animate-slide-in">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Results</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                <div className={`inline-block px-4 py-1 rounded-full text-lg font-bold border ${result.category.color}`}>
                  {result.status}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Ideal Target Weight</p>
                <div className="text-4xl font-extrabold text-gray-900">
                  {result.idealWeight} <span className="text-xl text-gray-500 font-normal">lbs</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <h4 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                <i className="bi bi-lightbulb-fill text-yellow-500"></i> Next Steps
              </h4>
              {result.category.id === 'ideal' ? (
                <p className="text-gray-700">
                  Great job! Your dog is at a healthy weight. Keep up the good work with balanced meals and regular exercise. Finding local <Link href="/states" className="text-orange-600 font-bold hover:underline">indoor dog parks</Link> is a great way to maintain their weight year-round.
                </p>
              ) : result.category.id === 'underweight' ? (
                <p className="text-gray-700">
                  Your dog may need to gain a few pounds. Consider consulting your vet to adjust their caloric intake or switch to a higher-calorie food. Gentle exercise can help them build muscle mass.
                </p>
              ) : (
                <p className="text-gray-700">
                  To help your dog safely reach their ideal weight of {result.idealWeight} lbs, you should reduce their caloric intake and slowly increase their activity. Low-impact exercises like swimming or playing on soft turf at an <Link href="/states" className="text-orange-600 font-bold hover:underline">indoor dog park</Link> are perfect for protecting their joints while they lose weight!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
