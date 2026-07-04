import Link from 'next/link';
import { CityData } from '@/lib/cityData';

interface NearbyCitiesWidgetProps {
  currentCity: string;
  currentState: string;
  nearbyCities: CityData[];
}

export default function NearbyCitiesWidget({ currentCity, currentState, nearbyCities }: NearbyCitiesWidgetProps) {
  if (!nearbyCities || nearbyCities.length === 0) return null;

  return (
    <section className="nearby-cities-widget mt-12 pt-12 border-t border-gray-100">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explore Nearby Cities</h2>
          <p className="text-gray-600 mt-2">Discover more indoor dog parks and dog-friendly spaces in {currentState}.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {nearbyCities.map((city) => (
          <Link 
            key={city.slug} 
            href={`/cities/${city.slug}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">
                {city.name}
              </h3>
              <p className="text-xs text-gray-500">{city.parkCount} park{city.parkCount !== 1 ? 's' : ''}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link href={`/states/${currentState.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-600 font-bold hover:underline">
          View all cities in {currentState} →
        </Link>
      </div>
    </section>
  );
}
