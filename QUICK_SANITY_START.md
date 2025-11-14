# Quick Start: Sanity CMS Setup (5 Minutes)

Follow these steps to get your blog running with Sanity CMS.

## 1. Create Sanity Account & Project (2 minutes)

1. Visit: **https://www.sanity.io/get-started**
2. Click "Get started for free"
3. Sign up with GitHub/Google/Email
4. Create a new project:
   - Name: `California Dog Parks Blog`
   - Template: **"Clean project"**
5. **Copy your Project ID** (looks like: `abc12xyz`)

## 2. Configure Your App (1 minute)

Open `.env.local` and update:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_SANITY_DATASET=production
```

Replace `YOUR_PROJECT_ID_HERE` with your actual project ID from step 1.

## 3. Deploy Schemas to Sanity (1 minute)

Run these commands:

```bash
npm install -g @sanity/cli
npx sanity@latest init --project YOUR_PROJECT_ID --dataset production --output-path sanity-studio
cd sanity-studio
npx sanity deploy
```

Choose a studio hostname when prompted (e.g., `californiadogparks`).

## 4. Add Content (1 minute)

1. Open your Sanity Studio: `https://your-hostname.sanity.studio`
2. Create an Author (your name)
3. Create a Category (e.g., "Park Reviews")
4. Create your first Blog Post:
   - Add title, slug, author, category
   - Write content in the rich text editor
   - **Click "Publish"** (not just save)

## 5. View Your Blog

```bash
npm run dev
```

Visit: **http://localhost:3000/blog**

Your blog is now live! 🎉

---

## Next Steps

- Add more posts in Sanity Studio
- Customize categories and tags
- Upload featured images
- Share your blog

**Full documentation**: See `SANITY_SETUP.md` for advanced features.

