import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      description: 'Brief summary of the post (optional)',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        {
          type: 'object',
          name: 'videoBlock',
          title: 'Video',
          fields: [
            {
              name: 'videoType',
              type: 'string',
              title: 'Video Type',
              options: {
                list: [
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Vimeo', value: 'vimeo' },
                  { title: 'Direct Upload', value: 'file' },
                  { title: 'Embed Code', value: 'embed' },
                ],
                layout: 'radio',
              },
              initialValue: 'youtube',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'youtubeUrl',
              type: 'url',
              title: 'YouTube URL',
              description: 'Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=...)',
              hidden: ({ parent }) => parent?.videoType !== 'youtube',
            },
            {
              name: 'vimeoUrl',
              type: 'url',
              title: 'Vimeo URL',
              description: 'Paste the full Vimeo URL (e.g., https://vimeo.com/...)',
              hidden: ({ parent }) => parent?.videoType !== 'vimeo',
            },
            {
              name: 'videoFile',
              type: 'file',
              title: 'Video File',
              description: 'Upload a video file (MP4, WebM, etc.)',
              options: {
                accept: 'video/*',
              },
              hidden: ({ parent }) => parent?.videoType !== 'file',
            },
            {
              name: 'embedCode',
              type: 'text',
              title: 'Embed Code',
              description: 'Paste the iframe embed code or HTML',
              rows: 4,
              hidden: ({ parent }) => parent?.videoType !== 'embed',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the video',
            },
            {
              name: 'autoplay',
              type: 'boolean',
              title: 'Autoplay',
              description: 'Automatically play video when page loads (not recommended for accessibility)',
              initialValue: false,
            },
            {
              name: 'loop',
              type: 'boolean',
              title: 'Loop',
              description: 'Loop the video',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              videoType: 'videoType',
              youtubeUrl: 'youtubeUrl',
              vimeoUrl: 'vimeoUrl',
              caption: 'caption',
            },
            prepare({ videoType, youtubeUrl, vimeoUrl, caption }) {
              let subtitle = 'Video';
              if (videoType === 'youtube' && youtubeUrl) {
                subtitle = `YouTube: ${youtubeUrl}`;
              } else if (videoType === 'vimeo' && vimeoUrl) {
                subtitle = `Vimeo: ${vimeoUrl}`;
              } else if (videoType === 'file') {
                subtitle = 'Video File';
              } else if (videoType === 'embed') {
                subtitle = 'Embed Code';
              }
              return {
                title: caption || 'Video',
                subtitle,
                media: () => '🎥',
              };
            },
          },
        },
        {
          type: 'object',
          name: 'htmlBlock',
          title: 'HTML Block',
          fields: [
            {
              name: 'html',
              type: 'text',
              title: 'HTML Content',
              description: 'Raw HTML content (for charts, embeds, etc.)',
            },
          ],
          preview: {
            select: {
              html: 'html',
            },
            prepare({ html }) {
              const preview = html ? html.substring(0, 50).replace(/<[^>]*>/g, '') : 'Empty HTML block';
              return {
                title: 'HTML Block',
                subtitle: preview,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});

