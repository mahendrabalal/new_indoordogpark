import { DogPark } from '@/types/dog-park';
import { getParkHighlights } from '@/lib/park-description';

interface ParkQuickHighlightsProps {
  park: DogPark;
}

export default function ParkQuickHighlights({ park }: ParkQuickHighlightsProps) {
  const highlights = getParkHighlights(park);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {highlights.map((h, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              {h.label}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border ${h.badgeClass || 'bg-orange-50 text-orange-600 border-orange-100'}`}>
              <i className={`bi ${h.icon}`}></i>
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-gray-900 truncate leading-tight">
              {h.value}
            </div>
            {h.subtext && (
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 truncate">
                {h.subtext}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
