# Admission Form Setup Guide - With Photo Upload & PDF Generation

## Current Configuration

Your admission form now includes:
✅ Student photo upload (up to 5MB)
✅ Automatic PDF generation with photo
✅ Email delivery with photo inline and PDF attached

## Quick Start

### 1. Install Dependencies

```powershell
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

Your `.env` files are already configured:
- Frontend API URL: `http://localhost:3001`
- Email configured with Gmail SMTP
- Recipient email: `thangamuruganr45@gmail.com`

### 3. Start the Application

**Option A: Start All (Recommended)**
```powershell
.\start-all.bat
```

**Option B: Start Separately**

Terminal 1 - Backend Server:
```powershell
.\start-server.bat
```

Terminal 2 - Frontend:
```powershell
npm run dev
```

### 4. Test the Admission Form

1. Open browser to `http://localhost:5173`
2. Wait for the admission popup to appear (1 second delay)
3. Click "Enroll Now" button
4. Fill in the admission form:
   - Upload student photo (JPG/PNG, max 5MB)
   - Fill required fields (marked with *)
   - Submit the form

5. Check email at `thangamuruganr45@gmail.com` for:
   - Formatted HTML email with student photo
   - PDF attachment with complete form

## Features Restored

### Photo Upload
- Accepts: JPG, JPEG, PNG, GIF
- Max size: 5MB
- Shows preview before upload
- Uploaded file sent to server
- Photo appears inline in email
- Photo included in PDF

### PDF Generation
- Automatically created using Puppeteer
- Professional formatting matching email
- Student photo embedded
- All form sections included
- Attached to email

### Email Format
- HTML formatted with school letterhead
- Student photo displayed at top right
- All 4 sections organized:
  1. Child Information
  2. Parents/Guardian Details
  3. Academic Information
  4. Transfer Certificate & Additional Info
- PDF attached for printing/records

## File Structure

```
src/components/AdmissionPopup.jsx  → Frontend form with photo upload
server/server.js                   → Backend with multer & puppeteer
server/.env                        → Server configuration
.env                              → Frontend API URL
```

## Troubleshooting

### Photo Upload Issues
- Check file size < 5MB
- Verify file type is image (JPG/PNG)
- Check browser console for errors

### Email Not Sending
- Verify EMAIL_PASSWORD in server/.env
- Check Gmail "App Passwords" if 2FA enabled
- View server console for error messages

### PDF Not Generating
- Ensure puppeteer is installed: `cd server && npm install`
- Check server console for puppeteer errors
- Verify uploads/ directory exists

### Form Not Submitting
- Check both servers are running
- Verify API_URL in frontend .env
- Check browser Network tab for failed requests

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] Admission popup appears after 1 second
- [ ] Photo upload works and shows preview
- [ ] Form validation works (required fields)
- [ ] Form submits successfully
- [ ] Thank you message appears
- [ ] Email received with photo inline
- [ ] PDF attached to email
- [ ] Photo appears in PDF

## Technical Details

**Frontend:**
- Uses FormData for file upload
- Validates file size and type
- Shows image preview
- Sends multipart/form-data

**Backend:**
- Multer middleware for file handling
- Puppeteer for PDF generation
- Nodemailer for email with attachments
- Files cleaned up after sending

**Email:**
- Photo embedded using CID (Content-ID)
- HTML template with CSS styling
- PDF attached separately
- Auto-generated timestamp

## Support

If you encounter issues:
1. Check server console for error messages
2. Check browser console for frontend errors
3. Verify .env files have correct values
4. Ensure all dependencies installed
5. Test email credentials separately

---

**Status:** ✅ Ready to use with photo upload and PDF generation!
