# Setup New Sanity Account - Quick Start Guide

Since you cannot log in to your old account, here's how to create a new Sanity account and get up and running immediately.

## 🚀 Quick Setup Steps

### Step 1: Create New Sanity Account

1. Go to **https://www.sanity.io**
2. Click **"Sign Up"** (top right)
3. Choose your sign-in method:
   - **Google** (recommended - use mahendrabalalport@gmail.com)
   - **GitHub** (if you prefer)
   - **Email/Password** (use mahendrabalalport@gmail.com)
4. Complete the sign-up process

### Step 2: Create New Project

1. After signing up, you'll be prompted to create a project
2. **Project Name**: `California Dog Parks Blog`
3. **Dataset**: `production` (default)
4. Click **"Create Project"**
5. **IMPORTANT**: Copy your new **Project ID** (you'll see it in the dashboard)

### Step 3: Get Your Project ID

Your Project ID will look something like: `abc123xy` (8 characters)

You can find it:
- In the project dashboard URL: `https://www.sanity.io/manage/project/YOUR_PROJECT_ID`
- In the project settings
- In the Sanity Studio URL

### Step 4: Update Your Local Configuration

You need to update your `.env.local` file with the new project ID.

#### Option A: Manual Update

1. Create or edit `.env.local` in your project root
2. Add or update these lines:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-new-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

#### Option B: Use the Setup Script

I can create a script to help you update this automatically.

### Step 5: Access Sanity Studio Locally

1. Make sure your `.env.local` has the new project ID
2. Run your development server:
   ```bash
   npm run dev
   ```
3. Navigate to: **http://localhost:3000/studio**
4. You should see the Sanity Studio login page
5. Log in with your new account (mahendrabalalport@gmail.com)

### Step 6: Import Your Blog Content (Optional)

Your blog posts are stored locally in `content/blog/` folder. You can:
- Manually create posts in Sanity Studio
- Use Sanity's import tools
- Write a script to import from markdown files

---

## 📋 Checklist

- [ ] Created new Sanity account with mahendrabalalport@gmail.com
- [ ] Created new project "California Dog Parks Blog"
- [ ] Copied new Project ID
- [ ] Updated `.env.local` with new Project ID
- [ ] Restarted development server (`npm run dev`)
- [ ] Successfully logged into Sanity Studio at localhost:3000/studio
- [ ] (Optional) Imported blog content from `content/blog/` folder

---

## 🔧 Troubleshooting

### Can't see Sanity Studio?
- Make sure `.env.local` exists and has `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Restart your dev server after updating `.env.local`
- Check browser console for errors

### Project ID not working?
- Verify the Project ID is correct (8 characters, no spaces)
- Make sure you're using the same account that created the project
- Check that the dataset is set to `production`

### Still can't log in?
- Clear browser cache and cookies
- Try a different browser
- Make sure you're using the correct email (mahendrabalalport@gmail.com)

---

## 📁 Your Content is Safe

**Remember**: All your blog posts in `content/blog/` are stored locally and won't be affected by creating a new account. You can import them later.

---

## 🔗 Useful Links

- **Sanity Sign Up**: https://www.sanity.io
- **Sanity Manage Dashboard**: https://www.sanity.io/manage
- **Sanity Documentation**: https://www.sanity.io/docs

---

**Ready to start?** Follow the steps above and you'll be up and running in minutes!













