import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cityContent',
  title: 'City Content',
  type: 'document',
  groups: [
    { name: 'general', title: '🏙️ City Basics', default: true },
    { name: 'content', title: '📄 Page Content' },
  ],
  fields: [
    defineField({
      name: 'city',
      title: 'City Name',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'general',
      description: 'e.g. Newark, Los Angeles, Austin',
    }),
    defineField({
      name: 'state',
      title: 'State Abbreviation',
      type: 'string',
      validation: (rule) => rule.required().max(2),
      group: 'general',
      description: 'Two-letter US state code (e.g. NJ, CA, TX)',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      validation: (rule) => rule.required(),
      group: 'general',
      description: 'Unique URL path for this city page (e.g. newark-nj)',
      options: {
        source: (doc: any) => `${doc.city || ''}-${doc.state || ''}`.toLowerCase().replace(/\s+/g, '-'),
        maxLength: 96,
      },
    }),
    defineField({
      name: 'summary',
      title: 'Short Tagline / Summary',
      type: 'text',
      rows: 2,
      group: 'general',
      description: 'Brief overview displayed in city grids, search cards, and sitemaps.',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Hero Image',
      type: 'image',
      group: 'general',
      description: 'High-resolution city hero visual. If empty, falls back to local images or top park photo.',
      options: { hotspot: true },
    }),

    // Custom Content Group
    defineField({
      name: 'customContent',
      title: 'Custom Page Content',
      type: 'object',
      group: 'content',
      description: 'Custom editorial content, hero header, FAQs, and local guides for this city.',
      groups: [
        { name: 'hero', title: '🎯 Hero Header', default: true },
        { name: 'editorial', title: '📝 Editorial & Story' },
        { name: 'insights', title: '💡 Insights & Guide' },
        { name: 'faqs', title: '❓ FAQs & Q&A' },
        { name: 'cta', title: '📣 Custom CTAs' },
      ],
      fields: [
        // --- HERO SECTION ---
        defineField({
          name: 'heroHeading',
          title: 'Hero Heading (H1)',
          type: 'string',
          group: 'hero',
          description: 'Main page headline (e.g. "Dog Parks in Newark, NJ")',
        }),
        defineField({
          name: 'heroEyebrow',
          title: 'Hero Eyebrow Tag',
          type: 'string',
          group: 'hero',
          description: 'Small badge above the H1 (e.g. "CITY SPOTLIGHT" or "LOCAL GUIDE")',
        }),
        defineField({
          name: 'heroDescription',
          title: 'Hero Lead Description',
          type: 'text',
          rows: 3,
          group: 'hero',
          description: '1-2 sentence lead paragraph under the H1. Also used for Google search meta description.',
        }),
        defineField({
          name: 'heroPill',
          title: 'Hero Badge Pill',
          type: 'string',
          group: 'hero',
          description: 'Optional highlight pill (e.g. "23 Verified Parks • 2 Off-Leash Runs")',
        }),
        defineField({
          name: 'heroImageAlt',
          title: 'Hero Image Alt Text',
          type: 'string',
          group: 'hero',
          description: 'Descriptive alt text for accessibility and SEO image ranking.',
        }),
        defineField({
          name: 'heroChips',
          title: 'Hero Feature Chips',
          type: 'array',
          group: 'hero',
          of: [{ type: 'heroChip' }],
          description: 'Interactive metric pills displayed in the hero section.',
        }),
        defineField({
          name: 'heroFootnotes',
          title: 'Hero Footnotes / Badges',
          type: 'array',
          group: 'hero',
          of: [{ type: 'string' }],
          description: 'Small trust badges below the action buttons (e.g. "100% Free Directory", "Verified Hours").',
        }),

        // --- EDITORIAL & STORY ---
        defineField({
          name: 'longDescription',
          title: 'Long Description (Editorial Paragraphs)',
          type: 'array',
          group: 'editorial',
          of: [{ type: 'text', rows: 4 }],
          description: 'Comprehensive local guide. Each item is a separate paragraph. Supports markdown links [Link Text](https://...), headings (## Section Title), and bullet lists (- item).',
        }),
        defineField({
          name: 'neighborhoods',
          title: 'Featured Neighborhoods',
          type: 'array',
          group: 'editorial',
          of: [{ type: 'neighborhood' }],
          description: 'Dog-friendly districts and neighborhoods with local notes.',
        }),
        defineField({
          name: 'expertTips',
          title: 'Local Expert Tips',
          type: 'array',
          group: 'editorial',
          of: [{ type: 'string' }],
          description: 'Helpful tips from local pet parents (e.g. parking tricks, seasonal rules, peak hours).',
        }),

        // --- INSIGHTS & PLANNING ---
        defineField({
          name: 'insightIntro',
          title: 'Insights Introduction',
          type: 'text',
          rows: 2,
          group: 'insights',
          description: 'Brief lead text introducing the local climate, transit, or park advice cards.',
        }),
        defineField({
          name: 'insightCards',
          title: 'Insight Cards',
          type: 'array',
          group: 'insights',
          of: [{ type: 'cityInsightCard' }],
          description: 'Key informational cards (e.g. Climate, Transit, Leash Etiquette).',
        }),
        defineField({
          name: 'planningCards',
          title: 'Planning Cards',
          type: 'array',
          group: 'insights',
          of: [{ type: 'planningCard' }],
          description: 'Actionable planning checklists (e.g. What to Bring, First-Time Visitor Guide).',
        }),
        defineField({
          name: 'mapSidebarNote',
          title: 'Map Sidebar Note',
          type: 'text',
          rows: 2,
          group: 'insights',
          description: 'Helpful tip displayed right beside the interactive city park map.',
        }),

        // --- FAQS & SUPPORT ---
        defineField({
          name: 'faqs',
          title: 'City FAQs',
          type: 'array',
          group: 'faqs',
          of: [{ type: 'faqItem' }],
          description: 'Frequently asked questions about dog parks, licenses, and pet rules in this city.',
        }),
        defineField({
          name: 'faqSupportCard',
          title: 'FAQ Support Card (Optional)',
          type: 'supportCta',
          group: 'faqs',
          options: { collapsible: true, collapsed: true },
          description: 'Optional custom assistance card embedded within the FAQ accordion.',
        }),

        // --- CTAS ---
        defineField({
          name: 'ownerCta',
          title: 'Park Owner CTA Banner (Optional)',
          type: 'supportCta',
          group: 'cta',
          options: { collapsible: true, collapsed: true },
          description: 'Custom call-to-action banner inviting local business owners to claim/list their facility.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'city',
      subtitle: 'state',
      media: 'featuredImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ? `${title}, ${subtitle || ''}` : 'Untitled City',
        subtitle: subtitle ? `State: ${subtitle}` : undefined,
        media,
      };
    },
  },
});
