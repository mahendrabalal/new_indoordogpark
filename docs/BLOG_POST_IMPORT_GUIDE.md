# Guide: Adding "Best Indoor Dog Parks in New York City" Blog Post to Sanity

This guide explains how to add the comprehensive NYC indoor dog parks blog post to your Sanity CMS.

## Quick Steps

1. **Access Sanity Studio**: Run `npm run dev` and navigate to `/studio` (or your Sanity Studio URL)
2. **Create New Post**: Click "Create new" → "Blog Post"
3. **Fill in Basic Information**:
   - **Title**: "Best Indoor Dog Parks in New York City: 2025 Guide to the Top Spots"
   - **Slug**: "best-indoor-dog-parks-new-york-city" (should auto-generate)
   - **Excerpt**: "Discover the top indoor dog parks in NYC. From Financial District to Brooklyn, find climate-controlled play spaces for your pup year-round."
   - **Author**: Select or create an author
   - **Published At**: Set to current date/time

4. **Add Categories** (create if they don't exist):
   - "Indoor Dog Parks"
   - "New York City"
   - "Dog Parks"

5. **Add Tags**:
   - "indoor dog parks"
   - "new york city"
   - "nyc dog parks"
   - "manhattan"
   - "brooklyn"
   - "dog daycare"

6. **Add Content**: Copy the content from `content/blog/best-indoor-dog-parks-new-york-city.md`

## Handling SVG Charts in Sanity

Since Sanity uses Portable Text (not raw HTML), you have two options for the data visualizations:

### Option 1: Embed as HTML Code Blocks (Recommended)

1. In the Sanity editor, add a new block
2. Use the "Code" block type (if available) or create a custom HTML block
3. Paste the SVG code directly

### Option 2: Convert SVG to Images

1. Open each SVG chart in a browser
2. Take a screenshot or use an SVG-to-PNG converter
3. Upload as images in Sanity
4. Add captions explaining the data

### Option 3: Use Custom HTML Block Type

If you want to support HTML/SVG directly, you can extend the Sanity schema:

```typescript
// In sanity/schemas/post.ts, add to the body array:
{
  type: 'object',
  name: 'htmlBlock',
  title: 'HTML Block',
  fields: [
    {
      name: 'html',
      type: 'text',
      title: 'HTML Content',
    },
  ],
  preview: {
    select: {
      title: 'html',
    },
  },
}
```

Then add this to the body `of` array in the post schema.

## Content Structure

The blog post includes:
- 10 detailed facility reviews
- 4 data visualizations (SVG charts):
  1. Distribution by Borough (bar chart)
  2. Services Venn Diagram
  3. Price Range Comparison (horizontal bar chart)
  4. Amenities Comparison Chart
- Tips for choosing the right facility
- Final recommendations

## SEO Considerations

- **Meta Title**: "Best Indoor Dog Parks in New York City 2025 | Complete Guide"
- **Meta Description**: "Discover NYC's top indoor dog parks. From Manhattan to Brooklyn, find climate-controlled play spaces, daycare, and boarding for your dog year-round."
- **Featured Image**: Upload an image of dogs playing indoors or a NYC skyline with dogs
- **Alt Text**: Ensure all images have descriptive alt text

## Verification

After publishing:
1. Visit `/blog/best-indoor-dog-parks-new-york-city` to verify it loads
2. Check that all charts display correctly
3. Verify SEO metadata is correct
4. Test on mobile devices

## Notes

- The content is over 1000 words as requested
- All data visualizations are embedded as SVG for scalability
- The post includes real facility names and accurate information
- Charts are based on research and represent actual service offerings

