import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import type { ParkSubmissionForm } from '@/types/park-submission';

interface PhotosPricingStepProps {
  formData: ParkSubmissionForm;
  updateFormData: (data: Partial<ParkSubmissionForm>) => void;
  errors?: Record<string, string>;
}

type PricingInfo = NonNullable<ParkSubmissionForm['pricingInfo']>;

export default function PhotosPricingStep({ formData, updateFormData, errors }: PhotosPricingStepProps) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSessionIdRef = useRef<string>('');

  const ensureUploadSessionId = () => {
    if (!uploadSessionIdRef.current) {
      uploadSessionIdRef.current =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `session-${Date.now()}`;
    }
    return uploadSessionIdRef.current;
  };

  const appendPhoto = (photo: NonNullable<ParkSubmissionForm['photos']>[number]) => {
    updateFormData({
      photos: [...(formData.photos || []), photo],
    });
  };

  const addPhoto = () => {
    if (!photoUrl.trim()) return;

    const newPhoto = {
      url: photoUrl,
      type: 'external',
      source: 'user',
    };

    appendPhoto(newPhoto);
    setPhotoUrl('');
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const uploadPayload = new FormData();
      uploadPayload.append('file', file);
      uploadPayload.append('sessionId', ensureUploadSessionId());
      uploadPayload.append('displayOrder', String(formData.photos?.length ?? 0));
      if (formData.name) {
        uploadPayload.append('altText', `Photo of ${formData.name}`);
      }

      const response = await fetch('/api/uploads/park-photos', {
        method: 'POST',
        body: uploadPayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload photo. Please try again.');
      }

      if (result.photo) {
        appendPhoto(result.photo);
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos?.filter((_, i) => i !== index) || [];
    updateFormData({ photos: newPhotos });
  };

  const updatePricingInfo = <K extends keyof PricingInfo>(field: K, value: PricingInfo[K]) => {
    updateFormData({
      pricingInfo: {
        ...(formData.pricingInfo ?? {}),
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

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2 mb-4">
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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!photoUrl.trim()}
          >
            Add Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={openFilePicker}
            className="px-6 py-3 bg-white text-purple-600 border border-purple-200 rounded-lg font-medium hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading…' : 'Upload from Device'}
          </button>
        </div>

        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}

        {/* Photo Gallery */}
        {formData.photos && formData.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <Image
                  src={photo.url || 'https://via.placeholder.com/300x200?text=Dog+Park'}
                  alt={`Park photo ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                  }}
                  unoptimized
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
        {errors?.photos && (
          <p className="mt-2 text-sm text-red-600">{errors.photos}</p>
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
