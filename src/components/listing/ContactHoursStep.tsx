import type { ParkSubmissionForm } from '@/types/park-submission';

interface ContactHoursStepProps {
  formData: ParkSubmissionForm;
  updateFormData: (data: Partial<ParkSubmissionForm>) => void;
  errors: Record<string, string>;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ContactHoursStep({ formData, updateFormData, errors }: ContactHoursStepProps) {
  const updateHours = (day: string, hours: string) => {
    updateFormData({
      openingHours: {
        ...formData.openingHours,
        [day]: hours,
      },
    });
  };

  const updateSocialMedia = (platform: string, value: string) => {
    updateFormData({
      socialMedia: {
        ...formData.socialMedia,
        [platform]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email || ''}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="info@yourpark.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website || ''}
              onChange={(e) => updateFormData({ website: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.website ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="https://www.yourpark.com"
            />
            {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media (Optional)</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={formData.socialMedia?.facebook || ''}
                onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={formData.socialMedia?.instagram || ''}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://instagram.com/yourpark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pinterest
              </label>
              <input
                type="url"
                value={formData.socialMedia?.pinterest || ''}
                onChange={(e) => updateSocialMedia('pinterest', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://pinterest.com/yourpark"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.hours24x7 || false}
              onChange={(e) => updateFormData({ hours24x7: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">Open 24/7</span>
          </label>
        </div>

        {!formData.hours24x7 && (
          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <label className="w-28 text-sm font-medium text-gray-700">{day}</label>
                <input
                  type="text"
                  value={formData.openingHours?.[day] || ''}
                  onChange={(e) => updateHours(day, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 6:00 AM - 10:00 PM or Closed"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="hoursNote" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Hours Information (Optional)
          </label>
          <textarea
            id="hoursNote"
            value={formData.hoursNote || ''}
            onChange={(e) => updateFormData({ hoursNote: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Any special notes about your hours..."
          />
        </div>
      </div>
    </div>
  );
}
