'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ParkSubmissionForm } from '@/types/park-submission';
import { US_STATES } from '@/types/park-submission';

interface LocationStepProps {
  formData: ParkSubmissionForm;
  updateFormData: (data: Partial<ParkSubmissionForm>) => void;
  errors: Record<string, string>;
}

export default function LocationStep({ formData, updateFormData, errors }: LocationStepProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastGeocodedRef = useRef<string>('');

  // Check if we have enough information to geocode
  const hasEnoughInfo = useCallback(() => {
    // Need at least city + state, or zip code
    const hasCityState = formData.city?.trim() && formData.state?.trim();
    const hasZip = formData.zipCode?.trim() && formData.zipCode.trim().length >= 5;
    return hasCityState || hasZip;
  }, [formData.city, formData.state, formData.zipCode]);

  // Build address string for geocoding
  const buildAddressString = useCallback(() => {
    const parts: string[] = [];
    if (formData.street?.trim()) parts.push(formData.street.trim());
    if (formData.city?.trim()) parts.push(formData.city.trim());
    if (formData.state?.trim()) parts.push(formData.state.trim());
    if (formData.zipCode?.trim()) parts.push(formData.zipCode.trim());
    return parts.join(', ');
  }, [formData.street, formData.city, formData.state, formData.zipCode]);

  // Geocode address
  const geocodeAddress = useCallback(async () => {
    if (!hasEnoughInfo()) {
      return;
    }

    const addressString = buildAddressString();
    
    // Skip if we already geocoded this exact address
    if (lastGeocodedRef.current === addressString) {
      return;
    }

    // Skip if coordinates are already set and user hasn't changed address
    if (formData.latitude && formData.longitude && addressString === lastGeocodedRef.current) {
      return;
    }

    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to geocode address');
      }

      // Update coordinates
      updateFormData({
        latitude: data.latitude,
        longitude: data.longitude,
      });

      lastGeocodedRef.current = addressString;
      setGeocodeError(null);
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodeError(error instanceof Error ? error.message : 'Failed to geocode address');
    } finally {
      setIsGeocoding(false);
    }
  }, [formData.street, formData.city, formData.state, formData.zipCode, formData.latitude, formData.longitude, hasEnoughInfo, buildAddressString, updateFormData]);

  // Debounced geocoding effect
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't geocode if we don't have enough info
    if (!hasEnoughInfo()) {
      return;
    }

    // Debounce geocoding by 500ms after user stops typing
    debounceTimerRef.current = setTimeout(() => {
      geocodeAddress();
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.street, formData.city, formData.state, formData.zipCode, hasEnoughInfo, geocodeAddress]);

  // Reset geocoded address when coordinates are manually changed
  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    const numValue = parseFloat(value) || undefined;
    updateFormData({ [field]: numValue });
    
    // If user manually edits coordinates, reset the last geocoded address
    // so we can geocode again if they change the address
    if (numValue !== undefined) {
      lastGeocodedRef.current = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Street Address */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
          Street Address
        </label>
        <input
          type="text"
          id="street"
          value={formData.street || ''}
          onChange={(e) => updateFormData({ street: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., 123 Main Street"
        />
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., San Francisco"
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a state...</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
        </div>
      </div>

      {/* ZIP Code */}
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
          ZIP Code
        </label>
        <input
          type="text"
          id="zipCode"
          value={formData.zipCode || ''}
          onChange={(e) => updateFormData({ zipCode: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., 94102"
          maxLength={10}
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
            {isGeocoding && (
              <span className="ml-2 text-xs text-purple-600 font-normal">
                (finding...)
              </span>
            )}
          </label>
          <input
            type="number"
            id="latitude"
            value={formData.latitude || ''}
            onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., 37.7749"
            step="0.000001"
            disabled={isGeocoding}
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
            {isGeocoding && (
              <span className="ml-2 text-xs text-purple-600 font-normal">
                (finding...)
              </span>
            )}
          </label>
          <input
            type="number"
            id="longitude"
            value={formData.longitude || ''}
            onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., -122.4194"
            step="0.000001"
            disabled={isGeocoding}
          />
        </div>
      </div>

      {/* Geocoding Status Messages */}
      {isGeocoding && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-800 flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Finding coordinates...
          </p>
        </div>
      )}

      {geocodeError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> {geocodeError} You can still manually enter coordinates below.
          </p>
        </div>
      )}

      {formData.latitude && formData.longitude && !isGeocoding && !geocodeError && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            ✓ Coordinates found automatically
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Coordinates are automatically generated when you enter your address. 
          You can also manually enter coordinates or find them by searching for your address on Google Maps, 
          right-clicking on the location, and selecting the coordinates to copy them.
        </p>
      </div>
    </div>
  );
}
