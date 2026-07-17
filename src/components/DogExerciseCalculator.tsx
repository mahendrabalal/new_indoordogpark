'use client';

import React, { useState } from 'react';
import { ChartBarIcon, ClockIcon, BoltIcon, HeartIcon } from '@heroicons/react/24/outline';

type AgeGroup = 'puppy' | 'adult' | 'senior';
type Size = 'small' | 'medium' | 'large' | 'giant';
type EnergyLevel = 'low' | 'medium' | 'high';

export default function DogExerciseCalculator() {
  const [age, setAge] = useState<AgeGroup>('adult');
  const [size, setSize] = useState<Size>('medium');
  const [energy, setEnergy] = useState<EnergyLevel>('medium');

  const calculateExercise = () => {
    // Base minutes
    let minMinutes = 30;
    let maxMinutes = 60;
    
    // Adjust by age
    if (age === 'puppy') {
      minMinutes = 20; // 5 mins per month of age rule applied broadly
      maxMinutes = 40;
    } else if (age === 'senior') {
      minMinutes = 20;
      maxMinutes = 45;
    }

    // Adjust by energy
    if (energy === 'high') {
      minMinutes += 30;
      maxMinutes += 60;
    } else if (energy === 'low') {
      minMinutes = Math.max(15, minMinutes - 10);
      maxMinutes = Math.max(30, maxMinutes - 15);
    }

    // Size adjustments (Giants need less intense, small need shorter but frequent)
    if (size === 'giant') {
      maxMinutes = Math.min(60, maxMinutes); // Protect joints
    }

    let activities = [];
    if (age === 'puppy') activities = ['Short walks', 'Light tug-of-war', 'Basic obedience training', 'Puzzle toys'];
    else if (age === 'senior') activities = ['Gentle walking', 'Swimming (hydrotherapy)', 'Scent work', 'Snuffle mats'];
    else {
      if (energy === 'high') activities = ['Running/Jogging', 'Agility courses', 'Fetch/Frisbee', 'Long hikes'];
      else if (energy === 'medium') activities = ['Brisk walking', 'Dog park visits', 'Interactive fetch', 'Training sessions'];
      else activities = ['Leisurely walks', 'Indoor hide and seek', 'Trick training'];
    }

    return { min: minMinutes, max: maxMinutes, activities };
  };

  const results = calculateExercise();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-12 transform transition-all hover:shadow-2xl">
      <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BoltIcon className="w-8 h-8 text-yellow-300" />
          Interactive Exercise Calculator
        </h2>
        <p className="text-blue-100 opacity-90">Find the perfect balance of physical and mental stimulation for your dog.</p>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {/* Form */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age Group</label>
            <div className="flex gap-3">
              {(['puppy', 'adult', 'senior'] as AgeGroup[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${age === a ? 'bg-secondary text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dog Size</label>
            <div className="grid grid-cols-2 gap-3">
              {(['small', 'medium', 'large', 'giant'] as Size[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${size === s ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Energy Level (Breed Type)</label>
            <div className="space-y-2">
              <button
                onClick={() => setEnergy('high')}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${energy === 'high' ? 'bg-accent text-white shadow-md border-transparent' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-accent hover:text-accent'}`}
              >
                <span>High (Herding, Sporting)</span>
                {energy === 'high' && <HeartIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setEnergy('medium')}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${energy === 'medium' ? 'bg-success text-white shadow-md border-transparent' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-success hover:text-success'}`}
              >
                <span>Medium (Terriers, Working, Mixed)</span>
                {energy === 'medium' && <HeartIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setEnergy('low')}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${energy === 'low' ? 'bg-primary text-white shadow-md border-transparent' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-primary hover:text-primary'}`}
              >
                <span>Low (Toy, Companion)</span>
                {energy === 'low' && <HeartIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-light-bg rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5">
            <ClockIcon className="w-64 h-64 text-primary" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 relative z-10">
            <ChartBarIcon className="w-6 h-6 text-secondary" />
            Your Dog's Daily Goal
          </h3>
          
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6 transform transition-all hover:scale-105 relative z-10">
            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Recommended Duration</p>
            <div className="text-4xl font-extrabold text-primary">
              {results.min} - {results.max} <span className="text-xl text-gray-400 font-medium">min/day</span>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-sm text-gray-500 font-semibold mb-3 uppercase tracking-wider">Suggested Activities</p>
            <ul className="space-y-3">
              {results.activities.map((act, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium bg-white px-4 py-2 rounded-lg shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  {act}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
