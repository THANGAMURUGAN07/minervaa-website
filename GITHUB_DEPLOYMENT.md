# 🎓 Minervaa Vidhya Mandhir School - GitHub & Deployment Guide

## ⚠️ IMPORTANT - Before Pushing to GitHub

### 🔒 Security Checklist

**Your .env files contain sensitive credentials and are already excluded from git!**

✅ Files that are PROTECTED (won't be pushed):
- `.env` (root directory) - contains API URL and email config
- `server/.env` - contains email passwords
- `server/uploads/*` - uploaded photos (temporary)
- `node_modules/` - dependencies

⚠️ **NEVER commit these files to GitHub!** They contain:
- Email passwords
- API credentials
- Personal information

---

## 📦 GitHub Repository Setup

### Step 1: Initialize Git Repository

```powershell
# Navigate to project directory
cd "d:\Minervaa School"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Minervaa School Website with Admission Form"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New Repository"** (green button)
3. Repository name: `minervaa-school` (or your choice)
4. Description: "Minervaa Vidhya Mandhir School Website with Online Admission Form"
5. Choose **Public** or **Private**
6. ❌ **DO NOT** initialize with README (you already have one)
7. Click **"Create repository"**

### Step 3: Push to GitHub

```powershell
# Add GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/minervaa-school.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 Deployment Options

### ❌ GitHub Pages - NOT SUPPORTED

**Why?** GitHub Pages only hosts static files (HTML/CSS/JS). Your app has:
- Node.js backend server
- File uploads (multer)
- PDF generation (puppeteer)
- Email sending (nodemailer)

All these require a **server**, which GitHub Pages doesn't provide.

---

## ✅ Recommended Hosting Solutions

### Option 1: **Vercel** (Recommended - Already Configured!)

**Pros:**
- Free tier available
- Already has `vercel.json` config
- Automatic deployments from GitHub
- Built-in serverless functions support

**Setup:**

1. **Push to GitHub first** (see above)

2. **Go to [Vercel.com](https://vercel.com)**
   - Sign up with GitHub account
   - Click "Import Project"
   - Select your `minervaa-school` repository

3. **Configure Environment Variables** in Vercel Dashboard:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   RECIPIENT_EMAIL=recipient@gmail.com
   ```

4. **Deploy!**
   - Vercel will auto-detect Vite
   - Frontend: Deployed automatically
   - Backend: Use the `/api` folder structure

5. **Update API endpoint:**
   - In production, API calls go to same domain
   - Already configured in `api.js`

**Cost:** FREE for personal projects

---

### Option 2: **Netlify** + Backend Service

**For Frontend (Netlify):**
- Deploy frontend to Netlify (free)
- Similar to Vercel setup

**For Backend (Choose one):**

**A. Railway.app** (Recommended for backend)
   - Free $5 credit monthly
   - Perfect for Node.js servers
   - Easy deployment from GitHub

**B. Render.com**
   - Free tier available
   - Good for Node.js apps
   - Auto-deploys from GitHub

**C. Heroku**
   - Free tier (with limitations)
   - Established platform
   - Easy Node.js deployment

**Setup:**
1. Frontend → Netlify
2. Backend → Railway/Render/Heroku
3. Update `VITE_API_URL` in Netlify to point to your backend URL

---

### Option 3: **Single VPS/Cloud Server**

Deploy both frontend and backend on one server:
- **DigitalOcean Droplet** ($5/month)
- **AWS EC2** (Free tier available)
- **Google Cloud Compute Engine** (Free tier)
- **Linode** ($5/month)

**Setup:** More complex, requires server management knowledge

---

## 🔧 Configuration for Deployment

### Update API Endpoint

For production deployment on Vercel:

1. Keep `VITE_API_URL` empty in production `.env`:
   ```
   VITE_API_URL=
   ```

2. This makes API calls relative to same domain

### Email Configuration

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate **App Password**:
   - Google Account → Security
   - 2-Step Verification → App passwords
   - Create app password for "Mail"
3. Use this password in `EMAIL_PASSWORD`

---

## 📋 Deployment Checklist

Before deploying:

- [ ] All .env files are in .gitignore
- [ ] Code pushed to GitHub
- [ ] Environment variables configured in hosting platform
- [ ] Gmail app password generated
- [ ] Test email sending after deployment
- [ ] Verify photo upload works
- [ ] Check PDF generation works
- [ ] Test form submission end-to-end

---

## 🐛 Common Issues & Solutions

### Issue: Email not sending in production

**Solution:**
- Check environment variables are set correctly
- Use Gmail app password (not regular password)
- Enable "Less secure app access" if using regular password (not recommended)
- Check EMAIL_HOST and EMAIL_PORT are correct

### Issue: File uploads failing

**Solution:**
- Vercel: File uploads work in serverless functions (limited to 5MB)
- Railway/Render: Full file upload support
- Check file size limits

### Issue: PDF generation not working

**Solution:**
- Puppeteer needs Chrome binaries
- Vercel: Use `chrome-aws-lambda` package
- Railway/Render: Puppeteer works natively
- Check build logs for missing dependencies

### Issue: CORS errors

**Solution:**
- Update CORS origin in `server/server.js`
- Add your production domain:
  ```javascript
  origin: ['http://localhost:3000', 'https://your-domain.vercel.app']
  ```

---

## 📞 Support

For deployment help:
- Check [UNIFIED_DEPLOYMENT.md](UNIFIED_DEPLOYMENT.md)
- Read [ADMISSION_FORM_GUIDE.md](ADMISSION_FORM_GUIDE.md)
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app

---

## 🎯 Quick Start Commands

```powershell
# Development
npm start                    # Start both frontend & backend

# Build for production
npm run build               # Build frontend

# GitHub
git add .
git commit -m "Update"
git push

# Deploy on Vercel (after setup)
vercel                      # Deploy from CLI
```

---

**Status:** ✅ Ready for GitHub & Production Deployment!

Your project is properly configured with:
- ✅ .gitignore files protecting sensitive data
- ✅ Environment variable examples
- ✅ Vercel configuration
- ✅ Full-stack application ready
