import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'supportCta',
  title: 'Support CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primary',
      title: 'Primary Button',
      type: 'ctaButton',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondary',
      title: 'Secondary Button',
      type: 'ctaButton',
    }),
    defineField({
      name: 'footnote',
      title: 'Footnote',
      type: 'string',
    }),
  ],
});
