import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'parkSubmission',
  title: 'Park Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Park Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Approval', value: 'pending' },
          { title: 'Approved / Live', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'listingType',
      title: 'Listing Type',
      type: 'string',
      options: {
        list: [
          { title: 'Free', value: 'free' },
          { title: 'Featured (Premium)', value: 'featured' },
        ],
      },
      initialValue: 'free',
    }),
    defineField({
      name: 'userId',
      title: 'Submitter User ID (Supabase)',
      type: 'string',
    }),
    defineField({
      name: 'businessType',
      title: 'Business Type',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'address',
      title: 'Full Address String',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
    }),
    defineField({
      name: 'zipCode',
      title: 'Zip Code',
      type: 'string',
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'string',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'string', title: 'Facebook' },
        { name: 'instagram', type: 'string', title: 'Instagram' },
        { name: 'twitter', type: 'string', title: 'Twitter' },
      ],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'object',
      fields: [
        { name: 'parking', type: 'boolean', title: 'Parking' },
        { name: 'waterFountains', type: 'boolean', title: 'Water Fountains' },
        { name: 'shade', type: 'boolean', title: 'Shade' },
        { name: 'seating', type: 'boolean', title: 'Seating' },
        { name: 'smallDogArea', type: 'boolean', title: 'Small Dog Area' },
        { name: 'largeDogArea', type: 'boolean', title: 'Large Dog Area' },
        { name: 'agilityCourse', type: 'boolean', title: 'Agility Course' },
        { name: 'swimming', type: 'boolean', title: 'Swimming' },
        { name: 'cafe', type: 'boolean', title: 'Cafe' },
        { name: 'bar', type: 'boolean', title: 'Bar' },
        { name: 'wifi', type: 'boolean', title: 'WiFi' },
      ],
    }),
    defineField({
      name: 'rules',
      title: 'Rules & Requirements',
      type: 'object',
      fields: [
        { name: 'vaccinationsRequired', type: 'boolean', title: 'Vaccinations Required' },
        { name: 'spayNeuterRequired', type: 'boolean', title: 'Spay/Neuter Required' },
        { name: 'temperamentTestRequired', type: 'boolean', title: 'Temperament Test Required' },
      ],
    }),
    defineField({
      name: 'pricingInfo',
      title: 'Pricing Info',
      type: 'object',
      fields: [
        { name: 'isFree', type: 'boolean', title: 'Is Free' },
        { name: 'pricingType', type: 'string', title: 'Pricing Type' },
        { name: 'hourlyRate', type: 'number', title: 'Hourly Rate' },
        { name: 'dropInFee', type: 'number', title: 'Drop In Fee' },
      ],
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'stripeSubscriptionId',
      title: 'Stripe Subscription ID',
      type: 'string',
    }),
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'photos.0',
    },
  },
})
