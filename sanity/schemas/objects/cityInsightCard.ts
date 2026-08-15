import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cityInsightCard',
  title: 'Insight Card',
  type: 'object',
  fields: [
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'copy',
      title: 'Copy',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accent',
      title: 'Accent Card?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
