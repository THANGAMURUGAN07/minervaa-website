# 🚀 Deployment Guide for Minervaa School Website

## 📋 Overview
Your website has two parts that need to be deployed separately:
1. **Frontend** (React app) - Already on Vercel ✅
2. **Backend** (Node.js server) - Needs deployment ⚠️

---

## 🔧 Backend Deployment - Option 1: Vercel (Recommended)

### Step 1: Prepare Backend
Your backend is already configured with `vercel.json` ✅

### Step 2: Deploy Backend to Vercel

#### Method A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
```bash
npm install -g vercel
```

2. **Navigate to server folder:**
```bash
cd server
```

3. **Login to Vercel:**
```bash
vercel login
```

4. **Deploy:**
```bash
vercel --prod
```

5. **Follow prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name: `minervaa-school-backend`
   - Directory: `./` (current directory)

6. **You'll get a URL like:** `https://minervaa-school-backend.vercel.app`

#### Method B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New" → "Project"**
3. Import from GitHub: `THANGAMURUGAN07/minervaa-school`
4. **Root Directory:** Change to `server`
5. Click **Deploy**

### Step 3: Add Environment Variables on Vercel

1. Go to your backend project on Vercel dashboard
2. Go to **Settings → Environment Variables**
3. Add these variables:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=thangamuruganr45@gmail.com
EMAIL_PASSWORD=ocdwoeinfdrdzatq
RECIPIENT_EMAIL=thangamuruganr45@gmail.com
FRONTEND_URL=https://minervaa-school-njp1.vercel.app
PORT=3001
```

4. Click **Save**
5. Redeploy your backend

### Step 4: Update Frontend Environment Variable

1. Go to your **frontend** project on Vercel
2. Go to **Settings → Environment Variables**
3. Update or add:

```
VITE_API_URL=https://minervaa-school-backend.vercel.app
```

4. **Redeploy frontend** from the Deployments tab

---

## 🔧 Backend Deployment - Option 2: Render (Alternative)

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `minervaa-school`
3. **Configure:**
   - Name: `minervaa-school-backend`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: **Free**

### Step 3: Add Environment Variables
In the Render dashboard, add:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=thangamuruganr45@gmail.com
EMAIL_PASSWORD=ocdwoeinfdrdzatq
RECIPIENT_EMAIL=thangamuruganr45@gmail.com
FRONTEND_URL=https://minervaa-school-njp1.vercel.app
```

### Step 4: Deploy
Click **"Create Web Service"** - Render will deploy your backend

### Step 5: Get Your Backend URL
You'll get: `https://minervaa-school-backend.onrender.com`

### Step 6: Update Frontend
Update `VITE_API_URL` in Vercel frontend settings to your Render URL

---

## 🔧 Backend Deployment - Option 3: Railway

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select `minervaa-school`
3. **Configure:**
   - Select `server` folder as root
   - Railway auto-detects Node.js

### Step 3: Add Environment Variables
Add all the same variables as above

### Step 4: Get URL
Railway provides: `https://your-app.up.railway.app`

---

## ⚙️ Update Local Development

After deployment, update your local `.env`:

```env
# For production
VITE_API_URL=https://minervaa-school-backend.vercel.app

# For local development, use:
# VITE_API_URL=http://localhost:3001
```

---

## 🧪 Testing After Deployment

### 1. Test Backend Directly
Visit: `https://your-backend-url.vercel.app/api/health`

Should return:
```json
{"status": "ok", "message": "Server is running"}
```

### 2. Test Contact Form
Go to your website and submit a contact form

### 3. Test Admission Form
Fill out and submit the admission form with a photo

---

## 🔍 Troubleshooting

### Error: "CORS policy error"
**Solution:** Update `FRONTEND_URL` in backend environment variables to match your Vercel frontend URL

### Error: "Failed to send email"
**Solution:** Verify all email environment variables are correctly set in your backend hosting

### Error: "Cannot connect to backend"
**Solution:** 
1. Check backend is deployed and running
2. Verify `VITE_API_URL` in frontend environment variables
3. Ensure backend URL doesn't have trailing slash

### Backend Logs
- **Vercel:** Dashboard → Project → Deployments → View Function Logs
- **Render:** Dashboard → Logs tab
- **Railway:** Dashboard → Project → Deployments → Logs

---

## 📊 Deployment Checklist

- [ ] Backend deployed to hosting service
- [ ] All environment variables added to backend
- [ ] Backend URL obtained
- [ ] Frontend `VITE_API_URL` updated with backend URL
- [ ] Frontend redeployed
- [ ] Health check endpoint tested
- [ ] Contact form tested
- [ ] Admission form tested
- [ ] Email delivery confirmed

---

## 🎉 Final Result

✅ **Frontend:** https://minervaa-school-njp1.vercel.app (deployed)  
✅ **Backend:** https://minervaa-school-backend.vercel.app (to deploy)  
✅ **Forms working:** Contact, Enquiry, Admission  
✅ **Emails sending:** To thangamuruganr45@gmail.com  
✅ **PDF attachments:** Generated and attached  

---

## 💡 Pro Tips

1. **Keep secrets safe:** Never commit `.env` files to Git
2. **Use different email for production:** Consider a dedicated school email
3. **Monitor usage:** Check Vercel/Render dashboard for usage limits
4. **Backups:** Keep local copies of important files
5. **Custom domain:** Connect your own domain in Vercel settings

---

## 🆘 Need Help?

Common issues and solutions are documented above. If you encounter other issues:
1. Check backend logs in hosting dashboard
2. Verify all environment variables are set
3. Test backend health endpoint
4. Check CORS configuration

Your website should be fully functional after completing these steps! 🚀
