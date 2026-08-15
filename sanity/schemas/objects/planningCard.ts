import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'planningCard',
  title: 'Planning Card',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon (Bootstrap class, e.g., bi-thermometer-sun)',
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
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
