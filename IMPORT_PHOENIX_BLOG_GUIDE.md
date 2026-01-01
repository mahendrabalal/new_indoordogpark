# Import Phoenix Blog Post to Sanity CMS

This guide will help you import the Phoenix Indoor Dog Parks blog post into your Sanity CMS.

## Prerequisites

1. **Sanity API Token with Write Permissions**
   - Go to https://sanity.io/manage
   - Select your project
   - Go to API → Tokens
   - Create a new token with "Editor" permissions
   - Add it to `.env.local`:
     ```
     SANITY_API_TOKEN=your_token_here
     ```

2. **Environment Variables**
   Make sure `.env.local` has:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token_here
   ```

## Step 1: Update Sanity Schema (If Needed)

The blog post requires `excerpt` and `tags` fields. Check if your schema includes these:

### Option A: If schema already has excerpt and tags

Skip to Step 2.

### Option B: If schema needs updating

1. Add `excerpt` field to `src/sanity/schemaTypes/postType.ts`:
   ```typescript
   defineField({
     name: 'excerpt',
     type: 'text',
     title: 'Excerpt',
     description: 'Short description for previews',
   }),
   ```

2. Create `src/sanity/schemaTypes/tagType.ts`:
   ```typescript
   import {TagIcon} from '@sanity/icons'
   import {defineField, defineType} from 'sanity'

   export const tagType = defineType({
     name: 'tag',
     title: 'Tag',
     type: 'document',
     icon: TagIcon,
     fields: [
       defineField({
         name: 'title',
         type: 'string',
       }),
       defineField({
         name: 'slug',
         type: 'slug',
         options: {
           source: 'title',
         },
       }),
     ],
   })
   ```

3. Add tags field to `postType.ts`:
   ```typescript
   defineField({
     name: 'tags',
     type: 'array',
     of: [defineArrayMember({type: 'reference', to: {type: 'tag'}})],
   }),
   ```

4. Update `src/sanity/schemaTypes/index.ts`:
   ```typescript
   import {tagType} from './tagType'
   
   export const schema: { types: SchemaTypeDefinition[] } = {
     types: [blockContentType, categoryType, postType, authorType, tagType],
   }
   ```

5. Restart your dev server:
   ```bash
   npm run dev
   ```

## Step 2: Run the Import Script

```bash
npx ts-node scripts/import-phoenix-blog-post.ts
```

The script will:
- ✅ Convert markdown to Portable Text format
- ✅ Create/find categories: "Indoor Dog Parks" and "Location Guides"
- ✅ Create/find tags: "phoenix", "arizona", "indoor-dog-parks", "dog-safety"
- ✅ Create/find author: "Indoor Dog Park Team"
- ✅ Create the blog post with all content

## Step 3: Add Featured Image

1. Open Sanity Studio: `http://localhost:3000/studio`
2. Find the blog post: "Best Indoor Dog Parks in Phoenix: Your Complete Guide"
3. Click to edit
4. Upload a featured image:
   - Recommended: Phoenix skyline with dogs, indoor dog park interior, or dogs playing indoors
   - Size: 1200x630px (optimal for social sharing)
   - Alt text: "Indoor dog park in Phoenix, Arizona with dogs playing in climate-controlled environment"
5. Save

## Step 4: Review and Publish

1. Review the content in Sanity Studio
2. Check that all formatting looks correct
3. Verify categories and tags are assigned
4. Set `publishedAt` date if needed
5. Click "Publish"

## Step 5: Verify

1. Visit: `https://indoordogpark.org/blog/best-indoor-dog-parks-phoenix-complete-guide`
2. Check that:
   - Content displays correctly
   - Images load properly
   - Internal links work
   - Categories and tags appear
   - Featured image shows

## Troubleshooting

### Error: "SANITY_API_TOKEN is required"
- Make sure you've added the token to `.env.local`
- Restart your terminal/IDE after adding the token

### Error: "Schema validation failed"
- Make sure you've updated the schema (Step 1)
- Restart Sanity Studio after schema changes

### Error: "Tag type not found"
- Create the `tagType.ts` file as shown in Step 1
- Make sure it's imported in `index.ts`

### Content looks wrong
- The markdown converter is basic - you may need to manually adjust formatting in Sanity Studio
- Tables are skipped - add them manually as HTML blocks if needed

### Links not working
- Check that links in the markdown are properly formatted
- Internal links should use full URLs: `https://indoordogpark.org/...`

## Manual Alternative

If the script doesn't work, you can manually import:

1. Open Sanity Studio
2. Create new "Post"
3. Copy content from `blog-content/phoenix-indoor-dog-parks-guide.md`
4. Paste section by section
5. Add categories and tags manually
6. Upload featured image
7. Publish

## Next Steps After Import

1. **Monitor Performance**
   - Set up Google Search Console
   - Track keyword rankings for "indoor dog park in phoenix"
   - Monitor organic traffic

2. **Update Content**
   - Verify facility information (call to confirm hours/pricing)
   - Add real photos if available
   - Update any outdated information

3. **Promote**
   - Share on social media
   - Link from homepage if relevant
   - Add to sitemap (should be automatic)

4. **Optimize**
   - Add more internal links to related content
   - Update meta description if needed
   - Add schema markup (already handled by StructuredData component)

---

**Expected Results:**
- Target keyword: "indoor dog park in phoenix" (320 monthly searches, Difficulty: 6)
- Should rank within 2-4 weeks with proper optimization
- High-quality, EEAT-compliant content ready for search engines











































