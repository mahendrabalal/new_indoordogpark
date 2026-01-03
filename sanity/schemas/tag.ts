import { defineType, defineField } from 'sanity';

// Custom slugify function for consistent, URL-friendly slugs
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .slice(0, 96);
}

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: slugify,
      },
      validation: (Rule) =>
        Rule.required()
          .custom((slug) => {
            if (!slug?.current) {
              return 'Slug is required';
            }
            // Ensure slug is URL-friendly (lowercase, hyphens only, no spaces)
            const slugValue = slug.current;
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue)) {
              return 'Slug must be lowercase with hyphens only (e.g., "las-vegas-nevada")';
            }
            if (slugValue.length < 1 || slugValue.length > 96) {
              return 'Slug must be between 1 and 96 characters';
            }
            return true;
          }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
});

