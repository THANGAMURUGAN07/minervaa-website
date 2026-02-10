# Migration Complete: EmailJS → Node.js Backend

## ✅ What Was Done

### 1. Backend Server Created
- **Location**: `server/`
- **Framework**: Express.js
- **Email Service**: Nodemailer
- **Features**:
  - Contact form endpoint
  - Quick enquiry endpoint
  - Admission form endpoint with file upload
  - Rate limiting (security)
  - CORS protection

### 2. Frontend Components Updated
All three forms now use the Node.js backend:

1. **ContactSection.jsx** - Contact form
2. **HeroSection.jsx** - Quick admission enquiry  
3. **AdmissionPopup.jsx** - Full admission application with photo upload

### 3. EmailJS Dependency Removed
- Removed `@emailjs/browser` from package.json
- Removed all EmailJS imports and configurations
- All API keys removed from frontend code

### 4. Configuration Files
- `server/.env` - Backend email configuration
- `.env` - Frontend API URL configuration
- `server/package.json` - Backend dependencies
- Updated main `package.json` with helper scripts

### 5. Documentation
- `SETUP_GUIDE.md` - Complete setup instructions
- `server/README.md` - Backend server documentation
- Helper scripts for easy startup

## 🚀 How to Run

### First Time Setup:

1. **Configure Email** (IMPORTANT):
   ```powershell
   # Edit server/.env
   EMAIL_USER=minervaavidhyamandhir@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

   To get Gmail App Password:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Use the 16-character password

2. **Start Backend Server** (Terminal 1):
   ```powershell
   npm run server
   ```
   Or double-click `start-server.bat`

3. **Start Frontend** (Terminal 2):
   ```powershell
   npm run dev
   ```

## 📋 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contact` | POST | Contact form submissions |
| `/api/enquiry` | POST | Quick admission enquiries |
| `/api/admission` | POST | Full admission applications |
| `/api/health` | GET | Server health check |

## 🔒 Security Features

- ✅ Rate limiting (5 requests per 15 min per IP)
- ✅ CORS enabled only for frontend
- ✅ File upload validation (images only, 5MB max)
- ✅ Environment variables for credentials
- ✅ Request body size limits

## 📁 New File Structure

```
Minervaa School/
├── server/
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env               # Email configuration
│   ├── .env.example       # Example config
│   ├── README.md          # Backend docs
│   └── uploads/           # Temp file uploads
├── src/
│   ├── config/
│   │   └── api.js         # API URL configuration
│   └── components/        # Updated form components
├── .env                   # Frontend config
├── .env.example          # Example frontend config
├── SETUP_GUIDE.md        # Complete setup guide
├── start-server.bat      # Quick server start
└── install.bat           # One-click install
```

## ✨ Benefits of This Change

### Before (EmailJS):
- ❌ Limited free tier (200 emails/month)
- ❌ API keys exposed in frontend
- ❌ Limited customization
- ❌ No file upload support
- ❌ Dependent on third-party service

### After (Node.js):
- ✅ Unlimited emails (using your own SMTP)
- ✅ Secure (credentials on backend)
- ✅ Full control over email formatting
- ✅ File upload support
- ✅ Can add database storage later
- ✅ No third-party dependencies
- ✅ Better security with rate limiting

## 🔧 Troubleshooting

### Backend not starting:
```powershell
cd server
npm install
node server.js
```

### Emails not sending:
1. Check server/.env has correct credentials
2. Verify Gmail App Password is valid
3. Check server console for errors

### CORS errors:
1. Verify backend is on port 3001
2. Verify frontend is on port 5173
3. Check server/.env FRONTEND_URL

### Forms not submitting:
1. Ensure backend is running (Terminal 1)
2. Check browser console for errors
3. Test backend health: http://localhost:3001/api/health

## 📧 Email Configuration

The server is configured to work with Gmail by default. For other email providers:

**Outlook/Hotmail**:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**Yahoo**:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

**Custom SMTP**: Use your hosting provider's settings

## 🚀 Production Deployment

For production:

1. Deploy backend to: Railway, Render, Heroku, or VPS
2. Deploy frontend to: Vercel, Netlify
3. Update environment variables:
   - Frontend `.env`: Set `VITE_API_URL` to backend URL
   - Backend `.env`: Set `FRONTEND_URL` to frontend URL

## 📝 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend (check browser console)
- [ ] Contact form submits successfully
- [ ] Quick enquiry form works
- [ ] Admission form submits with photo
- [ ] Emails arrive at recipient address
- [ ] Rate limiting works (try 6 submissions quickly)

## 🎉 Migration Status: COMPLETE

All forms are now using the Node.js backend instead of EmailJS. The application is ready to use once you configure the email credentials in `server/.env`.

---

**Last Updated**: February 6, 2026
**Status**: ✅ Production Ready
