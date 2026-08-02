"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface MerOption {
  id: string;
  label: string;
  multiplier: number;
}

const merOptions: MerOption[] = [
  { id: 'neutered', label: 'Spayed / Neutered Adult (Normal Activity)', multiplier: 1.6 },
  { id: 'intact', label: 'Intact Adult (Normal Activity)', multiplier: 1.8 },
  { id: 'inactive', label: 'Senior or Inactive / Couch Potato', multiplier: 1.2 },
  { id: 'weight_loss', label: 'Weight Loss (Overweight)', multiplier: 1.0 },
  { id: 'active', label: 'Highly Active (Agility, Dog Parks)', multiplier: 2.0 },
  { id: 'puppy_young', label: 'Puppy (0-4 Months)', multiplier: 3.0 },
  { id: 'puppy_old', label: 'Puppy (4 Months to 1 Year)', multiplier: 2.0 },
];

export default function DogCalorieCalculator() {
  const [weight, setWeight] = useState<string>('');
  const [stage, setStage] = useState<string>('neutered');
  const [kcalPerCup, setKcalPerCup] = useState<string>('400'); // Default average
  const [result, setResult] = useState<{ rer: number; mer: number; cups: number | null } | null>(null);

  const calculateCalories = () => {
    const currentWeightLbs = parseFloat(weight);
    if (isNaN(currentWeightLbs) || currentWeightLbs <= 0) return;

    // 1. Convert lbs to kg
    const weightKg = currentWeightLbs / 2.20462;

    // 2. Calculate Resting Energy Requirement (RER)
    // Formula: 70 * (Weight in kg)^0.75
    const rer = 70 * Math.pow(weightKg, 0.75);

    // 3. Calculate Maintenance Energy Requirement (MER)
    const selectedStage = merOptions.find(o => o.id === stage);
    const multiplier = selectedStage ? selectedStage.multiplier : 1.6;
    const mer = rer * multiplier;

    // 4. Calculate Cups (if kcal/cup is provided)
    const density = parseFloat(kcalPerCup);
    let cups = null;
    if (!isNaN(density) && density > 0) {
      cups = mer / density;
    }

    setResult({
      rer: Math.round(rer),
      mer: Math.round(mer),
      cups: cups ? Math.round(cups * 10) / 10 : null,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16 border border-gray-100 max-w-3xl mx-auto -mt-10 relative z-10">
      <div className="p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Calculate Daily Calories</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              1. Dog's Weight (lbs)
            </label>
            <input
              type="number"
              min="1"
              max="250"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              2. Life Stage & Activity Level
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg bg-white"
            >
              {merOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              3. Food Calorie Density (Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                value={kcalPerCup}
                onChange={(e) => setKcalPerCup(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                placeholder="e.g. 400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                kcal / cup
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Check the back of your dog food bag for this number to calculate portion sizes. 400 is the average for dry kibble.
            </p>
          </div>

          <button
            onClick={calculateCalories}
            disabled={!weight}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4"
          >
            Calculate Calories
          </button>
        </div>

        {result && (
          <div className="mt-10 p-8 bg-emerald-50 rounded-2xl border border-emerald-100 animate-slide-in">
            <h3 className="text-xl font-bold text-emerald-900 mb-6 text-center">Feeding Recommendation</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-emerald-200 text-center shadow-sm">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Daily Goal</p>
                <div className="text-4xl font-extrabold text-emerald-600">
                  {result.mer} <span className="text-xl text-emerald-600/70 font-normal">kcal</span>
                </div>
              </div>
              
              <div className={`bg-white p-6 rounded-xl border ${result.cups ? 'border-emerald-200 shadow-sm' : 'border-gray-200 opacity-50'} text-center`}>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Portion Size</p>
                <div className="text-4xl font-extrabold text-gray-900">
                  {result.cups ? result.cups : '-'} <span className="text-xl text-gray-500 font-normal">cups</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 text-sm text-gray-700">
                <strong>Base Metabolism (RER):</strong> If your dog did absolutely nothing all day but sleep, they would burn ~{result.rer} calories.
              </div>
              
              {stage === 'active' && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-sm text-orange-900">
                  <strong>Highly Active Dogs:</strong> Since your dog is highly active, they require significantly more fuel! If you frequently visit <Link href="/states" className="font-bold underline">indoor dog parks</Link> or agility courses, ensure they are getting enough high-quality protein to support muscle recovery.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
