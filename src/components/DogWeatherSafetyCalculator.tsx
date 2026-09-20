'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface DogWeatherSafetyCalculatorProps {
  isEmbed?: boolean;
}

export default function DogWeatherSafetyCalculator({ isEmbed = false }: DogWeatherSafetyCalculatorProps) {
  const [size, setSize] = useState('medium');
  const [ageHealth, setAgeHealth] = useState('adult');
  const [tempF, setTempF] = useState<number>(75);
  const [condition, setCondition] = useState('sunny');

  // Calculate risk
  let risk = 1;

  if (tempF >= 90) risk = 4;
  else if (tempF >= 85) risk = 3;
  else if (tempF >= 75) risk = 2;
  else if (tempF <= 20) risk = 4;
  else if (tempF <= 32) risk = 3;
  else if (tempF <= 45) risk = 2;
  else risk = 1;

  // Heat Modifiers
  if (tempF >= 70) {
    if (condition === 'sunny') risk += 1;
    if (ageHealth === 'brachycephalic') risk += 1;
    if (ageHealth === 'senior' || ageHealth === 'puppy') risk += 1;
  }

  // Cold Modifiers
  if (tempF <= 45) {
    if (condition === 'raining' || condition === 'snowing') risk += 1;
    if (size === 'small') risk += 1;
    if (ageHealth === 'senior' || ageHealth === 'puppy') risk += 1;
  }

  // Cap risk between 1 and 4
  risk = Math.max(1, Math.min(risk, 4));

  const resultData = {
    1: { 
      level: 'Safe for Walking', 
      color: 'bg-green-50 border-green-200 text-green-900', 
      icon: 'bi-check-circle-fill text-green-500', 
      text: "Conditions are safe for outdoor exercise. Have a great walk!" 
    },
    2: { 
      level: 'Use Caution', 
      color: 'bg-yellow-50 border-yellow-200 text-yellow-900', 
      icon: 'bi-exclamation-triangle-fill text-yellow-500', 
      text: "Conditions are borderline. Keep the walk short, watch closely for signs of discomfort (panting, shivering, lifting paws), and consider bringing water or paw protection." 
    },
    3: { 
      level: 'Dangerous (Seek Indoor Parks)', 
      color: 'bg-orange-50 border-orange-200 text-orange-900', 
      icon: 'bi-exclamation-octagon-fill text-orange-500', 
      text: "Outdoor exercise is dangerous for your dog in these conditions. Limit to quick potty breaks only. Consider an indoor dog park for exercise today to prevent heatstroke or frostbite." 
    },
    4: { 
      level: 'Life-Threatening (Indoor Only)', 
      color: 'bg-red-50 border-red-200 text-red-900', 
      icon: 'bi-x-octagon-fill text-red-500', 
      text: "Do not exercise your dog outdoors right now. The risk of severe injury (heatstroke or hypothermia/frostbite) is extremely high. You should definitely use an indoor facility instead." 
    }
  };

  const currentResult = resultData[risk as 1|2|3|4];

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${isEmbed ? 'm-0 shadow-sm border-slate-200' : 'mb-12'}`}>
      <div className={`bg-primary text-white ${isEmbed ? 'p-4 sm:p-5' : 'p-6 md:p-8'}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className={`${isEmbed ? 'text-xl sm:text-2xl' : 'text-2xl md:text-3xl'} font-bold flex items-center gap-2.5`}>
            <i className="bi bi-thermometer-half"></i>
            Weather Safety Calculator
          </h2>
          {isEmbed && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
              Tufts TACC
            </span>
          )}
        </div>
        <p className="text-blue-100 opacity-90 text-sm sm:text-base mt-1">
          Enter local weather and dog details to check outdoor walking safety.
        </p>
      </div>

      <div className={`${isEmbed ? 'p-4 sm:p-6' : 'p-6 md:p-8'} grid ${isEmbed ? 'grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2'} gap-6 md:gap-8`}>
        <div className="space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Current Temperature (°F)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" max="110" 
                value={tempF} 
                onChange={(e) => setTempF(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-2xl font-black text-primary w-16 text-right">{tempF}°</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Weather Condition</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sunny', label: 'Sunny', icon: 'bi-sun' },
                { id: 'cloudy', label: 'Cloudy', icon: 'bi-cloud' },
                { id: 'raining', label: 'Raining', icon: 'bi-cloud-rain' },
                { id: 'snowing', label: 'Snowing', icon: 'bi-snow' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    condition === c.id 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className={`bi ${c.icon}`}></i> {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dog Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'small', label: 'Small (<25 lb)' },
                { id: 'medium', label: 'Medium' },
                { id: 'large', label: 'Large (60+ lb)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`py-2 px-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    size === s.id 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Age / Health Profile</label>
            <select
              value={ageHealth}
              onChange={(e) => setAgeHealth(e.target.value)}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium"
            >
              <option value="adult">Healthy Adult Dog</option>
              <option value="puppy">Puppy (Under 1 year)</option>
              <option value="senior">Senior Dog</option>
              <option value="brachycephalic">Flat-Faced Breed (Pug, Bulldog, etc.)</option>
            </select>
          </div>

        </div>

        <div className="flex flex-col justify-center">
          <div className={`p-6 sm:p-8 rounded-2xl border-2 transition-colors duration-500 ${currentResult.color}`}>
            <div className="flex items-center gap-3 mb-3">
              <i className={`bi ${currentResult.icon} text-3xl sm:text-4xl`}></i>
              <h3 className="text-2xl sm:text-3xl font-black">{currentResult.level}</h3>
            </div>
            
            <p className="text-sm sm:text-base mb-6 leading-relaxed font-medium opacity-90">
              {currentResult.text}
            </p>

            {risk >= 3 && (
              <div className="bg-white/70 p-4 sm:p-5 rounded-xl border border-black/10">
                <h4 className="font-bold text-sm sm:text-base mb-1.5 text-slate-900">Alternative Exercise Idea:</h4>
                <p className="mb-3 text-xs sm:text-sm font-medium text-slate-700">Keep your dog active safely by visiting a climate-controlled indoor dog park.</p>
                <Link 
                  href="/" 
                  target={isEmbed ? "_blank" : undefined}
                  rel={isEmbed ? "noopener noreferrer" : undefined}
                  className="inline-block bg-primary text-white font-bold py-2.5 px-5 rounded-xl hover:bg-secondary transition-colors w-full text-center text-sm shadow-sm"
                >
                  Find an Indoor Park Near Me →
                </Link>
              </div>
            )}
            
            {risk <= 2 && (
              <div className="text-xs opacity-75 italic mt-3">
                Note: This tool provides general guidance. Always monitor your dog&apos;s behavior and consult your vet for individual tolerance.
              </div>
            )}
          </div>
        </div>
      </div>

      {isEmbed && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Based on <strong>Tufts TACC & AVMA Guidelines</strong></span>
          </div>
          <Link
            href="https://www.indoordogpark.org/tools/weather-safety-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary font-bold inline-flex items-center gap-1"
          >
            Powered by IndoorDogPark.org <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
    </div>
  );
}

