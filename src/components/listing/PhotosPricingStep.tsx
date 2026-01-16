import { useId, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import type { ParkSubmissionForm } from '@/types/park-submission';
import { useAuth } from '@/contexts/AuthContext';

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
  const fileInputId = useId();
  const { getSessionTokens } = useAuth();

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
      const { accessToken, refreshToken } = await getSessionTokens();

      if (!accessToken) {
        setIsUploading(false);
        // Instead of just an error, we prompt with a clear sign-in link
        setUploadError('sign-in-required');
        return;
      }

      const uploadPayload = new FormData();
      uploadPayload.append('file', file);
      uploadPayload.append('sessionId', ensureUploadSessionId());
      uploadPayload.append('displayOrder', String(formData.photos?.length ?? 0));
      if (formData.name) {
        uploadPayload.append('altText', `Photo of ${formData.name}`);
      }

      const response = await fetch('/api/uploads/park-photos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(refreshToken ? { 'x-refresh-token': refreshToken } : {}),
        },
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileUpload}
          />
          <label
            htmlFor={fileInputId}
            role="button"
            tabIndex={isUploading ? -1 : 0}
            aria-disabled={isUploading}
            onKeyDown={(event) => {
              if (isUploading) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (typeof fileInputRef.current?.showPicker === 'function') {
                  fileInputRef.current.showPicker();
                } else {
                  fileInputRef.current?.click();
                }
              }
            }}
            className={`px-6 py-3 rounded-lg font-medium border border-purple-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${isUploading
              ? 'bg-white text-purple-400 cursor-not-allowed opacity-50 pointer-events-none'
              : 'bg-white text-purple-600 hover:bg-purple-50 cursor-pointer'
              }`}
          >
            {isUploading ? 'Uploading…' : 'Upload from Device'}
          </label>
        </div>

        {uploadError && (
          uploadError === 'sign-in-required' ? (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-sm text-amber-800">Please log in before uploading photos.</span>
              <a
                href="/login?redirect=/list-your-park?step=2"
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In to Upload
              </a>
            </div>
          ) : (
            <p className="text-sm text-red-600">{uploadError}</p>
          )
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
                  // Industry best practice: Always unoptimize to avoid 402 errors
                  unoptimized={true}
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
