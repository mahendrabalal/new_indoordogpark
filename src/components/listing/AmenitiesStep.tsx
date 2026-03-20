import type { ParkSubmissionForm } from '@/types/park-submission';
import {
  INDOOR_OUTDOOR_OPTIONS,
  SIZE_CATEGORIES,
  SURFACE_TYPES,
} from '@/types/park-submission';

interface AmenitiesStepProps {
  formData: ParkSubmissionForm;
  updateFormData: (data: Partial<ParkSubmissionForm>) => void;
  errors?: Record<string, string>;
}

type AmenityKey = keyof NonNullable<ParkSubmissionForm['amenities']>;

const AMENITY_OPTIONS: Array<{ id: AmenityKey; label: string }> = [
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
  { id: 'cafe', label: 'Cafe on Site' },
  { id: 'bar', label: 'Bar on Site' },
  { id: 'wifi', label: 'Free Wi-Fi' },
  { id: 'climateControl', label: 'Climate Control (AC/Heat)' },
  { id: 'misters', label: 'Cooling Misters/Fans' },
  { id: 'foodAllowed', label: 'Outside Food Allowed' },
];

type RuleKey = keyof NonNullable<ParkSubmissionForm['rules']>;

const RULE_OPTIONS: Array<{ id: RuleKey; label: string; description?: string }> = [
  { id: 'vaccinationsRequired', label: 'Vaccinations Required', description: 'Requires proof of Rabies, Bordetella, etc.' },
  { id: 'spayNeuterRequired', label: 'Spay/Neuter Required', description: 'Dogs must be fixed to enter' },
  { id: 'temperamentTestRequired', label: 'Temperament Test Required', description: 'Dogs must pass behavior evaluation' },
  { id: 'privateBookingAvailable', label: 'Private Booking Available', description: 'Can book facility for solo use (e.g. Sniffspot)' },
  { id: 'staffSupervised', label: 'Staff Supervised', description: 'Staff members actively monitor dogs in play area' },
];

export default function AmenitiesStep({ formData, updateFormData }: AmenitiesStepProps) {
  const updateAmenity = (amenityId: AmenityKey, checked: boolean) => {
    updateFormData({
      amenities: {
        ...(formData.amenities ?? {}),
        [amenityId]: checked,
      },
    });
  };

  const updateRule = (ruleId: RuleKey, checked: boolean) => {
    updateFormData({
      rules: {
        ...(formData.rules ?? {}),
        [ruleId]: checked,
      },
    });
  };

  return (
    <div className="space-y-10">
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

      {/* Rules & Requirements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rules & Requirements</h3>
        <p className="text-sm text-gray-500 mb-4">Select all requirements for dogs and owners visiting your park.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
          {RULE_OPTIONS.map((rule) => (
            <label key={rule.id} className="flex items-start">
              <input
                type="checkbox"
                checked={Boolean(formData.rules?.[rule.id])}
                onChange={(e) => updateRule(rule.id, e.target.checked)}
                className="w-5 h-5 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">{rule.label}</span>
                {rule.description && (
                  <span className="block text-sm text-gray-500">{rule.description}</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Amenities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
          {AMENITY_OPTIONS.map((amenity) => (
            <label key={amenity.id} className="flex items-start">
              <input
                type="checkbox"
                checked={Boolean(formData.amenities?.[amenity.id])}
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
