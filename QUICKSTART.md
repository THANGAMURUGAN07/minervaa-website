# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### Step 1: Configure Email
Edit `server/.env`:
```env
EMAIL_USER=minervaavidhyamandhir@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

**Get Gmail App Password:**
1. Google Account → Security
2. Enable 2-Step Verification
3. App passwords → Generate for "Mail"
4. Copy 16-character password to `.env`

### Step 2: Install Dependencies (if not done)
```powershell
npm install
cd server
npm install
cd ..
```

Or double-click: `install.bat`

### Step 3: Run Application

**Option A - Separate Terminals:**
```powershell
# Terminal 1
npm run server

# Terminal 2  
npm run dev
```

**Option B - One Click:**
Double-click: `start-all.bat`

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## ✅ Test It Works

1. Open website in browser
2. Fill out contact form
3. Submit
4. Check email at: minervaavidhyamandhir@gmail.com

## 🆘 Quick Fixes

**Backend won't start:**
```powershell
cd server
npm install
node server.js
```

**Frontend won't start:**
```powershell
npm install
npm run dev
```

**No emails received:**
- Check `server/.env` email password
- Look at server console for errors
- Verify Gmail App Password is active

## 📚 Full Documentation

- `MIGRATION_SUMMARY.md` - What changed
- `SETUP_GUIDE.md` - Detailed setup
- `server/README.md` - Backend details

---
Made with ❤️ for Minervaa Vidhya Mandhir
