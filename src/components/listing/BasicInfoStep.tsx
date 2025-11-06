import type { ParkSubmissionForm } from '@/types/park-submission';
import { BUSINESS_TYPES } from '@/types/park-submission';

interface BasicInfoStepProps {
  formData: ParkSubmissionForm;
  updateFormData: (data: Partial<ParkSubmissionForm>) => void;
  errors: Record<string, string>;
}

export default function BasicInfoStep({ formData, updateFormData, errors }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Park Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Park Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Bark Park Central"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          id="businessType"
          value={formData.businessType}
          onChange={(e) => updateFormData({ businessType: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.businessType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a type...</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.businessType && <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your dog park... What makes it special? What can visitors expect?"
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">Minimum 50 characters</p>
          <p className="text-sm text-gray-500">{formData.description?.length || 0} characters</p>
        </div>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>
    </div>
  );
}
