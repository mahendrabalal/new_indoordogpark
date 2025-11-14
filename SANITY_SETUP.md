# Sanity CMS Setup Guide

This guide will help you set up Sanity as your headless CMS for the California Dog Parks blog.

## Why Sanity?

- ✅ **100% Free Forever** - Unlimited posts, 3 users, 100K API requests/month
- ✅ **Industry Standard** - Used by Figma, Sonos, PUMA
- ✅ **Real-time Collaboration** - Google Docs-like editing experience
- ✅ **Powerful & Flexible** - GROQ query language, customizable schemas
- ✅ **No WordPress Hosting** - No server maintenance or costs

## Step 1: Create a Sanity Account

1. Go to https://www.sanity.io
2. Click **"Get started for free"**
3. Sign up with GitHub, Google, or email
4. Verify your email if needed

## Step 2: Create a New Sanity Project

1. Once logged in, click **"Create project"** in the dashboard
2. Enter project details:
   - **Project name**: `California Dog Parks Blog` (or your preferred name)
   - **Use template**: Choose **"Clean project with no predefined schemas"**
3. Click **"Create project"**
4. **Copy your Project ID** - you'll need this next

## Step 3: Configure Environment Variables

1. Open `.env.local` in your project root
2. Find the Sanity section (at the bottom)
3. Replace `your_project_id_here` with your actual Project ID:

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345  # Replace with your project ID
NEXT_PUBLIC_SANITY_DATASET=production
```

4. Save the file

## Step 4: Install Sanity CLI (Optional but Recommended)

```bash
npm install -g @sanity/cli
```

## Step 5: Initialize Sanity Studio

Run this command in your project directory:

```bash
npx sanity@latest init --project YOUR_PROJECT_ID --dataset production --output-path sanity-studio
```

Replace `YOUR_PROJECT_ID` with your actual project ID.

When prompted:
- **Add configuration files?** → Yes
- **Use TypeScript?** → Yes
- **Install dependencies?** → Yes

## Step 6: Deploy Your Schemas to Sanity

```bash
cd sanity-studio
npx sanity deploy
```

Choose a studio hostname (e.g., `californiadogparks`) when prompted.

## Step 7: Access Sanity Studio

Your Sanity Studio will be available at:
```
https://your-chosen-hostname.sanity.studio
```

Or run it locally:
```bash
cd sanity-studio
npm run dev
```

## Step 8: Add Your First Blog Content

### 1. Create an Author
1. In Sanity Studio, click **"Author"** in the left sidebar
2. Click **"Create new Author"**
3. Fill in:
   - **Name**: Your name or team name
   - **Slug**: Auto-generated from name (click "Generate")
   - **Image**: Optional author photo
   - **Bio**: Short bio about yourself
4. Click **"Publish"**

### 2. Create Categories
1. Click **"Category"** in the sidebar
2. Create a few categories like:
   - Park Reviews
   - Dog Training
   - Pet Health
   - Indoor Parks
3. For each category:
   - **Title**: Category name
   - **Slug**: Auto-generated (click "Generate")
   - **Description**: Optional brief description
4. Publish each one

### 3. Create Tags (Optional)
1. Click **"Tag"** in the sidebar
2. Create tags like:
   - Los Angeles
   - San Francisco
   - Training Tips
   - Puppy Care
3. Publish each tag

### 4. Create Your First Blog Post
1. Click **"Blog Post"** in the sidebar
2. Click **"Create new Blog Post"**
3. Fill in the form:
   - **Title**: Your blog post title
   - **Slug**: Click "Generate" to auto-create from title
   - **Excerpt**: Short summary (optional)
   - **Author**: Select the author you created
   - **Featured Image**: Upload a featured image
     - Add **Alt text** for accessibility
     - Add **Caption** (optional)
   - **Categories**: Select one or more categories
   - **Tags**: Select relevant tags
   - **Published at**: Will default to now
   - **Body**: Write your blog post content
     - Use the rich text editor
     - Add headings (H2, H3, etc.)
     - Add images inline
     - Add links
     - Format text (bold, italic, etc.)
4. Click **"Publish"** when ready

## Step 9: Test Your Blog

1. Restart your Next.js development server:
```bash
npm run dev
```

2. Visit http://localhost:3000/blog

You should now see your Sanity blog posts!

## Content Management Workflow

### To Add a New Post:
1. Go to your Sanity Studio
2. Click "Blog Post" → "Create new Blog Post"
3. Fill in the content
4. Click "Publish"
5. Your Next.js site will automatically fetch the new post (cached for 5 minutes)

### To Edit a Post:
1. Find the post in Sanity Studio
2. Make your changes
3. Click "Publish" to save
4. Changes will appear on your site within 5 minutes

### To Unpublish a Post:
1. Open the post in Sanity Studio
2. Click the three dots menu
3. Click "Unpublish"

## Troubleshooting

### "Unable to load blog posts"

**Solution**: Check your `.env.local` file:
- Make sure `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly
- Make sure you've published at least one blog post in Sanity Studio
- Restart your Next.js dev server after changing env variables

### "No posts showing"

**Solution**:
- Make sure you've published posts in Sanity (not just saved as drafts)
- Check the browser console for errors
- Verify your Project ID is correct

### Schema Errors

**Solution**:
- Make sure you ran `npx sanity deploy` to push your schemas
- Check the Sanity Studio console for errors

## Advanced Features

### Custom Domain for Sanity Studio

You can host your Sanity Studio on your own domain:

1. Build the studio:
```bash
cd sanity-studio
npm run build
```

2. Deploy the `dist` folder to Vercel, Netlify, or any static host

### Webhooks for Instant Updates

To make your Next.js site update immediately when you publish in Sanity:

1. In Sanity dashboard, go to **API** → **Webhooks**
2. Add a new webhook
3. URL: `https://your-site.com/api/revalidate` (you'll need to create this API route)
4. Trigger on: Document changes
5. Filter: `_type == "post"`

### Image Optimization

Sanity automatically optimizes images. Use the `urlForImage` helper:

```typescript
import { urlForImage } from '@/lib/sanity-client';

// Get optimized image URL
const imageUrl = urlForImage(post.mainImage)
  .width(800)
  .height(450)
  .format('webp')
  .quality(80)
  .url();
```

## Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **GROQ Query Language**: https://www.sanity.io/docs/groq
- **Sanity Studio**: https://www.sanity.io/docs/sanity-studio
- **Community**: https://www.sanity.io/exchange

## Support

If you run into issues:
1. Check the Sanity documentation
2. Visit the Sanity Slack community
3. Search for solutions on Stack Overflow
4. Check your browser console for detailed error messages

---

**You're all set!** 🎉 You now have a professional, free, industry-standard CMS powering your blog with no hosting costs.

