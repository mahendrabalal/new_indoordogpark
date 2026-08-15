'use client';

import React, { useState } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  BoltIcon,
  HeartIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

type AgeGroup = 'puppy' | 'adult' | 'senior';
type Size = 'small' | 'medium' | 'large' | 'giant';
type EnergyLevel = 'low' | 'medium' | 'high';

export default function DogExerciseCalculator() {
  const [age, setAge] = useState<AgeGroup>('adult');
  const [size, setSize] = useState<Size>('medium');
  const [energy, setEnergy] = useState<EnergyLevel>('medium');

  // Lead Magnet Form State
  const [dogName, setDogName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateExercise = () => {
    // Base minutes
    let minMinutes = 30;
    let maxMinutes = 60;

    // Adjust by age
    if (age === 'puppy') {
      minMinutes = 20;
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

    // Size adjustments
    if (size === 'giant') {
      maxMinutes = Math.min(60, maxMinutes);
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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/tools/exercise-plan-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogName,
          email,
          age,
          size,
          energy,
          minMinutes: results.min,
          maxMinutes: results.max,
          activities: results.activities,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit. Please try again.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-12 transform transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BoltIcon className="w-8 h-8 text-yellow-300" />
          Interactive Exercise Calculator
        </h2>
        <p className="text-blue-100 opacity-90">
          Find the perfect balance of physical activity and mental stimulation for your dog.
        </p>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-10">
        {/* Left Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age Group</label>
            <div className="flex gap-3">
              {(['puppy', 'adult', 'senior'] as AgeGroup[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAge(a)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    age === a
                      ? 'bg-secondary text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
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
                  type="button"
                  onClick={() => setSize(s)}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    size === s
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
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
                type="button"
                onClick={() => setEnergy('high')}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                  energy === 'high'
                    ? 'bg-accent text-white shadow-md border-transparent'
                    : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-accent hover:text-accent'
                }`}
              >
                <span>High (Herding, Sporting)</span>
                {energy === 'high' && <HeartIcon className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setEnergy('medium')}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                  energy === 'medium'
                    ? 'bg-success text-white shadow-md border-transparent'
                    : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-success hover:text-success'
                }`}
              >
                <span>Medium (Terriers, Working, Mixed)</span>
                {energy === 'medium' && <HeartIcon className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setEnergy('low')}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                  energy === 'low'
                    ? 'bg-primary text-white shadow-md border-transparent'
                    : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                <span>Low (Toy, Companion)</span>
                {energy === 'low' && <HeartIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Results Panel */}
        <div className="bg-light-bg rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5">
            <ClockIcon className="w-64 h-64 text-primary" />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 relative z-10">
            <ChartBarIcon className="w-6 h-6 text-secondary" />
            Your Dog&apos;s Daily Goal
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

      {/* 🚀 High-Converting Lead Magnet Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white border-t border-indigo-700">
        <div className="max-w-3xl mx-auto">
          {!submitted ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-yellow-400 text-indigo-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Free Download
                </span>
                <span className="text-indigo-200 text-sm flex items-center gap-1">
                  <SparklesIcon className="w-4 h-4 text-yellow-300" /> Tailored to your dog
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold mb-2">
                📬 Get {dogName.trim() ? dogName : "Your Dog"}&apos;s Custom 7-Day Exercise &amp; Enrichment Plan
              </h3>
              <p className="text-indigo-100 text-sm md:text-base mb-6 leading-relaxed">
                We prepared a step-by-step indoor mental stimulation schedule + bad-weather safety checklist specifically calibrated for a{' '}
                <strong className="text-yellow-300">{age} ({size} size, {energy} energy)</strong> dog. Enter your email to receive the complete plan.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                {/* Honeypot */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Dog's Name (e.g. Luna)"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-indigo-400/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-indigo-400/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  />
                </div>

                {errorMsg && (
                  <p className="text-red-300 text-xs bg-red-900/40 p-2 rounded-lg">{errorMsg}</p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-950 font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    {submitting ? 'Sending Plan...' : 'Email My Free 7-Day Plan →'}
                  </button>
                  <span className="text-xs text-indigo-300">
                    🔒 No spam. Unsubscribe anytime.
                  </span>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/10 rounded-2xl p-6 border border-emerald-400/40 animate-fade-in">
              <div className="flex items-center gap-3 mb-3 text-emerald-300">
                <CheckCircleIcon className="w-8 h-8" />
                <h4 className="text-2xl font-bold text-white">
                  Plan Dispatched to {email}! 🎉
                </h4>
              </div>
              <p className="text-indigo-100 text-sm mb-4">
                Check your inbox in a moment for {dogName.trim() || 'your dog'}&apos;s full 7-Day Indoor Exercise &amp; Enrichment Routine. Here is a sneak peek of your daily routine:
              </p>

              <div className="bg-indigo-950/60 rounded-xl p-4 text-xs md:text-sm space-y-2 text-indigo-200 border border-indigo-500/20">
                <p><strong>• Monday:</strong> 20 min brisk walk + 15 min puzzle toy / snuffle mat</p>
                <p><strong>• Tuesday:</strong> Indoor cardio fetch / flirt pole session</p>
                <p><strong>• Wednesday:</strong> Climate-controlled indoor dog park socialization</p>
                <p><strong>• Thursday:</strong> 15 min focus &amp; trick training (burns energy fast!)</p>
                <p><strong>• Friday:</strong> Scent work &amp; living room treat treasure hunt</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

