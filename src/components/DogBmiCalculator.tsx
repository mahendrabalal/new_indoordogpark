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

export interface DogBmiCalculatorProps {
  isEmbed?: boolean;
}

export default function DogBmiCalculator({ isEmbed = false }: DogBmiCalculatorProps) {
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
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 ${isEmbed ? 'm-0 shadow-sm border-slate-200' : 'mb-12'}`}>
      <div className={`bg-gradient-to-r from-blue-700 to-indigo-800 text-white ${isEmbed ? 'p-4 sm:p-6' : 'p-8 md:p-10'}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className={`${isEmbed ? 'text-xl sm:text-2xl' : 'text-3xl'} font-black flex items-center gap-3`}>
            <i className="bi bi-speedometer2 text-orange-400"></i>
            Dog Body Condition & Weight Checker
          </h2>
          {isEmbed && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
              WSAVA Standards
            </span>
          )}
        </div>
        <p className="text-blue-100 mt-2 text-sm sm:text-base">
          Determine your dog&apos;s Body Condition Score (BCS) and estimate their ideal weight target.
        </p>
      </div>

      <div className={isEmbed ? 'p-4 sm:p-6' : 'p-8 md:p-10'}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              1. Current Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 45"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-base sm:text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              2. Select Body Condition (Rib & Waist Feel)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bcsOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBcs(option.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                    bcs === option.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-sm text-gray-900 mb-1">{option.label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={calculateBMI}
            disabled={!weight || !bcs}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Calculate Target Weight
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-100 animate-slide-in">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 text-center">Your Assessment Results</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 text-center shadow-xs">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                <div className={`inline-block px-4 py-1 rounded-full text-base sm:text-lg font-bold border ${result.category.color}`}>
                  {result.status}
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 text-center shadow-xs">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ideal Target Weight</p>
                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  {result.idealWeight} <span className="text-base text-gray-500 font-normal">lbs</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-5 rounded-xl border border-blue-100 shadow-xs">
              <h4 className="font-bold text-base text-blue-900 mb-2 flex items-center gap-2">
                <i className="bi bi-lightbulb-fill text-yellow-500"></i> Recommended Next Steps
              </h4>
              {result.category.id === 'ideal' ? (
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Great job! Your dog is at a healthy weight. Keep up the good work with balanced meals and regular exercise.
                </p>
              ) : result.category.id === 'underweight' ? (
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Your dog may need to gain a few pounds. Consider consulting your vet to adjust their caloric intake or switch to a nutrient-dense food.
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  To help your dog safely reach their ideal weight of {result.idealWeight} lbs, reduce caloric intake and increase gentle exercise like swimming or soft turf walking at an indoor park.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {isEmbed && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Based on <strong>WSAVA Body Condition Standards</strong></span>
          </div>
          <Link
            href="https://www.indoordogpark.org/tools/dog-bmi-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1"
          >
            Powered by IndoorDogPark.org <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
    </div>
  );
}
