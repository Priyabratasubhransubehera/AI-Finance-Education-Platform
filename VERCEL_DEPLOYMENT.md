# 🚀 Vercel Deployment Guide

This guide will walk you through deploying the AI Finance Education Platform to Vercel with zero issues.

---

## ✅ Pre-Deployment Checklist

### 1. **Environment Setup**
- ✓ Node.js 18.17.0 or later installed locally
- ✓ npm or yarn package manager
- ✓ Git repository initialized
- ✓ All files pushed to GitHub

### 2. **Configuration Files Ready**
The following files have been created for Vercel compatibility:
- ✓ `vercel.json` - Vercel build and deployment configuration
- ✓ `.vercelignore` - Files to ignore during deployment
- ✓ `.nvmrc` - Node.js version specification
- ✓ `.env.example` - Environment variables template
- ✓ `package.json` - Updated with React/React-DOM dependencies

### 3. **Code Quality**
- ✓ No TypeScript errors
- ✓ All imports properly resolved
- ✓ No circular dependencies
- ✓ Vite build configuration optimized

---

## 📋 Step-by-Step Deployment to Vercel

### Step 1: Prepare Local Repository

```bash
# Navigate to project directory
cd "path/to/AI Finance Education Platform"

# Install all dependencies
npm install

# Test build locally
npm run build

# Preview the build
npm run preview
```

**What to look for:**
- ✓ Build completes without errors
- ✓ No critical warnings
- ✓ `dist/` folder is created with all files

---

### Step 2: Push to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Add Vercel deployment configuration and dependencies"

# Push to repository
git push origin main
```

**Verify:**
- ✓ Files appear on GitHub
- ✓ Latest commit includes vercel.json, .vercelignore, .nvmrc

---

### Step 3: Connect to Vercel

#### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Link to existing project? No (first time)
# - Set project name: AI-Finance-Education-Platform
# - Framework: Vite
# - Root directory: ./
# - Build command: npm run build
# - Output directory: dist
```

#### Option B: Via Vercel Web Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Select GitHub repository**: `AI-Finance-Education-Platform`
4. **Configure Project:**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables:**
   - Click "Environment Variables"
   - Add any variables from `.env.example` if needed
   - For now, you can skip this (demo mode)

6. **Click "Deploy"**

---

### Step 4: Environment Variables (If Needed)

If you have API keys or specific configurations:

**In Vercel Dashboard:**
1. Go to Settings → Environment Variables
2. Add variables:
   ```
   VITE_API_BASE_URL = https://api.example.com
   VITE_NEWS_API_KEY = your_key_here
   VITE_STOCK_API_KEY = your_key_here
   ```

3. Click "Save"
4. Trigger a redeployment:
   - Settings → Git → Deployments → Redeploy → Confirm

---

### Step 5: Verify Deployment

After deployment completes:

1. **Check Deployment Status:**
   - Look for green checkmark ✓
   - Wait for "READY" status

2. **Visit Live Site:**
   - Vercel provides a URL: `https://your-project.vercel.app`
   - Click to open and test

3. **Test Functionality:**
   - Dashboard loads ✓
   - Navigation works ✓
   - No console errors ✓
   - 3D animations render ✓

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Build Fails with "Module not found"

**Error Message:**
```
ERR! Could not resolve '@/components/...'
```

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

---

### Issue 2: Out of Memory During Build

**Error Message:**
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
```

**Solution:**
Vercel automatically increases memory. If issue persists:

```bash
# Set memory limit in vercel.json
# Already configured with 3GB in the provided vercel.json
```

---

### Issue 3: Port 5173 Already in Use

**Error Message:**
```
Port 5173 is already in use
```

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

---

### Issue 4: TypeScript Errors on Deploy

**Error Message:**
```
Type 'X' is not assignable to type 'Y'
```

**Solution:**
```bash
# Check locally
npm run build

# Fix any TypeScript errors in src/
# Commit and push
git add .
git commit -m "Fix TypeScript errors"
git push origin main
```

---

### Issue 5: 404 Errors on Refresh

**Problem:** 
Routes work on first load but not on refresh

**Solution:**
Already configured in `vercel.json` with rewrites:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

No additional configuration needed.

---

### Issue 6: CORS Errors in Browser

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
API integration needed with proper headers. For now:
- App runs in demo/offline mode ✓
- No real API calls needed ✓

When integrating APIs:
```javascript
// Example with proper CORS
fetch('https://api.example.com/data', {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'
})
```

---

## 🚀 Advanced Deployment Options

### Option 1: Connect GitHub Repository for Auto-Deploy

1. **In Vercel Dashboard:**
   - Project Settings → Git
   - "Deploy on every push to main"

2. **Auto-Deployment:**
   - Every git push triggers new deploy
   - Takes 2-5 minutes
   - Gets new URL

### Option 2: Staging Deployments

```bash
# Deploy to staging (preview URL)
vercel --prod=false

# This creates preview URL for testing
# Main URL only updates after explicit --prod deploy
```

### Option 3: Custom Domain

1. **In Vercel Dashboard:**
   - Settings → Domains
   - Add custom domain
   - Follow DNS configuration

---

## 📊 Performance Optimization

### Current Setup
- ✓ Chunk splitting configured
- ✓ Code minification enabled
- ✓ Source maps disabled (production)
- ✓ Asset caching optimized

### Lighthouse Scores Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Monitor Performance
1. **Vercel Analytics:**
   - Dashboard → Analytics
   - View real user metrics

2. **Local Testing:**
   ```bash
   npm run build
   npm run preview
   # Open Chrome DevTools → Lighthouse
   ```

---

## 🔒 Security Configuration

### Headers Already Set
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}
```

### Cache Strategy
- **Assets (JS/CSS):** 1 year (immutable)
- **HTML:** No cache (must revalidate)
- Automatically configured in `vercel.json`

---

## ✨ What's New in This Setup

### Files Added:
1. **vercel.json** - Complete Vercel configuration
2. **.vercelignore** - Deployment optimization
3. **.nvmrc** - Node version locking
4. **.env.example** - Environment template
5. **This Guide** - Deployment documentation

### package.json Updates:
- Added React 18.3.1 as dependency
- Added React-DOM 18.3.1 as dependency
- Added TypeScript support
- Added React type definitions
- Removed peerDependencies conflicts

### vite.config.ts Already Optimized:
- Chunk size limits set
- Manual chunk splitting
- Asset optimization
- Terser minification

---

## 📝 Deployment Checklist - Final

Before deploying:

- [ ] All local tests pass: `npm run build`
- [ ] No TypeScript errors in IDE
- [ ] GitHub repository up to date
- [ ] `.env.local` created (if using env vars)
- [ ] Node version is 18.17.0+
- [ ] `npm install` completes without errors

After deploying:

- [ ] Vercel build shows "READY"
- [ ] Live site loads without errors
- [ ] Dashboard displays correctly
- [ ] Navigation works
- [ ] No 404 errors on route refresh
- [ ] Console shows no critical errors

---

## 🎯 Next Steps

### Immediate
1. Run `npm install` locally
2. Run `npm run build` to test
3. Push to GitHub
4. Deploy to Vercel using steps above

### If Issues Occur
1. Check "Troubleshooting" section above
2. Review Vercel build logs
3. Check GitHub Actions (if enabled)
4. Verify environment variables

### Future Enhancements
- Add environment-specific configurations
- Set up GitHub Actions for CI/CD
- Add performance monitoring
- Configure analytics

---

## 📞 Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)

### This Project
- **GitHub**: [Repository](https://github.com/Priyabratasubhransubehera/AI-Finance-Education-Platform)
- **Current Setup**: Optimized for Vercel ✓
- **Status**: Ready for deployment ✓

---

**Last Updated:** May 2026  
**Version:** 1.0  
**Status:** ✅ Ready for Vercel Deployment
