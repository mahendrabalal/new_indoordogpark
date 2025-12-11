import React from 'react';

type Facility = {
  name: string;
  neighborhood: string;
  bestFor: string;
  dayPass: string;
  monthly: string;
  specialty: string;
};

const DEFAULT_FACILITIES: Facility[] = [
  { name: 'Dogtopia', neighborhood: 'Downtown LA', bestFor: 'Daily care + training', dayPass: '$35', monthly: '$250', specialty: 'Webcam access, nap rooms' },
  { name: 'Camp Bow Wow', neighborhood: 'Silver Lake', bestFor: 'Flexible drop-in care', dayPass: '$40', monthly: '$280', specialty: '24/7 webcams, CPR certified' },
  { name: 'Puppy Playtime', neighborhood: 'Santa Monica', bestFor: 'Puppies, small breeds', dayPass: '$30', monthly: '$250', specialty: 'Age-specific sessions' },
  { name: 'DogPound', neighborhood: 'West Hollywood', bestFor: 'Agility, training', dayPass: '$45', monthly: '$300+', specialty: 'Obstacle courses, trainers' },
  { name: 'Barkley Pet Hotel', neighborhood: 'Los Feliz', bestFor: 'Grooming + play', dayPass: '$38', monthly: '$290', specialty: 'Spa services, boarding' },
  { name: 'Pupville', neighborhood: 'Culver City', bestFor: 'Budget-friendly', dayPass: '$32', monthly: '$220', specialty: 'Best value pricing' },
  { name: 'Woof Pad', neighborhood: 'Koreatown', bestFor: 'Anxious dogs', dayPass: '$35', monthly: '$240', specialty: 'Behavior consultants' },
  { name: 'Playful Paws', neighborhood: 'Pasadena', bestFor: 'Socialization focus', dayPass: '$38', monthly: '$260', specialty: 'Behavior classes included' },
  { name: 'Doggy Oasis', neighborhood: 'Long Beach', bestFor: 'Seniors, puppies', dayPass: '$30–$35', monthly: '$240', specialty: 'Orthopedic flooring' },
  { name: 'K9 Playhouse', neighborhood: 'Glendale', bestFor: 'High-energy dogs', dayPass: '$42', monthly: '$300', specialty: 'Advanced agility, events' },
];

export default function ComparisonTable({
  facilities = DEFAULT_FACILITIES,
}: {
  facilities?: Facility[];
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full table-auto border-collapse text-sm" role="table" aria-label="Comparison of doggy soft play facilities">
        <caption className="sr-only">Comparison of Los Angeles doggy soft play facilities</caption>
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="text-left p-3 border-b">Facility Name</th>
            <th scope="col" className="text-left p-3 border-b">Neighborhood</th>
            <th scope="col" className="text-left p-3 border-b">Best For</th>
            <th scope="col" className="text-left p-3 border-b">Day Pass</th>
            <th scope="col" className="text-left p-3 border-b">Monthly</th>
            <th scope="col" className="text-left p-3 border-b">Specialty</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((f, idx) => (
            <tr key={f.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="p-3 align-top border-b">
                <div className="font-semibold text-slate-900">{f.name}</div>
              </td>
              <td className="p-3 align-top border-b text-slate-700">{f.neighborhood}</td>
              <td className="p-3 align-top border-b text-slate-700">{f.bestFor}</td>
              <td className="p-3 align-top border-b text-slate-700">{f.dayPass}</td>
              <td className="p-3 align-top border-b text-slate-700">{f.monthly}</td>
              <td className="p-3 align-top border-b text-slate-700">{f.specialty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
