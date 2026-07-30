'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type PackingItem = {
  id: string;
  name: string;
  category: string;
  checked: boolean;
};

export default function DogParkPackingListGenerator() {
  const [parkType, setParkType] = useState('indoor');
  const [season, setSeason] = useState('spring_fall');
  const [dogAge, setDogAge] = useState('adult');
  const [list, setList] = useState<PackingItem[]>([]);

  // Generate the packing list based on inputs
  useEffect(() => {
    const items: PackingItem[] = [
      // Base Essentials (Always included)
      { id: 'leash', name: 'Standard 6ft Leash (No retractable leashes)', category: 'Essentials', checked: false },
      { id: 'bags', name: 'Poop Bags (Bring extra!)', category: 'Essentials', checked: false },
      { id: 'water', name: 'Collapsible Water Bowl & Fresh Water', category: 'Essentials', checked: false },
      { id: 'treats', name: 'High-Value Training Treats', category: 'Essentials', checked: false },
      { id: 'collar', name: 'Collar with Current ID Tags', category: 'Essentials', checked: false },
    ];

    // Park Type Specific
    if (parkType === 'indoor') {
      items.push({ id: 'vaccines_indoor', name: 'Digital or Print Vaccination Records (Required for entry)', category: 'Park Requirements', checked: false });
      items.push({ id: 'flea_tick_proof', name: 'Proof of Flea & Tick Prevention', category: 'Park Requirements', checked: false });
      items.push({ id: 'owner_shoes', name: 'Clean indoor-safe shoes (or grip socks)', category: 'Owner Comfort', checked: false });
      items.push({ id: 'dry_towel', name: 'Towel to wipe paws before entering', category: 'Cleanliness', checked: false });
    } else {
      items.push({ id: 'tick_spray', name: 'Dog-Safe Bug & Tick Repellent', category: 'Outdoor Safety', checked: false });
      items.push({ id: 'long_line', name: 'Long Line Leash (if not fully fenced)', category: 'Toys & Gear', checked: false });
      items.push({ id: 'mudbuster', name: 'MudBuster or portable paw cleaner', category: 'Cleanliness', checked: false });
      items.push({ id: 'car_seat_cover', name: 'Car Seat Cover or Hammock', category: 'Cleanliness', checked: false });
    }

    // Season Specific
    if (season === 'summer' && parkType === 'outdoor') {
      items.push({ id: 'cooling_vest', name: 'Cooling Vest or Bandana', category: 'Weather & Comfort', checked: false });
      items.push({ id: 'sunscreen', name: 'Dog-Safe Sunscreen (for nose/ears)', category: 'Weather & Comfort', checked: false });
      items.push({ id: 'extra_water', name: 'Extra Gallon of Ice Water', category: 'Weather & Comfort', checked: false });
    }
    if (season === 'winter' && parkType === 'outdoor') {
      items.push({ id: 'coat', name: 'Dog Winter Coat or Sweater', category: 'Weather & Comfort', checked: false });
      items.push({ id: 'booties', name: 'Paw Booties or Paw Balm (Musher\'s Secret)', category: 'Weather & Comfort', checked: false });
      items.push({ id: 'towel_snow', name: 'Thick towel for melting snow', category: 'Cleanliness', checked: false });
    }
    if (season === 'spring_fall' && parkType === 'outdoor') {
      items.push({ id: 'rain_coat', name: 'Dog Rain Jacket', category: 'Weather & Comfort', checked: false });
      items.push({ id: 'extra_towel', name: 'Extra Towels for muddy puddles', category: 'Cleanliness', checked: false });
    }

    // Age Specific
    if (dogAge === 'puppy') {
      items.push({ id: 'teething', name: 'Teething Toys or Chew', category: 'Toys & Gear', checked: false });
      items.push({ id: 'puppy_pads', name: 'Puppy Pads (for the car ride)', category: 'Cleanliness', checked: false });
      items.push({ id: 'wipes', name: 'Pet-Safe Wet Wipes for accidents', category: 'Cleanliness', checked: false });
    }
    if (dogAge === 'senior') {
      items.push({ id: 'ramp', name: 'Portable Car Ramp/Stairs', category: 'Mobility & Comfort', checked: false });
      items.push({ id: 'ortho_mat', name: 'Orthopedic Travel Mat for resting', category: 'Mobility & Comfort', checked: false });
    }

    setList(items);
  }, [parkType, season, dogAge]);

  const toggleCheck = (id: string) => {
    setList(list.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handlePrint = () => {
    window.print();
  };

  // Group items by category
  const groupedItems = list.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);

  const categories = Object.keys(groupedItems);
  const totalItems = list.length;
  const checkedItems = list.filter(item => item.checked).length;
  const progress = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12" id="packing-list-generator">
      {/* Non-printable header */}
      <div className="bg-primary p-6 md:p-8 text-white print:hidden">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
          <i className="bi bi-card-checklist"></i>
          Ultimate Dog Park Packing List
        </h2>
        <p className="text-blue-100 opacity-90">
          Customize your perfect packing list based on where you&apos;re going and who you&apos;re bringing.
        </p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-12 gap-10">
        
        {/* Controls - Hidden on print */}
        <div className="md:col-span-4 space-y-8 print:hidden">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Customize Your List</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Park Type</label>
                <div className="flex bg-gray-200 p-1 rounded-lg">
                  <button
                    onClick={() => setParkType('indoor')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${parkType === 'indoor' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Indoor Park
                  </button>
                  <button
                    onClick={() => setParkType('outdoor')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${parkType === 'outdoor' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Outdoor Park
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Season / Weather</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                >
                  <option value="spring_fall">Spring / Fall (Mild or Rainy)</option>
                  <option value="summer">Summer (Hot)</option>
                  <option value="winter">Winter (Cold or Snowy)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Dog&apos;s Age / Stage</label>
                <select
                  value={dogAge}
                  onChange={(e) => setDogAge(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                >
                  <option value="adult">Adult Dog</option>
                  <option value="puppy">Puppy (Under 1 yr)</option>
                  <option value="senior">Senior Dog</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePrint}
            className="w-full bg-secondary text-white font-bold py-4 px-6 rounded-xl hover:bg-secondary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <i className="bi bi-printer"></i> Print Checklist
          </button>

          {parkType === 'indoor' && (
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
              <h4 className="font-bold text-blue-900 mb-2 text-sm">Pro Tip:</h4>
              <p className="text-sm text-blue-800">Indoor parks require up-to-date vaccinations (Rabies, DHLPP, Bordetella). Keep a digital copy on your phone!</p>
            </div>
          )}
        </div>

        {/* The List */}
        <div className="md:col-span-8 print:col-span-12">
          
          {/* Printable Header */}
          <div className="hidden print:block mb-8 pb-4 border-b-2 border-black">
            <h1 className="text-3xl font-black text-black">My Dog Park Packing List</h1>
            <p className="text-gray-600 mt-2">
              For: {parkType === 'indoor' ? 'Indoor' : 'Outdoor'} Park | {dogAge.charAt(0).toUpperCase() + dogAge.slice(1)} Dog
            </p>
          </div>

          {/* Progress Bar (Hidden on print) */}
          <div className="mb-8 print:hidden">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-gray-700">Packing Progress</span>
              <span className="text-primary font-black text-xl">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category} className="break-inside-avoid">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                  {category === 'Essentials' && <i className="bi bi-star-fill text-yellow-400 text-lg print:hidden"></i>}
                  {category === 'Park Requirements' && <i className="bi bi-file-earmark-medical-fill text-blue-500 text-lg print:hidden"></i>}
                  {category === 'Weather & Comfort' && <i className="bi bi-cloud-sun-fill text-orange-400 text-lg print:hidden"></i>}
                  {category === 'Cleanliness' && <i className="bi bi-droplet-fill text-cyan-500 text-lg print:hidden"></i>}
                  {category === 'Toys & Gear' && <i className="bi bi-dribbble text-pink-500 text-lg print:hidden"></i>}
                  {category}
                </h3>
                
                <div className="space-y-3">
                  {groupedItems[category].map((item) => (
                    <label 
                      key={item.id} 
                      className={`flex items-start gap-4 p-3 rounded-lg border transition-all cursor-pointer group print:border-none print:p-1 print:gap-2 ${item.checked ? 'bg-gray-50 border-gray-300 print:bg-white' : 'bg-white border-gray-200 hover:border-primary/50'}`}
                    >
                      <div className="relative flex items-center justify-center mt-0.5 print:mt-1">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                          className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded hover:border-primary checked:bg-primary checked:border-primary transition-all cursor-pointer print:w-5 print:h-5 print:border-black print:checked:bg-white"
                        />
                        <i className="bi bi-check text-white text-xl absolute pointer-events-none opacity-0 peer-checked:opacity-100 print:text-black print:text-2xl"></i>
                      </div>
                      <span className={`font-medium text-lg pt-0.5 select-none transition-colors ${item.checked ? 'text-gray-400 line-through print:text-gray-600' : 'text-gray-700'}`}>
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-purple-50 rounded-xl border border-purple-100 text-center print:hidden">
            <h4 className="font-bold text-purple-900 mb-2">Don&apos;t have an indoor park yet?</h4>
            <p className="text-purple-800 mb-4">Escape the weather and enjoy a climate-controlled playground for your pup.</p>
            <Link href="/" className="inline-block bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors">
              Find an Indoor Dog Park
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
