import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'stateContent',
  title: 'State Content',
  type: 'document',
  groups: [
    { name: 'general', title: '🗺️ State Basics', default: true },
    { name: 'content', title: '📄 Page Content' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'State Name',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'general',
      description: 'e.g. New Jersey, California, Texas',
    }),
    defineField({
      name: 'abbr',
      title: 'State Abbreviation',
      type: 'string',
      validation: (rule) => rule.required().max(2),
      group: 'general',
      description: 'Two-letter US state postal code (e.g. NJ, CA, TX)',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      validation: (rule) => rule.required(),
      group: 'general',
      options: {
        source: 'name',
        maxLength: 96,
      },
      description: 'Unique URL path for this state (e.g. new-jersey)',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Hero Image',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      description: 'Main state directory hero visual.',
    }),

    // Custom Content Group
    defineField({
      name: 'customContent',
      title: 'Custom Page Content',
      type: 'object',
      group: 'content',
      description: 'Custom editorial content, hero header, FAQs, and local guides for this state.',
      groups: [
        { name: 'hero', title: '🎯 Hero Header', default: true },
        { name: 'insights', title: '💡 Insights & Guide' },
        { name: 'faqs', title: '❓ FAQs' },
        { name: 'cta', title: '📣 Custom CTAs' },
      ],
      fields: [
        // --- HERO SECTION ---
        defineField({
          name: 'heroHeading',
          title: 'Hero Heading (H1)',
          type: 'string',
          group: 'hero',
          description: 'Main headline (e.g. "Indoor Dog Parks in New Jersey")',
        }),
        defineField({
          name: 'heroEyebrow',
          title: 'Hero Eyebrow Tag',
          type: 'string',
          group: 'hero',
          description: 'Small badge above the H1 (e.g. "STATE DIRECTORY")',
        }),
        defineField({
          name: 'heroDescription',
          title: 'Hero Lead Description',
          type: 'text',
          rows: 3,
          group: 'hero',
          description: 'Lead description under the H1 and SEO meta description.',
        }),
        defineField({
          name: 'heroPill',
          title: 'Hero Badge Pill',
          type: 'string',
          group: 'hero',
        }),
        defineField({
          name: 'heroImageAlt',
          title: 'Hero Image Alt Text',
          type: 'string',
          group: 'hero',
        }),
        defineField({
          name: 'heroChips',
          title: 'Hero Feature Chips',
          type: 'array',
          group: 'hero',
          of: [{ type: 'heroChip' }],
        }),
        defineField({
          name: 'heroFootnotes',
          title: 'Hero Footnotes / Badges',
          type: 'array',
          group: 'hero',
          of: [{ type: 'string' }],
        }),

        // --- INSIGHTS & PLANNING ---
        defineField({
          name: 'insightIntro',
          title: 'Insights Introduction',
          type: 'text',
          rows: 2,
          group: 'insights',
        }),
        defineField({
          name: 'insightCards',
          title: 'Insight Cards',
          type: 'array',
          group: 'insights',
          of: [{ type: 'cityInsightCard' }],
        }),
        defineField({
          name: 'planningCards',
          title: 'Planning Cards',
          type: 'array',
          group: 'insights',
          of: [{ type: 'planningCard' }],
        }),

        // --- FAQS ---
        defineField({
          name: 'faqs',
          title: 'State FAQs',
          type: 'array',
          group: 'faqs',
          of: [{ type: 'faqItem' }],
        }),

        // --- CTAS ---
        defineField({
          name: 'ownerCta',
          title: 'Park Owner CTA Banner (Optional)',
          type: 'supportCta',
          group: 'cta',
          options: { collapsible: true, collapsed: true },
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
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled State',
        subtitle: subtitle ? `State Code: ${subtitle}` : undefined,
        media,
      };
    },
  },
});
