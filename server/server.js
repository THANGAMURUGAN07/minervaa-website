import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import PDFDocument from 'pdfkit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Contact form endpoint
app.post('/api/contact', limiter, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #6b7280; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Quick enquiry form endpoint (from Hero section)
app.post('/api/enquiry', limiter, async (req, res) => {
  try {
    const { name, phone, admissionType, standard, dateOfBirth } = req.body;

    if (!name || !phone || !admissionType) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Admission Enquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Admission Enquiry</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Admission Type:</strong> ${admissionType}</p>
            <p><strong>Standard:</strong> ${standard || 'Not specified'}</p>
            <p><strong>Date of Birth:</strong> ${dateOfBirth || 'Not specified'}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #6b7280; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Enquiry form error:', error);
    res.status(500).json({ error: 'Failed to send enquiry. Please try again.' });
  }
});

// Admission form endpoint with photo upload
app.post('/api/admission', limiter, upload.single('photo'), async (req, res) => {
  try {
    console.log('Admission form received');
    const formData = req.body;
    const photoFile = req.file;
    console.log('Form data:', { childName: formData.childName, dateOfBirth: formData.dateOfBirth });

    if (!formData.childName || !formData.dateOfBirth || !formData.contactNumber) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Build subjects list
    const subjects = [];
    if (formData.english === 'true') subjects.push('English');
    if (formData.maths === 'true') subjects.push('Mathematics');
    if (formData.evs === 'true') subjects.push('EVS');
    if (formData.socialScience === 'true') subjects.push('Social Science');
    if (formData.secondLanguage) subjects.push(`Second Language: ${formData.secondLanguage}`);
    if (formData.thirdLanguage) subjects.push(`Third Language: ${formData.thirdLanguage}`);

    // Format submission date
    const submissionDate = new Date().toLocaleString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build HTML email content with professional template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
    .document { background-color: white; padding: 40px; border: 2px solid #333; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header-table { width: 100%; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .student-photo { width: 150px; height: 150px; object-fit: cover; border: 3px solid #2563eb; border-radius: 10px; }
    .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
    .header h2 { color: #7c3aed; margin: 5px 0; font-size: 20px; }
    .header p { color: #666; margin: 5px 0; font-size: 14px; }
    .section { margin: 25px 0; }
    .section-title { background-color: #2563eb; color: white; padding: 10px 15px; font-size: 16px; font-weight: bold; margin-bottom: 15px; }
    .field { margin: 10px 0; padding: 8px; background-color: #f8f9fa; border-left: 3px solid #2563eb; }
    .field-label { font-weight: bold; color: #333; display: inline-block; width: 200px; }
    .field-value { color: #555; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th { background-color: #7c3aed; color: white; padding: 10px; text-align: left; font-size: 12px; }
    td { padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-size: 12px; }
    .parent-row { background-color: #e0e7ff; font-weight: bold; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="document">
    <table class="header-table" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align: center; vertical-align: top;">
          <div class="header">
            <h1>MINERVAA VIDHYA MANDHIR SCHOOL</h1>
            <h2>Admission Enquiry Form</h2>
            <p>A21, A22 D Colony, Pollachi, Tamil Nadu</p>
            <p>📞 +91 98948 86733 / +91 99949 59484</p>
            <p style="margin-top: 10px; font-weight: bold;">Form Submission Date: ${submissionDate}</p>
          </div>
        </td>
        ${photoFile ? `<td style="width: 180px; text-align: right; vertical-align: top; padding-left: 20px;">
          <img src="cid:studentPhoto" alt="Student Photo" class="student-photo" />
        </td>` : ''}
      </tr>
    </table>

    <div class="section">
      <div class="section-title">SECTION 1: CHILD INFORMATION</div>
      <div class="field">
        <span class="field-label">Name of the Child:</span>
        <span class="field-value">${formData.childName || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Date of Birth:</span>
        <span class="field-value">${formData.dateOfBirth || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Sex:</span>
        <span class="field-value">${formData.sex || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Blood Group:</span>
        <span class="field-value">${formData.bloodGroup || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Contact Type:</span>
        <span class="field-value">${formData.contactType || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Contact Number:</span>
        <span class="field-value">${formData.contactNumber || 'N/A'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">SECTION 2: DETAILS OF PARENTS/GUARDIAN</div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Father</th>
            <th>Mother</th>
            <th>Guardian</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="parent-row">Name (Capital)</td>
            <td>${formData.fatherName || '-'}</td>
            <td>${formData.motherName || '-'}</td>
            <td>${formData.guardianName || '-'}</td>
          </tr>
          <tr>
            <td class="parent-row">Nationality</td>
            <td>${formData.fatherNationality || '-'}</td>
            <td>${formData.motherNationality || '-'}</td>
            <td>${formData.guardianNationality || '-'}</td>
          </tr>
          <tr>
            <td class="parent-row">Occupation</td>
            <td>${formData.fatherOccupation || '-'}</td>
            <td>${formData.motherOccupation || '-'}</td>
            <td>${formData.guardianOccupation || '-'}</td>
          </tr>
          <tr>
            <td class="parent-row">Office Address & Tel</td>
            <td>${formData.fatherOfficeAddress || '-'}</td>
            <td>${formData.motherOfficeAddress || '-'}</td>
            <td>${formData.guardianOfficeAddress || '-'}</td>
          </tr>
          <tr>
            <td class="parent-row">Distance from School</td>
            <td>${formData.fatherDistance || '-'}</td>
            <td>${formData.motherDistance || '-'}</td>
            <td>${formData.guardianDistance || '-'}</td>
          </tr>
          <tr>
            <td class="parent-row">Permanent Address</td>
            <td>${formData.fatherPermanentAddress || '-'}</td>
            <td>${formData.motherPermanentAddress || '-'}</td>
            <td>${formData.guardianPermanentAddress || '-'}</td>
          </tr>
          <tr>
            <td class="parent-row">Monthly Income</td>
            <td>${formData.fatherIncome || '-'}</td>
            <td>${formData.motherIncome || '-'}</td>
            <td>${formData.guardianIncome || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">SECTION 3: ACADEMIC INFORMATION</div>
      <div class="field">
        <span class="field-label">Class to which Admission is Sought:</span>
        <span class="field-value">${formData.classAdmission || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Subjects Proposed to Offer:</span>
        <span class="field-value">${subjects.length > 0 ? subjects.join(', ') : 'N/A'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">SECTION 4: TRANSFER CERTIFICATE & ADDITIONAL INFORMATION</div>
      <div class="field">
        <span class="field-label">Transfer Certificate Attached:</span>
        <span class="field-value">${formData.tcAttached || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">TC Number:</span>
        <span class="field-value">${formData.tcNumber || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">TC Date:</span>
        <span class="field-value">${formData.tcDate || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Mother Tongue:</span>
        <span class="field-value">${formData.motherTongue || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">Home Town:</span>
        <span class="field-value">${formData.homeTown || 'N/A'}</span>
      </div>
      <div class="field">
        <span class="field-label">How did you know about MVM:</span>
        <span class="field-value">${formData.howKnow || 'N/A'}</span>
      </div>
    </div>

    <div class="footer">
      <p><strong>Minervaa Vidhya Mandhir School</strong></p>
      <p>This is an auto-generated admission enquiry form</p>
      <p>For any queries, please contact: +91 98948 86733 / +91 99949 59484</p>
    </div>
  </div>
</body>
</html>
    `;

    // Generate PDF using PDFKit (serverless-compatible)
    let pdfBuffer = null;
    try {
      pdfBuffer = await generatePDFWithPDFKit(formData, subjects, submissionDate, photoFile);
      console.log('PDF generated successfully with PDFKit');
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError.message);
    }

    // Prepare email attachments
    const attachments = [];
    
    // Add PDF if generated
    if (pdfBuffer) {
      attachments.push({
        filename: `Admission-Form-${formData.childName}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }
    
    // Add photo if available
    if (photoFile) {
      attachments.push({
        filename: `${formData.childName}-photo${path.extname(photoFile.originalname)}`,
        path: photoFile.path,
        cid: 'studentPhoto'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Admission Application - ${formData.childName}`,
      html: emailHtml,
      attachments: attachments
    };

    console.log('Sending admission email...');
    await transporter.sendMail(mailOptions);
    console.log('Admission email sent successfully!');
    
    // Clean up uploaded photo after sending
    if (photoFile && fs.existsSync(photoFile.path)) {
      fs.unlinkSync(photoFile.path);
    }

    res.json({ success: true, message: 'Admission application sent successfully' });
  } catch (error) {
    console.error('Admission form error:', error);
    res.status(500).json({ error: 'Failed to send admission application. Please try again.' });
  }
});

// PDF Generation with PDFKit (serverless-compatible)
async function generatePDFWithPDFKit(formData, subjects, submissionDate, photoFile) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Document border
      doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).lineWidth(2).stroke('#333');

      // Header
      doc.fontSize(24).fillColor('#2563eb').font('Helvetica-Bold')
         .text('MINERVAA VIDHYA MANDHIR SCHOOL', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(18).fillColor('#7c3aed').font('Helvetica')
         .text('Admission Enquiry Form', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#666').font('Helvetica')
         .text('A21, A22 D Colony, Pollachi, Tamil Nadu', { align: 'center' });
      doc.fontSize(10).text('📞 +91 98948 86733 / +91 99949 59484', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#000').font('Helvetica-Bold')
         .text(`Form Submission Date: ${submissionDate}`, { align: 'center' });
      
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).lineWidth(3).stroke('#2563eb');
      doc.moveDown(1);

      // Photo Section (centered)
      if (photoFile && fs.existsSync(photoFile.path)) {
        try {
          const imageX = (doc.page.width - 150) / 2;
          const imageY = doc.y;
          doc.image(photoFile.path, imageX, imageY, { width: 150, height: 150, fit: [150, 150] });
          doc.rect(imageX - 3, imageY - 3, 156, 156).lineWidth(3).stroke('#2563eb');
          doc.y = imageY + 160;
          doc.moveDown(1.5);
        } catch (err) {
          console.log('Error adding photo to PDF:', err);
        }
      }

      // Section 1: Child Information
      doc.rect(50, doc.y, doc.page.width - 100, 15).fill('#2563eb');
      doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
         .text('SECTION 1: CHILD INFORMATION', 60, doc.y - 12);
      doc.fillColor('#000');
      doc.moveDown(1.2);
      
      addStyledField(doc, 'Name of the Child', formData.childName || 'N/A');
      addStyledField(doc, 'Date of Birth', formData.dateOfBirth || 'N/A');
      addStyledField(doc, 'Sex', formData.sex || 'N/A');
      addStyledField(doc, 'Blood Group', formData.bloodGroup || 'N/A');
      addStyledField(doc, 'Contact Type', formData.contactType || 'N/A');
      addStyledField(doc, 'Contact Number', formData.contactNumber || 'N/A');
      
      doc.moveDown(1.5);

      // Section 2: Parents/Guardian Details (TABLE FORMAT)
      // Check if we need a new page for the table
      if (doc.y > 650) {
        doc.addPage();
        // Re-add border on new page
        doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).lineWidth(2).stroke('#333');
      }
      
      doc.rect(50, doc.y, doc.page.width - 100, 15).fill('#2563eb');
      doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
         .text('SECTION 2: DETAILS OF PARENTS/GUARDIAN', 60, doc.y - 12);
      doc.fillColor('#000');
      doc.moveDown(1.5);

      // Table Header
      const tableTop = doc.y;
      const col1X = 60;
      const col2X = 180;
      const col3X = 300;
      const col4X = 420;
      const rowHeight = 25;
      
      // Header row
      doc.rect(col1X, tableTop, 120, rowHeight).fillAndStroke('#7c3aed', '#7c3aed');
      doc.rect(col2X, tableTop, 120, rowHeight).fillAndStroke('#7c3aed', '#7c3aed');
      doc.rect(col3X, tableTop, 120, rowHeight).fillAndStroke('#7c3aed', '#7c3aed');
      doc.rect(col4X, tableTop, 115, rowHeight).fillAndStroke('#7c3aed', '#7c3aed');
      
      doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold');
      doc.text('', col1X + 5, tableTop + 8);
      doc.text('Father', col2X + 35, tableTop + 8);
      doc.text('Mother', col3X + 35, tableTop + 8);
      doc.text('Guardian', col4X + 30, tableTop + 8);
      
      // Table rows
      const rows = [
        { label: 'Name (Capital)', father: formData.fatherName, mother: formData.motherName, guardian: formData.guardianName },
        { label: 'Nationality', father: formData.fatherNationality, mother: formData.motherNationality, guardian: formData.guardianNationality },
        { label: 'Occupation', father: formData.fatherOccupation, mother: formData.motherOccupation, guardian: formData.guardianOccupation },
        { label: 'Office Address & Tel', father: formData.fatherOfficeAddress, mother: formData.motherOfficeAddress, guardian: formData.guardianOfficeAddress },
        { label: 'Permanent Address', father: formData.fatherPermanentAddress, mother: formData.motherPermanentAddress, guardian: formData.guardianPermanentAddress },
        { label: 'Monthly Income', father: formData.fatherIncome, mother: formData.motherIncome, guardian: formData.guardianIncome }
      ];
      
      let currentY = tableTop + rowHeight;
      doc.fillColor('#000').font('Helvetica');
      
      rows.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
        
        // Row background
        doc.rect(col1X, currentY, 120, rowHeight).fillAndStroke(bgColor, '#ddd');
        doc.rect(col2X, currentY, 120, rowHeight).fillAndStroke(bgColor, '#ddd');
        doc.rect(col3X, currentY, 120, rowHeight).fillAndStroke(bgColor, '#ddd');
        doc.rect(col4X, currentY, 115, rowHeight).fillAndStroke(bgColor, '#ddd');
        
        // Label (bold)
        doc.fontSize(9).fillColor('#000').font('Helvetica-Bold');
        doc.text(row.label, col1X + 5, currentY + 8, { width: 110 });
        
        // Values
        doc.font('Helvetica').fillColor('#555');
        doc.text(row.father || '-', col2X + 5, currentY + 8, { width: 110 });
        doc.text(row.mother || '-', col3X + 5, currentY + 8, { width: 110 });
        doc.text(row.guardian || '-', col4X + 5, currentY + 8, { width: 105 });
        
        currentY += rowHeight;
      });
      
      doc.y = currentY + 15;

      // Section 3: Academic Information
      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
        // Re-add border on new page
        doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).lineWidth(2).stroke('#333');
      }
      
      doc.rect(50, doc.y, doc.page.width - 100, 15).fill('#2563eb');
      doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
         .text('SECTION 3: ACADEMIC INFORMATION', 60, doc.y - 12);
      doc.fillColor('#000');
      doc.moveDown(1.2);
      
      addStyledField(doc, 'Class to which Admission is Sought', formData.classAdmission || 'N/A');
      addStyledField(doc, 'Subjects Proposed to Offer', subjects.length > 0 ? subjects.join(', ') : 'N/A');
      
      doc.moveDown(1.5);

      // Section 4: Transfer Certificate & Additional Information
      // Check if we need a new page
      if (doc.y > 650) {
        doc.addPage();
        // Re-add border on new page
        doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).lineWidth(2).stroke('#333');
      }
      
      doc.rect(50, doc.y, doc.page.width - 100, 15).fill('#2563eb');
      doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
         .text('SECTION 4: TRANSFER CERTIFICATE & ADDITIONAL INFORMATION', 60, doc.y - 12);
      doc.fillColor('#000');
      doc.moveDown(1.2);
      
      addStyledField(doc, 'Transfer Certificate Attached', formData.tcAttached || 'N/A');
      addStyledField(doc, 'TC Number', formData.tcNumber || 'N/A');
      addStyledField(doc, 'TC Date', formData.tcDate || 'N/A');
      addStyledField(doc, 'Mother Tongue', formData.motherTongue || 'N/A');
      addStyledField(doc, 'Home Town', formData.homeTown || 'N/A');
      addStyledField(doc, 'How did you know about MVM', formData.howKnow || 'N/A');

      // Footer
      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).lineWidth(2).stroke('#ddd');
      doc.moveDown(1);
      doc.fontSize(12).fillColor('#000').font('Helvetica-Bold')
         .text('Minervaa Vidhya Mandhir School', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#666').font('Helvetica')
         .text('This is an auto-generated admission enquiry form', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).text('For any queries, please contact: +91 98948 86733 / +91 99949 59484', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to add styled field with gray background and blue border
function addStyledField(doc, label, value) {
  const currentY = doc.y;
  const fieldHeight = 20;
  const leftMargin = 60;
  const fieldWidth = doc.page.width - 120;
  
  // Gray background
  doc.rect(leftMargin, currentY, fieldWidth, fieldHeight).fillAndStroke('#f8f9fa', '#f8f9fa');
  
  // Blue left border
  doc.rect(leftMargin, currentY, 3, fieldHeight).fill('#2563eb');
  
  // Label (bold)
  doc.fontSize(10).fillColor('#333').font('Helvetica-Bold')
     .text(label + ':', leftMargin + 10, currentY + 6, { continued: true });
  
  // Value
  doc.fillColor('#555').font('Helvetica')
     .text(' ' + value, { width: fieldWidth - 220 });
  
  doc.moveDown(1.3);
}


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
