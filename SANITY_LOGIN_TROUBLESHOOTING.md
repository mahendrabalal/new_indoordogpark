# Sanity Login Troubleshooting Guide

## Common Login Issues & Solutions

### Issue 1: "No account found" or Can't Sign In

**Solution:**
1. **Create a Sanity Account** (if you don't have one):
   - Go to https://www.sanity.io
   - Click "Get started for free" or "Sign up"
   - Choose one of these sign-in methods:
     - **Email** (recommended for first-time users)
     - **Google** (if you have a Google account)
     - **GitHub** (if you have a GitHub account)

2. **Verify Your Email**:
   - Check your inbox for a verification email from Sanity
   - Click the verification link
   - If you don't see it, check spam/junk folder

### Issue 2: "Invalid credentials" or Password Issues

**Solution:**
1. **Reset Your Password**:
   - On the login page, click "Forgot password?"
   - Enter your email
   - Check your email for reset instructions

2. **Try Different Sign-In Method**:
   - If you signed up with email, try using Google or GitHub instead
   - Or vice versa

### Issue 3: SSO Login Issues

**If you see the SSO login page:**

1. **You need an Organization Slug**:
   - This is provided by your organization admin
   - Contact your team lead or Sanity organization owner
   - The slug is usually your company/team name (e.g., "acme-corp")

2. **If you don't have an organization**:
   - Click "Other ways of signing in" at the bottom
   - Use email, Google, or GitHub instead

### Issue 4: "Project not found" or Configuration Issues

**Check your environment variables:**

1. **Verify you have a Sanity project**:
   ```bash
   # Check if you have a project ID set
   echo $NEXT_PUBLIC_SANITY_PROJECT_ID
   ```

2. **If empty, create a new project**:
   - Log into https://www.sanity.io/manage
   - Click "Create project"
   - Name it (e.g., "California Dog Parks Blog")
   - Copy the Project ID

3. **Update your `.env.local` file**:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

### Issue 5: Browser/Cache Issues

**Solution:**
1. **Clear browser cache and cookies**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
   - Safari: Develop → Empty Caches

2. **Try incognito/private mode**:
   - This helps rule out extension conflicts

3. **Try a different browser**:
   - Sometimes browser-specific issues occur

### Issue 6: Two-Factor Authentication (2FA)

**If you have 2FA enabled:**
1. Make sure you have access to your authenticator app
2. Or use backup codes if available
3. If locked out, contact Sanity support

## Step-by-Step: First-Time Sanity Setup

### Step 1: Create Sanity Account

1. Go to https://www.sanity.io
2. Click **"Get started for free"**
3. Choose your sign-in method:
   - **Email**: Enter email, create password
   - **Google**: Sign in with Google account
   - **GitHub**: Sign in with GitHub account

### Step 2: Create Your First Project

1. After logging in, you'll see the dashboard
2. Click **"Create project"**
3. Fill in:
   - **Project name**: `California Dog Parks Blog` (or your choice)
   - **Use template**: Choose **"Clean project with no predefined schemas"**
4. Click **"Create project"**
5. **IMPORTANT**: Copy your **Project ID** (you'll need this)

### Step 3: Configure Your Local Project

1. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

2. **Restart your dev server**:
   ```bash
   npm run dev
   ```

### Step 4: Access Sanity Studio

**Option A: Deploy Studio (Recommended)**
```bash
npx sanity@latest deploy
```
- Choose a hostname when prompted
- Access at: `https://your-hostname.sanity.studio`

**Option B: Run Locally**
```bash
npx sanity@latest dev
```
- Access at: `http://localhost:3333`

## Quick Diagnostic Commands

Run these to check your setup:

```bash
# Check if Sanity CLI is installed
npx sanity@latest --version

# Check your project configuration
cd /Users/mahendrabalal/Desktop/new_indoordogpark
cat sanity.config.ts

# Verify environment variables (if accessible)
# Note: .env.local is gitignored, so check manually
```

## Still Having Issues?

### Contact Sanity Support

1. **Sanity Support**: https://www.sanity.io/contact
2. **Sanity Community**: https://slack.sanity.io/
3. **Documentation**: https://www.sanity.io/docs

### Check Sanity Status

- **Status Page**: https://status.sanity.io/
- Check if there are any ongoing outages

### Common Error Messages

| Error Message | Solution |
|--------------|----------|
| "Invalid email or password" | Reset password or try different sign-in method |
| "Organization not found" | Use "Other ways of signing in" instead of SSO |
| "Project not found" | Create a new project or check Project ID |
| "Access denied" | Contact project owner to add you as collaborator |
| "Session expired" | Clear cookies and log in again |

## Alternative: Use Sanity Studio Locally

If you can't access the web studio:

1. **Install Sanity CLI globally**:
   ```bash
   npm install -g @sanity/cli
   ```

2. **Login via CLI**:
   ```bash
   npx sanity@latest login
   ```

3. **Run Studio locally**:
   ```bash
   npx sanity@latest dev
   ```

4. Access at `http://localhost:3333`

---

**Last Updated**: January 2025
**For more help**: See `SANITY_SETUP.md` for complete setup guide



