import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'stateContent',
  title: 'State Content',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (rule) => rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'name',
      title: 'State Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'abbr',
      title: 'State Abbreviation',
      type: 'string',
      validation: (rule) => rule.required().max(2),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    // Custom Content Group
    defineField({
      name: 'customContent',
      title: 'Custom Content',
      type: 'object',
      fields: [
        defineField({
          name: 'heroEyebrow',
          title: 'Hero Eyebrow',
          type: 'string',
        }),
        defineField({
          name: 'heroHeading',
          title: 'Hero Heading',
          type: 'string',
        }),
        defineField({
          name: 'heroDescription',
          title: 'Hero Description',
          type: 'text',
        }),
        defineField({
          name: 'heroPill',
          title: 'Hero Pill',
          type: 'string',
        }),
        defineField({
          name: 'heroFootnotes',
          title: 'Hero Footnotes',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'heroImageAlt',
          title: 'Hero Image Alt Text',
          type: 'string',
        }),
        defineField({
          name: 'heroChips',
          title: 'Hero Chips',
          type: 'array',
          of: [{ type: 'heroChip' }],
        }),
        defineField({
          name: 'insightIntro',
          title: 'Insight Intro',
          type: 'text',
        }),
        defineField({
          name: 'insightCards',
          title: 'Insight Cards',
          type: 'array',
          of: [{ type: 'cityInsightCard' }],
        }),
        defineField({
          name: 'planningCards',
          title: 'Planning Cards',
          type: 'array',
          of: [{ type: 'planningCard' }],
        }),
        defineField({
          name: 'faqs',
          title: 'FAQs',
          type: 'array',
          of: [{ type: 'faqItem' }],
        }),
        defineField({
          name: 'ownerCta',
          title: 'Owner CTA',
          type: 'supportCta',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'abbr',
      media: 'featuredImage',
    },
  },
});
