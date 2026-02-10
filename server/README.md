# Minervaa School - Backend Server Setup

This Node.js backend server handles all form submissions from the Minervaa School website using Nodemailer to send emails.

## Features

- **Contact Form API** - Handles contact form submissions
- **Quick Enquiry API** - Handles quick admission enquiry from hero section
- **Admission Form API** - Handles detailed admission applications with photo uploads
- **Email Notifications** - Sends formatted emails to school administration
- **Rate Limiting** - Prevents spam (5 requests per 15 minutes per IP)
- **File Upload Support** - Handles student photo uploads with size limits

## Prerequisites

- Node.js (v16 or higher)
- Gmail account with App Password enabled (or other SMTP service)

## Installation

1. Navigate to the server directory:
   ```powershell
   cd server
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your email credentials

## Email Configuration

### For Gmail:

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security > 2-Step Verification > App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password

4. Update `.env` file:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   RECIPIENT_EMAIL=minervaavidhyamandhir@gmail.com
   ```

### For Other Email Services:

Update these values in `.env`:
- **Outlook/Hotmail**: 
  - HOST: smtp-mail.outlook.com
  - PORT: 587
  
- **Yahoo**: 
  - HOST: smtp.mail.yahoo.com
  - PORT: 587

## Running the Server

### Development Mode (with auto-restart):
```powershell
npm run dev
```

### Production Mode:
```powershell
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### 1. Health Check
- **URL**: `GET /api/health`
- **Response**: `{ status: 'ok', message: 'Server is running' }`

### 2. Contact Form
- **URL**: `POST /api/contact`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-1234567890",
    "message": "I would like to know more about admission."
  }
  ```

### 3. Quick Enquiry
- **URL**: `POST /api/enquiry`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "phone": "+91-9876543210",
    "admissionType": "Primary",
    "standard": "Class 1",
    "dateOfBirth": "2018-05-15"
  }
  ```

### 4. Admission Application
- **URL**: `POST /api/admission`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with all admission fields + photo file

## Security Features

- CORS enabled for frontend origin only
- Rate limiting (5 requests per 15 minutes)
- File upload validation (images only, max 5MB)
- Request body size limits (10MB)

## Folder Structure

```
server/
├── package.json          # Server dependencies
├── server.js            # Main server file
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment file
├── .gitignore          # Git ignore rules
└── uploads/            # Temporary folder for file uploads
    └── .gitkeep
```

## Troubleshooting

### Email not sending:
1. Check if your email credentials are correct in `.env`
2. Ensure 2-Step Verification is enabled for Gmail
3. Verify App Password is correctly generated and copied
4. Check server console for error messages

### CORS errors:
1. Verify `FRONTEND_URL` in `.env` matches your frontend URL
2. Ensure frontend is running on the correct port

### Port already in use:
1. Change `PORT` in `.env` to a different port
2. Update `VITE_API_URL` in frontend `.env` accordingly

## Production Deployment

For production deployment:

1. Update `.env` with production values
2. Set `FRONTEND_URL` to your production domain
3. Consider using environment variables from your hosting provider
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name minervaa-server
   ```

## Support

For issues or questions, contact the development team.
