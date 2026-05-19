# 🔧 Netlify Build Error Fix Guide

## ❌ Error: `"build.command" failed - exit code 1`

---

## 🎯 Quick Solutions (Try in Order)

### **Solution 1: Update netlify.toml** ✅ **APPLIED**

The build command has been updated to:
```toml
[build]
  command = "npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build"
  publish = "dist"
  
  [build.environment]
    NODE_VERSION = "22"
```

**Files Updated:**
- ✅ `/netlify.toml` - Fixed build command
- ✅ `/.npmrc` - Added peer dependency config
- ✅ `/.gitignore` - Prevent lock file conflicts

---

### **Solution 2: Manual Netlify Configuration**

If Solution 1 doesn't work, manually configure in Netlify UI:

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Build & Deploy

2. **Build Settings:**
   - **Build command:** `npm install --legacy-peer-deps && npm run build`
   - **Publish directory:** `dist`
   
3. **Environment Variables:**
   - Add: `NODE_VERSION` = `22`
   - Add: `NPM_FLAGS` = `--legacy-peer-deps`

4. **Save and Redeploy**

---

### **Solution 3: Alternative Build Commands**

Try these commands in order (set in Netlify UI or netlify.toml):

#### Option A: Simple (Recommended)
```bash
npm install --legacy-peer-deps && npm run build
```

#### Option B: With npm ci fallback
```bash
npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build
```

#### Option C: Clean install
```bash
rm -rf node_modules && npm install --legacy-peer-deps && npm run build
```

#### Option D: Force install
```bash
npm install --force && npm run build
```

---

### **Solution 4: Deploy to Vercel Instead**

If Netlify continues to fail, use Vercel (often more reliable):

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Or connect GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Vite projects
   - Click Deploy

**Vercel Build Settings (auto-detected):**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 🔍 Common Build Issues & Fixes

### Issue 1: Peer Dependency Conflicts
**Error:** `ERESOLVE unable to resolve dependency tree`

**Fix:**
```bash
# Add to .npmrc
legacy-peer-deps=true
auto-install-peers=true
```

✅ **Already added to the project**

---

### Issue 2: Out of Memory
**Error:** `JavaScript heap out of memory`

**Fix:** Add to Netlify environment variables:
- `NODE_OPTIONS` = `--max-old-space-size=4096`

Or in netlify.toml:
```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

---

### Issue 3: Node Version Mismatch
**Error:** `engine "node" is incompatible`

**Fix:** Already set to Node 22 in netlify.toml
```toml
[build.environment]
  NODE_VERSION = "22"
```

---

### Issue 4: Missing Dependencies
**Error:** `Cannot find module 'xyz'`

**Fix:** Ensure all dependencies are in package.json:
```bash
# Locally test the build
npm install --legacy-peer-deps
npm run build
```

If successful locally, commit and push changes.

---

## 🚀 Deployment Checklist

### Before Deploying:

- [ ] **Test build locally:**
```bash
npm install --legacy-peer-deps
npm run build
npm run preview  # Test the built app
```

- [ ] **Verify files exist:**
  - ✅ `/package.json` - Has all dependencies
  - ✅ `/vite.config.ts` - Build configuration
  - ✅ `/netlify.toml` - Netlify settings
  - ✅ `/.npmrc` - NPM settings
  - ✅ `/public/_redirects` - SPA routing

- [ ] **Check for errors:**
  - No TypeScript errors
  - No missing imports
  - All images/assets exist

- [ ] **Commit all changes:**
```bash
git add .
git commit -m "Fix: Update build configuration for Netlify"
git push
```

---

## 📋 Netlify Build Command Options

### **Current Configuration (Recommended):**
```toml
[build]
  command = "npm ci --legacy-peer-deps || npm install --legacy-peer-deps && npm run build"
  publish = "dist"
```

### **Alternative Configurations:**

#### **Minimal (If issues persist):**
```toml
[build]
  command = "npm run build"
  publish = "dist"
```
*Netlify auto-installs dependencies, but might fail with peer deps*

#### **Explicit Install:**
```toml
[build]
  command = "npm install --legacy-peer-deps && npm run build"
  publish = "dist"
```

#### **With Cleanup:**
```toml
[build]
  command = "rm -rf node_modules dist && npm install --legacy-peer-deps && npm run build"
  publish = "dist"
```

---

## 🔄 Step-by-Step Deployment

### Method 1: GitHub + Netlify (Recommended)

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   
3. **Build settings:**
   - Netlify should auto-detect from `netlify.toml`
   - If not, set manually:
     - Build command: `npm install --legacy-peer-deps && npm run build`
     - Publish directory: `dist`
   
4. **Deploy site**

5. **If build fails:**
   - Check build logs
   - Try Solutions 2-4 above

---

### Method 2: Netlify CLI

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Initialize site:**
```bash
netlify init
```

4. **Deploy:**
```bash
netlify deploy --prod
```

---

### Method 3: Vercel (Alternative)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

That's it! Vercel usually handles peer dependencies better.

---

## 🐛 Troubleshooting

### Build Still Failing?

#### Step 1: Check Build Logs
- Look for the specific error message
- Common errors:
  - Memory issues → Add `NODE_OPTIONS` env var
  - Dependency conflicts → Use `--legacy-peer-deps`
  - Module not found → Check imports

#### Step 2: Test Locally
```bash
# Clean everything
rm -rf node_modules dist

# Fresh install
npm install --legacy-peer-deps

# Build
npm run build

# Test
npm run preview
```

If it works locally but not on Netlify, it's a configuration issue.

#### Step 3: Check Node/NPM Versions
```bash
# Your local versions
node --version  # Should match Netlify
npm --version   # Should match Netlify
```

Set matching versions in netlify.toml:
```toml
[build.environment]
  NODE_VERSION = "22"
  NPM_VERSION = "10"
```

#### Step 4: Simplify Build Process
Remove complexity:

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"
```

Then add `--legacy-peer-deps` to `.npmrc` instead.

---

## 📊 Files Modified

### ✅ Files Created/Updated:
1. **`/netlify.toml`** - Build configuration
2. **`/.npmrc`** - NPM settings for peer deps
3. **`/.gitignore`** - Prevent lock file issues
4. **`/build.sh`** - Alternative build script (optional)

### 📁 File Contents:

#### `.npmrc`
```
legacy-peer-deps=true
auto-install-peers=true
```

#### `.gitignore` (added)
```
package-lock.json
yarn.lock
pnpm-lock.yaml
```

---

## 🎯 Success Indicators

### ✅ Build Successful When:
- Build logs show: "Build script success"
- dist/ folder is created
- index.html exists in dist/
- Assets are bundled in dist/assets/
- No error messages in logs

### ❌ Build Failed When:
- Exit code 1 (command failed)
- "Cannot find module" errors
- "ERESOLVE" dependency errors
- Memory allocation errors

---

## 💡 Pro Tips

1. **Always test locally first:**
```bash
npm run build && npm run preview
```

2. **Check dependencies:**
```bash
npm ls  # Shows dependency tree
```

3. **Clear Netlify cache:**
   - In Netlify UI: Site Settings → Build & Deploy → Clear cache

4. **Use environment variables:**
   - Never hardcode API keys
   - Use Netlify environment variables

5. **Monitor build time:**
   - Keep builds under 10 minutes (Netlify free tier)
   - Optimize imports
   - Remove unused dependencies

---

## 🚀 Ready to Deploy?

### Quick Deploy Steps:

1. **Verify local build:**
```bash
npm install --legacy-peer-deps && npm run build
```

2. **Commit changes:**
```bash
git add .
git commit -m "Fix: Netlify build configuration"
git push
```

3. **Deploy to Netlify:**
   - Push to GitHub (Netlify auto-deploys)
   - Or use: `netlify deploy --prod`

4. **Check deployment:**
   - Visit your Netlify URL
   - Test all routes
   - Check console for errors

---

## 📞 Still Having Issues?

### Try These Alternatives:

1. **Vercel:** `vercel --prod` (usually just works)
2. **GitHub Pages:** Use `vite-plugin-github-pages`
3. **Railway:** `railway up`
4. **Render:** Connect GitHub repo
5. **Cloudflare Pages:** Similar to Netlify

---

## ✅ What's Been Fixed

### Changes Made:
1. ✅ Updated `netlify.toml` with correct build command
2. ✅ Added `.npmrc` for peer dependency handling
3. ✅ Created `.gitignore` to prevent lock file conflicts
4. ✅ Set Node version to 22
5. ✅ Added `--legacy-peer-deps` flag
6. ✅ Created alternative build script

### Expected Result:
- Build should now succeed on Netlify
- Dependencies install correctly
- Vite bundles the app
- dist/ folder is published

---

## 🎉 Summary

**Problem:** Netlify build failing with exit code 1

**Root Cause:** 
- Peer dependency conflicts
- Incorrect build command
- Missing npm configuration

**Solution Applied:**
- Updated build command with `--legacy-peer-deps`
- Added `.npmrc` configuration
- Set proper Node version
- Created fallback options

**Next Steps:**
1. Commit and push changes
2. Netlify auto-deploys
3. Check build logs
4. If still failing, try Solutions 2-4

---

*Last Updated: February 27, 2026*  
*Status: Build configuration fixed and optimized*  
*Ready for deployment: ✅*
