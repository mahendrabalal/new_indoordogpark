import type { ParkSubmissionForm } from '@/types/park-submission';
import {
  INDOOR_OUTDOOR_OPTIONS,
  SIZE_CATEGORIES,
  SURFACE_TYPES,
} from '@/types/park-submission';

interface AmenitiesStepProps {
  formData: ParkSubmissionForm;
  updateFormData: (data: Partial<ParkSubmissionForm>) => void;
  errors: Record<string, string>;
}

const AMENITY_OPTIONS = [
  { id: 'parking', label: 'Parking' },
  { id: 'waterFountains', label: 'Water Fountains' },
  { id: 'shade', label: 'Shade/Covered Areas' },
  { id: 'seating', label: 'Seating' },
  { id: 'smallDogArea', label: 'Small Dog Area' },
  { id: 'largeDogArea', label: 'Large Dog Area' },
  { id: 'agilityCourse', label: 'Agility Course' },
  { id: 'swimming', label: 'Swimming/Water Features' },
  { id: 'dogWashStation', label: 'Dog Wash Station' },
  { id: 'restrooms', label: 'Restrooms' },
  { id: 'handicapAccess', label: 'Handicap Accessible' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'fencing', label: 'Fully Fenced' },
  { id: 'grooming', label: 'Grooming Services' },
  { id: 'daycare', label: 'Daycare Services' },
  { id: 'training', label: 'Training Services' },
  { id: 'socializing', label: 'Socializing Events' },
];

export default function AmenitiesStep({ formData, updateFormData, errors }: AmenitiesStepProps) {
  const updateAmenity = (amenityId: string, checked: boolean) => {
    updateFormData({
      amenities: {
        ...formData.amenities,
        [amenityId]: checked,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Park Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Park Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indoor/Outdoor
            </label>
            <select
              value={formData.indoorOutdoor || ''}
              onChange={(e) => updateFormData({ indoorOutdoor: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              {INDOOR_OUTDOOR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Park Size
            </label>
            <select
              value={formData.sizeCategory || ''}
              onChange={(e) => updateFormData({ sizeCategory: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              {SIZE_CATEGORIES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surface Type
            </label>
            <select
              value={formData.surfaceType || ''}
              onChange={(e) => updateFormData({ surfaceType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              {SURFACE_TYPES.map((surface) => (
                <option key={surface} value={surface}>
                  {surface}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Amenities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AMENITY_OPTIONS.map((amenity) => (
            <label key={amenity.id} className="flex items-start">
              <input
                type="checkbox"
                checked={(formData.amenities as any)?.[amenity.id] || false}
                onChange={(e) => updateAmenity(amenity.id, e.target.checked)}
                className="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
