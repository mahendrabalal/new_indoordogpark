'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DogWeatherSafetyCalculator() {
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
      <div className="bg-primary p-6 md:p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
          <i className="bi bi-thermometer-half"></i>
          Weather Safety Calculator
        </h2>
        <p className="text-blue-100 opacity-90">
          Enter your local weather and dog&apos;s details to see if it&apos;s safe for an outdoor walk.
        </p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          
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
                  onClick={() => setCondition(c.id)}
                  className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
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
                  onClick={() => setSize(s.id)}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
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
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
            >
              <option value="adult">Healthy Adult Dog</option>
              <option value="puppy">Puppy (Under 1 year)</option>
              <option value="senior">Senior Dog</option>
              <option value="brachycephalic">Flat-Faced Breed (Pug, Bulldog, etc.)</option>
            </select>
          </div>

        </div>

        <div className="flex flex-col justify-center">
          <div className={`p-8 rounded-2xl border-2 transition-colors duration-500 ${currentResult.color}`}>
            <div className="flex items-center gap-3 mb-4">
              <i className={`bi ${currentResult.icon} text-4xl`}></i>
              <h3 className="text-3xl font-black">{currentResult.level}</h3>
            </div>
            
            <p className="text-lg mb-8 leading-relaxed font-medium opacity-90">
              {currentResult.text}
            </p>

            {risk >= 3 && (
              <div className="bg-white/60 p-5 rounded-xl border border-black/10">
                <h4 className="font-bold mb-2">Alternative Exercise Idea:</h4>
                <p className="mb-4 text-sm font-medium">Keep your dog active safely by visiting a climate-controlled indoor dog park near you.</p>
                <Link href="/" className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-secondary transition-colors w-full text-center shadow-sm">
                  Find an Indoor Park Near Me
                </Link>
              </div>
            )}
            
            {risk <= 2 && (
              <div className="text-sm opacity-75 italic mt-4">
                Note: This tool provides general guidance. Always monitor your individual dog&apos;s behavior and consult your vet if you have concerns about their weather tolerance.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
