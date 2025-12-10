# Vercel Deployment Guide

## Quick Start (GitHub Integration - Recommended)

### Step 1: Push to GitHub
1. Create a new repository on GitHub (if you haven't already)
2. Push your code:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### Step 3: Configure Environment Variables
Before deploying, add these in the Vercel project settings:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these three variables:
   - `VITE_DISCOGS_CONSUMER_KEY` = your Discogs consumer key
   - `VITE_DISCOGS_CONSUMER_SECRET` = your Discogs consumer secret
   - `VITE_APP_PASSWORD` = your password (required)

3. Make sure to set them for **Production**, **Preview**, and **Development** environments

### Step 4: Deploy
1. Click **"Deploy"** (or it will auto-deploy after setting env vars)
2. Wait for build to complete (~1-2 minutes)
3. Your app will be live at `your-project.vercel.app`

## GitHub Push Workflow

Once connected, **every push to your main branch automatically deploys to production**:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will:
- ✅ Automatically detect the push
- ✅ Build your app
- ✅ Deploy to production
- ✅ Give you a preview URL for each commit

### Preview Deployments
- Every commit gets its own preview URL
- Pull requests automatically get preview deployments
- You can test changes before merging to main

## Manual Deployment (CLI - Optional)

If you prefer CLI instead of GitHub integration:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (first time will ask questions)
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

**Important**: Set these in Vercel dashboard, NOT in your code!

1. Go to: Project → Settings → Environment Variables
2. Add:
   - `VITE_DISCOGS_CONSUMER_KEY`
   - `VITE_DISCOGS_CONSUMER_SECRET`
   - `VITE_APP_PASSWORD` (required)

**Never commit these to GitHub!** They're already in `.gitignore`

## Password Protection

- **Password**: Set `VITE_APP_PASSWORD` in Vercel environment variables (required)
- Session lasts 24 hours
- **Note**: This is client-side protection. The password will be visible in the built JavaScript bundle (VITE_ vars are exposed to frontend). For stronger security, consider Vercel Password Protection (Pro plan) or backend authentication.

## Troubleshooting

### Build fails?
- Check that all environment variables are set
- Make sure `package.json` has correct build script: `"build": "vite build"`

### App shows blank page?
- Check browser console for errors
- Verify environment variables are set correctly
- Make sure `vercel.json` is in your repo root

### Need to update password?
- Change `VITE_APP_PASSWORD` in Vercel dashboard
- Redeploy (or wait for next push)

## Cost

**FREE** ✅
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Custom domains (free)
- Preview deployments

## Future: Adding Database + OAuth

When ready for backend features:
- **Option 1**: Keep Vercel for frontend, add Railway/Supabase for DB (~$5-10/month)
- **Option 2**: Upgrade to Vercel Pro ($20/month) for more features
- **Option 3**: Use Vercel Serverless Functions for backend logic

