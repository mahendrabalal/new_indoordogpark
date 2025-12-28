# Phoenix Blog Post Import - Status & Next Steps

## ✅ What's Been Completed

1. **Schema Updates**
   - ✅ Added `excerpt` field to `postType.ts`
   - ✅ Created `tagType.ts` for tags support
   - ✅ Added `tags` field to `postType.ts`
   - ✅ Updated schema index to include tagType

2. **Import Script Created**
   - ✅ Script at `scripts/import-phoenix-blog-post.ts`
   - ✅ Converts markdown to Portable Text
   - ✅ Creates/finds categories and tags
   - ✅ Creates/finds author
   - ✅ Imports blog post content

3. **Blog Content Ready**
   - ✅ 2,126-word high-quality blog post
   - ✅ EEAT compliant with citations
   - ✅ Internal links to indoordogpark.org
   - ✅ External links to authoritative sources
   - ✅ Tables and visualizations included

## ⚠️ Current Issue

The Sanity API token in `.env.local` doesn't have write permissions. The script successfully:
- ✅ Reads the markdown file
- ✅ Converts to Portable Text (149 blocks)
- ✅ Attempts to create categories
- ❌ Fails with: "Insufficient permissions; permission 'create' required"

## 🔧 How to Fix

### Step 1: Create New Sanity API Token with Write Permissions

1. Go to https://sanity.io/manage
2. Select your project (ID: `ruuprk8g`)
3. Navigate to **API** → **Tokens**
4. Click **Add API token**
5. Set:
   - **Name**: "Blog Import Token" (or similar)
   - **Permissions**: **Editor** (full read/write access)
   - **Dataset**: `production`
6. Copy the token
7. Update `.env.local`:
   ```
   SANITY_API_TOKEN=your_new_token_here
   ```

### Step 2: Restart Sanity Studio (If Running)

If you have Sanity Studio running, restart it to pick up schema changes:
```bash
npm run dev
```

### Step 3: Run Import Script Again

```bash
npx ts-node scripts/import-phoenix-blog-post.ts
```

Expected output:
```
🚀 Starting blog post import...
📝 Title: Best Indoor Dog Parks in Phoenix: Your Complete Guide
📄 Excerpt: Phoenix, Arizona, is known for its scorching summers...
🔄 Converting markdown to Portable Text...
✓ Converted 149 blocks
📁 Creating/finding categories...
✓ Created category "Indoor Dog Parks"
✓ Created category "Location Guides"
🏷️  Creating/finding tags...
✓ Created tag "phoenix"
✓ Created tag "arizona"
✓ Created tag "indoor-dog-parks"
✓ Created tag "dog-safety"
👤 Creating/finding author...
✓ Created author "Indoor Dog Park Team"
📝 Creating new blog post...
✅ Post created successfully!
```

## 📋 Post-Import Checklist

After successful import:

- [ ] **Add Featured Image**
  - Open Sanity Studio: `http://localhost:3000/studio`
  - Find the post: "Best Indoor Dog Parks in Phoenix: Your Complete Guide"
  - Upload featured image (1200x630px recommended)
  - Alt text: "Indoor dog park in Phoenix, Arizona with dogs playing in climate-controlled environment"

- [ ] **Review Content**
  - Check formatting in Sanity Studio
  - Verify all sections display correctly
  - Check that links work properly

- [ ] **Verify Categories & Tags**
  - Categories: "Indoor Dog Parks", "Location Guides"
  - Tags: "phoenix", "arizona", "indoor-dog-parks", "dog-safety"

- [ ] **Set Published Date**
  - Set `publishedAt` to current date/time
  - Or schedule for future publication

- [ ] **Publish**
  - Click "Publish" in Sanity Studio
  - Verify at: `https://indoordogpark.org/blog/best-indoor-dog-parks-phoenix-complete-guide`

## 📊 Expected SEO Performance

- **Target Keyword**: "indoor dog park in phoenix"
- **Monthly Searches**: 320
- **Difficulty**: 6 (Excellent opportunity!)
- **Expected Ranking**: 2-4 weeks with proper optimization
- **Content Quality**: EEAT compliant, 2,126 words, well-structured

## 🔗 Files Created

1. `blog-content/phoenix-indoor-dog-parks-guide.md` - Markdown version
2. `blog-content/phoenix-indoor-dog-parks-guide.html` - HTML version
3. `blog-content/phoenix-indoor-dog-parks-guide-sanity.json` - Sanity structure
4. `scripts/import-phoenix-blog-post.ts` - Import script
5. `IMPORT_PHOENIX_BLOG_GUIDE.md` - Detailed import guide
6. `src/sanity/schemaTypes/tagType.ts` - Tag schema (new)
7. Updated `src/sanity/schemaTypes/postType.ts` - Added excerpt & tags
8. Updated `src/sanity/schemaTypes/index.ts` - Added tagType

## 🆘 Troubleshooting

### If script still fails after updating token:
1. Verify token has "Editor" permissions (not "Viewer")
2. Check token is for correct dataset (`production`)
3. Ensure token hasn't expired
4. Try creating a new token

### If content looks wrong:
- The markdown converter is basic - you may need to manually adjust formatting
- Tables are skipped - add them manually as HTML blocks if needed
- Some complex formatting may need manual review in Sanity Studio

### Alternative: Manual Import
If the script continues to have issues, you can manually import:
1. Open Sanity Studio
2. Create new "Post"
3. Copy content from `blog-content/phoenix-indoor-dog-parks-guide.md`
4. Paste section by section
5. Add categories and tags manually
6. Upload featured image
7. Publish

---

**Status**: Ready to import - waiting for API token with write permissions








































