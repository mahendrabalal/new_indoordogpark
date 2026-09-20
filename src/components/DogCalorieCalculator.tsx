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

export interface DogCalorieCalculatorProps {
  isEmbed?: boolean;
}

export default function DogCalorieCalculator({ isEmbed = false }: DogCalorieCalculatorProps) {
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
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 ${isEmbed ? 'm-0 shadow-sm border-slate-200' : 'mb-12'}`}>
      <div className={`bg-gradient-to-r from-emerald-600 to-teal-700 text-white ${isEmbed ? 'p-4 sm:p-6' : 'p-8 md:p-10'}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className={`${isEmbed ? 'text-xl sm:text-2xl' : 'text-3xl'} font-black flex items-center gap-3`}>
            <span>🥣</span> Daily Dog Calorie Calculator
          </h2>
          {isEmbed && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
              WSAVA & NRC Standards
            </span>
          )}
        </div>
        <p className="text-emerald-100 mt-2 text-sm sm:text-base">
          Calculate daily RER/MER caloric needs and feeding portion sizes.
        </p>
      </div>

      <div className={isEmbed ? 'p-4 sm:p-6' : 'p-8 md:p-10'}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              1. Dog&apos;s Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-base sm:text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              2. Life Stage & Activity Level
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm sm:text-base font-medium bg-white"
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
              3. Food Caloric Density (Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                value={kcalPerCup}
                onChange={(e) => setKcalPerCup(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-base font-medium"
                placeholder="e.g. 400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
                kcal / cup
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Average dry dog food is ~375–425 kcal/cup (found on the back of your food bag).
            </p>
          </div>

          <button
            type="button"
            onClick={calculateCalories}
            disabled={!weight}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-2"
          >
            Calculate Daily Calories
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 sm:p-8 bg-emerald-50 rounded-2xl border border-emerald-100 animate-slide-in">
            <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-6 text-center">Daily Feeding Recommendation</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-xl border border-emerald-200 text-center shadow-xs">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Daily Maintenance Goal (MER)</p>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
                  {result.mer} <span className="text-base text-emerald-600/70 font-normal">kcal/day</span>
                </div>
              </div>
              
              <div className={`bg-white p-5 rounded-xl border ${result.cups ? 'border-emerald-200 shadow-xs' : 'border-gray-200 opacity-50'} text-center`}>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Daily Portion</p>
                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  {result.cups ? result.cups : '-'} <span className="text-base text-gray-500 font-normal">cups/day</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <strong>Base Resting Rate (RER):</strong> ~{result.rer} kcal/day (basal energy needed at rest).
              </div>
            </div>
          </div>
        )}
      </div>

      {isEmbed && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Based on <strong>WSAVA & NRC Nutritional Standards</strong></span>
          </div>
          <Link
            href="https://www.indoordogpark.org/tools/dog-calorie-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
          >
            Powered by IndoorDogPark.org <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
    </div>
  );
}
