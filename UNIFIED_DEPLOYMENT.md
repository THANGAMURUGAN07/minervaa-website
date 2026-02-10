# 🚀 Single Domain Deployment - Complete Setup Guide

## ✅ What Changed?

Your project now runs **frontend and backend on the same URL**!

### Before:
- Frontend: `https://minervaa-school.vercel.app`
- Backend: `https://minervaa-school-backend.vercel.app` (separate)
- ❌ Two deployments, two URLs, CORS issues

### After:
- Everything: `https://minervaa-school.vercel.app`
- Frontend pages: `/`, `/about`, `/gallery`, etc.
- Backend API: `/api/contact`, `/api/enquiry`, `/api/admission`
- ✅ One deployment, one URL, one .env file!

---

## 📁 New Project Structure

```
d:\Minervaa School\
├── .env                          ← Single environment file!
├── vercel.json                   ← Vercel configuration
├── package.json                  ← Includes nodemailer
├── api/                          ← Backend API routes (serverless)
│   ├── contact.js               ← Contact form endpoint
│   ├── enquiry.js               ← Quick enquiry endpoint
│   └── admission.js             ← Admission form endpoint
├── src/                          ← Frontend React app
│   ├── components/
│   ├── pages/
│   └── ...
├── public/                       ← Static files
└── server/                       ← Old backend (keep for reference)
```

---

## 🔧 Local Development

### 1. Single Environment File

Edit `.env` in the root:
```env
# Leave empty for same-domain deployment
VITE_API_URL=

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=thangamuruganr45@gmail.com
EMAIL_PASSWORD=ocdwoeinfdrdzatq
RECIPIENT_EMAIL=thangamuruganr45@gmail.com
```

### 2. Run Development Server

```bash
# Just one command now!
npm run dev
```

**Note:** In local development, API routes won't work until deployed. To test locally with API routes, use:
```bash
npm run build
npm run preview
```

Or use the old server for local testing:
```bash
cd server
node server.js
```

---

## 🚀 Deployment to Vercel

### Method 1: Automatic via GitHub (Easiest)

1. **Commit and push your changes:**
```bash
git add .
git commit -m "Unified frontend and backend deployment"
git push origin main
```

2. **Vercel auto-deploys** when you push to GitHub

3. **Add Environment Variables in Vercel:**
   - Go to https://vercel.com/dashboard
   - Select your project → Settings → Environment Variables
   - Add these (one by one):

| Variable Name | Value |
|--------------|-------|
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_SECURE` | `false` |
| `EMAIL_USER` | `thangamuruganr45@gmail.com` |
| `EMAIL_PASSWORD` | `ocdwoeinfdrdzatq` |
| `RECIPIENT_EMAIL` | `thangamuruganr45@gmail.com` |

4. **Redeploy:**
   - Go to Deployments tab
   - Click "..." → "Redeploy"

### Method 2: Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🧪 Testing After Deployment

### 1. Test API Endpoints Directly

**Health check (if you add one):**
```
https://your-site.vercel.app/api/contact
```

**Response should be server response or method not allowed for GET**

### 2. Test Forms on Your Website

1. Go to your deployed website
2. Try the contact form
3. Check your email: `thangamuruganr45@gmail.com`
4. Should receive the form submission

### 3. Test Admission Form

1. Fill out admission form
2. Upload a photo
3. Submit
4. Check email for formatted admission application

---

## 📝 How API Routes Work

### Frontend Makes Request:
```javascript
// src/components/ContactSection.jsx
fetch('/api/contact', {  // ← Note: relative path!
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message })
})
```

### Vercel Routes to Serverless Function:
```
Request: POST /api/contact
   ↓
Vercel finds: api/contact.js
   ↓
Executes serverless function
   ↓
Sends email via nodemailer
   ↓
Returns response
```

---

## 🔐 Security Benefits

### Before (Separate Backend):
- ❌ CORS configuration needed
- ❌ Two deployments to manage
- ❌ Backend URL exposed
- ❌ More complex to secure

### After (Same Domain):
- ✅ No CORS issues (same origin)
- ✅ One deployment
- ✅ API hidden behind same domain
- ✅ Simpler security model

---

## 🌐 URLs After Deployment

| Type | URL | Purpose |
|------|-----|---------|
| Homepage | `https://your-site.vercel.app/` | Main website |
| About | `https://your-site.vercel.app/about` | About page |
| Contact API | `https://your-site.vercel.app/api/contact` | Contact form |
| Enquiry API | `https://your-site.vercel.app/api/enquiry` | Quick enquiry |
| Admission API | `https://your-site.vercel.app/api/admission` | Admission form |

All on the **same domain**! 🎉

---

## 🛠️ Troubleshooting

### Form Submission Fails

**Check:**
1. Environment variables are set in Vercel dashboard
2. Email credentials are correct
3. Check Vercel function logs:
   - Dashboard → Project → Deployments → Click deployment → Functions

### "Failed to submit form"

**Solutions:**
1. Verify EMAIL_PASSWORD in Vercel settings
2. Check Gmail app password is valid
3. Look at Vercel function logs for errors

### Local Development API Not Working

**This is normal!** Vercel API routes only work when deployed or with `vercel dev`.

**Options:**
1. Use `vercel dev` for local testing with API routes
2. Or use the old server: `cd server && node server.js`
3. Or deploy to preview: `vercel` (without --prod)

---

## 📊 Comparison

| Feature | Old Setup | New Setup |
|---------|-----------|-----------|
| **Deployments** | 2 separate | 1 unified |
| **URLs** | 2 different | 1 same |
| **CORS** | Required | Not needed |
| **Env Files** | 2 files | 1 file |
| **Complexity** | High | Low |
| **Maintenance** | Harder | Easier |

---

## ✅ Deployment Checklist

- [ ] Committed all code changes
- [ ] Pushed to GitHub
- [ ] Added environment variables in Vercel
- [ ] Redeployed project
- [ ] Tested contact form
- [ ] Tested admission form
- [ ] Verified email delivery
- [ ] All forms working correctly

---

## 🎉 You're Done!

Your website now runs **everything on one domain**:
- ✅ Frontend and backend unified
- ✅ Single .env file
- ✅ Simpler deployment
- ✅ No CORS issues
- ✅ Easier to maintain

**Your site:** https://minervaa-school-xnx6.vercel.app (or your custom domain)

All forms will now work without any "localhost" errors! 🚀
