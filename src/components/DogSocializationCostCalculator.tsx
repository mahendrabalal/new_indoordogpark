'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DogSocializationCostCalculator() {
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [daycareCost, setDaycareCost] = useState(40);
  const [walkerCost, setWalkerCost] = useState(25);
  const [parkMembership, setParkMembership] = useState(45);

  // Annual Calculations
  const annualDaycare = daysPerWeek * daycareCost * 52;
  const annualWalker = daysPerWeek * walkerCost * 52;
  const annualPark = parkMembership * 12;

  const savingsDaycare = annualDaycare - annualPark;
  const savingsWalker = annualWalker - annualPark;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
      <div className="bg-primary p-6 md:p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
          <i className="bi bi-piggy-bank"></i>
          Dog Socialization Cost Calculator
        </h2>
        <p className="text-blue-100 opacity-90">
          Compare the true annual cost of doggy daycare, dog walkers, and indoor dog park memberships.
        </p>
      </div>

      <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-10">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Days per week you need pet care/exercise
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xl font-black text-primary w-12 text-right">{daysPerWeek}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Average Doggy Daycare Cost (Per Day)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                min="0"
                value={daycareCost}
                onChange={(e) => setDaycareCost(parseInt(e.target.value) || 0)}
                className="w-full pl-8 p-3 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-bold text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Average Dog Walker Cost (Per Walk)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                min="0"
                value={walkerCost}
                onChange={(e) => setWalkerCost(parseInt(e.target.value) || 0)}
                className="w-full pl-8 p-3 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-bold text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Indoor Dog Park Membership (Per Month)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                min="0"
                value={parkMembership}
                onChange={(e) => setParkMembership(parseInt(e.target.value) || 0)}
                className="w-full pl-8 p-3 border border-gray-300 rounded-xl bg-emerald-50 text-emerald-900 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-bold text-lg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Most parks range from $30 - $60 per month for unlimited access.</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Annual Costs</h3>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <i className="bi bi-building"></i>
                </div>
                <span className="font-bold text-gray-700">Doggy Daycare</span>
              </div>
              <span className="text-xl font-black text-gray-900">{formatCurrency(annualDaycare)}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <i className="bi bi-person-walking"></i>
                </div>
                <span className="font-bold text-gray-700">Dog Walker</span>
              </div>
              <span className="text-xl font-black text-gray-900">{formatCurrency(annualWalker)}</span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-100 rounded-bl-full -mr-8 -mt-8"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <i className="bi bi-tree"></i>
                </div>
                <span className="font-bold text-emerald-900">Indoor Dog Park</span>
              </div>
              <span className="text-2xl font-black text-emerald-600 relative z-10">{formatCurrency(annualPark)}</span>
            </div>
          </div>

          <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-md text-center">
            <p className="text-emerald-100 font-medium mb-1">Potential Annual Savings</p>
            <div className="text-3xl md:text-4xl font-black mb-2">
              {formatCurrency(savingsDaycare > 0 ? savingsDaycare : 0)}
            </div>
            <p className="text-sm text-emerald-100">Compared to traditional doggy daycare</p>
            
            <div className="mt-6 pt-5 border-t border-emerald-400/50">
              <Link href="/" className="inline-block bg-white text-emerald-700 font-bold py-3 px-6 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm w-full">
                Find a Park Near Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
