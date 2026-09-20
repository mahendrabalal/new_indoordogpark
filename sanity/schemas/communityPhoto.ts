import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'communityPhoto',
  title: 'Community Photos',
  type: 'document',
  fields: [
    defineField({
      name: 'parkName',
      title: 'Dog Park Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'listingSlug',
      title: 'Listing Slug',
      type: 'string',
      description: 'The URL slug of the dog park listing (e.g. off-leash-k9-training-chattanooga)',
    }),
    defineField({
      name: 'location',
      title: 'Location (City, State)',
      type: 'string',
    }),
    defineField({
      name: 'uploaderName',
      title: 'Submitted By (Name)',
      type: 'string',
    }),
    defineField({
      name: 'uploaderEmail',
      title: 'Submitted By (Email)',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes / Captions',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Review Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Review', value: 'pending' },
          { title: 'Approved / Live', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'photos',
      title: 'Submitted Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submission Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'parkName',
      subtitle: 'uploaderEmail',
      media: 'photos.0',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }) {
      const statusEmoji = status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '⏳';
      return {
        title: `${statusEmoji} ${title || 'Untitled Submission'}`,
        subtitle: subtitle || 'Unknown contributor',
        media,
      };
    },
  },
});
