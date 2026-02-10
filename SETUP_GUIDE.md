# Minervaa School Website - Setup Guide

This project now uses a Node.js backend server instead of EmailJS for handling all form submissions.

## Project Structure

```
Minervaa School/
├── src/                    # Frontend React application
├── server/                 # Backend Node.js server
├── public/                 # Static assets
├── .env                   # Frontend environment variables
└── package.json           # Frontend dependencies
```

## Quick Start

### 1. Install Frontend Dependencies

```powershell
npm install
```

### 2. Install Backend Dependencies

```powershell
npm run server:install
```

Or manually:
```powershell
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

#### Frontend (.env in root):
Already configured - no changes needed for local development.

#### Backend (server/.env):
1. Open `server/.env`
2. Update email credentials:
   ```env
   EMAIL_USER=minervaavidhyamandhir@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   ```

**Important**: You need to generate an App Password for Gmail:
- Enable 2-Step Verification in your Google Account
- Go to Security > App passwords
- Generate a new app password for "Mail"
- Use this 16-character password in the `.env` file

### 4. Run the Application

You need to run both frontend and backend:

#### Terminal 1 - Backend Server:
```powershell
npm run server
```
Server will start on http://localhost:3001

#### Terminal 2 - Frontend:
```powershell
npm run dev
```
Frontend will start on http://localhost:5173

## Changes Made

### Removed:
- ❌ EmailJS dependency
- ❌ EmailJS configuration in frontend components
- ❌ Direct email sending from browser

### Added:
- ✅ Node.js Express server (`server/server.js`)
- ✅ Nodemailer for email sending
- ✅ API endpoints for all forms
- ✅ File upload support for admission photos
- ✅ Rate limiting for security
- ✅ Environment configuration for both frontend and backend

## API Endpoints

The backend provides these endpoints:

- `POST /api/contact` - Contact form submissions
- `POST /api/enquiry` - Quick admission enquiry
- `POST /api/admission` - Full admission application with photo

## Forms Updated

All three forms have been migrated to use the Node.js backend:

1. **Contact Form** ([src/components/ContactSection.jsx](src/components/ContactSection.jsx))
2. **Quick Enquiry** ([src/components/HeroSection.jsx](src/components/HeroSection.jsx))
3. **Admission Application** ([src/components/AdmissionPopup.jsx](src/components/AdmissionPopup.jsx))

## Email Configuration Options

### Gmail (Recommended for school email):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Other Services:
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Use your hosting provider's SMTP settings

## Security Features

- ✅ Rate limiting (5 requests per 15 minutes per IP)
- ✅ CORS protection (only frontend can access API)
- ✅ File upload validation (images only, max 5MB)
- ✅ Environment variables for sensitive data

## Troubleshooting

### Forms not submitting:
1. Ensure backend server is running on port 3001
2. Check browser console for errors
3. Verify `.env` configuration in server folder

### Emails not sending:
1. Verify Gmail App Password is correct
2. Check server console for error messages
3. Ensure 2-Step Verification is enabled for Gmail account

### CORS errors:
1. Verify backend is running on http://localhost:3001
2. Check `FRONTEND_URL` in `server/.env`

## Production Deployment

For production:

1. **Frontend**: Deploy to Vercel, Netlify, or similar
2. **Backend**: Deploy to Railway, Render, Heroku, or VPS
3. Update environment variables:
   - Frontend: `VITE_API_URL` to your backend URL
   - Backend: `FRONTEND_URL` to your frontend URL

## Development Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run server` - Start backend server
- `npm run server:install` - Install backend dependencies

## Need Help?

Refer to detailed documentation:
- Frontend: Main README (this file)
- Backend: [server/README.md](server/README.md)

## Migration Notes

The EmailJS dependency has been completely removed. All form submissions now go through the Node.js backend, which:
- ✅ Provides better security
- ✅ Gives you full control over email formatting
- ✅ Supports file uploads
- ✅ Can be easily extended with database storage
- ✅ No third-party service dependencies
