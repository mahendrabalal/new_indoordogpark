import { useState } from 'react';
import type { ParkSubmissionForm } from '@/types/park-submission';

interface PhotosPricingStepProps {
  formData: ParkSubmissionForm;
  updateFormData: (data: Partial<ParkSubmissionForm>) => void;
  errors: Record<string, string>;
}

export default function PhotosPricingStep({ formData, updateFormData, errors }: PhotosPricingStepProps) {
  const [photoUrl, setPhotoUrl] = useState('');

  const addPhoto = () => {
    if (!photoUrl.trim()) return;

    const newPhoto = {
      url: photoUrl,
      type: 'external',
      source: 'user',
    };

    updateFormData({
      photos: [...(formData.photos || []), newPhoto],
    });

    setPhotoUrl('');
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos?.filter((_, i) => i !== index) || [];
    updateFormData({ photos: newPhotos });
  };

  const updatePricingInfo = (field: string, value: any) => {
    updateFormData({
      pricingInfo: {
        ...formData.pricingInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Photos Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Park Photos</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add URLs to photos of your park. High-quality photos help attract more visitors!
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPhoto()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter photo URL (e.g., https://...)"
          />
          <button
            type="button"
            onClick={addPhoto}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
          >
            Add Photo
          </button>
        </div>

        {/* Photo Gallery */}
        {formData.photos && formData.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo.url}
                  alt={`Park photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.pricingInfo?.isFree || false}
              onChange={(e) => updatePricingInfo('isFree', e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">This park is free to use</span>
          </label>
        </div>

        {!formData.pricingInfo?.isFree && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.pricingInfo?.hourlyRate || ''}
                  onChange={(e) => updatePricingInfo('hourlyRate', parseFloat(e.target.value) || undefined)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.pricingInfo?.dailyRate || ''}
                  onChange={(e) => updatePricingInfo('dailyRate', parseFloat(e.target.value) || undefined)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.pricingInfo?.monthlyRate || ''}
                  onChange={(e) => updatePricingInfo('monthlyRate', parseFloat(e.target.value) || undefined)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drop-in Fee ($)
              </label>
              <input
                type="number"
                value={formData.pricingInfo?.dropInFee || ''}
                onChange={(e) => updatePricingInfo('dropInFee', parseFloat(e.target.value) || undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Details
              </label>
              <textarea
                value={formData.pricingInfo?.pricingDetails || ''}
                onChange={(e) => updatePricingInfo('pricingDetails', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Additional pricing information, membership options, discounts, etc."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
