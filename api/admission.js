import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    if (!formData.childName || !formData.dateOfBirth || !formData.contactNumber) {
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

    // Photo handling - check if photo is provided as base64
    const hasPhoto = formData.photo && formData.photo.startsWith('data:image');
    let photoBuffer = null;
    let photoFilename = 'student-photo.jpg';
    
    if (hasPhoto) {
      // Extract base64 data and convert to buffer
      const base64Data = formData.photo.replace(/^data:image\/\w+;base64,/, '');
      photoBuffer = Buffer.from(base64Data, 'base64');
      
      // Determine file extension from data URL
      const matches = formData.photo.match(/^data:image\/(\w+);base64,/);
      if (matches && matches[1]) {
        photoFilename = `student-photo.${matches[1]}`;
      }
    }

    // Build HTML email content
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
        ${hasPhoto ? `<td style="width: 180px; text-align: right; vertical-align: top; padding-left: 20px;">
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

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Admission Application - ${formData.childName}`,
      html: emailHtml,
      attachments: []
    };

    // Add photo as inline attachment if available
    if (hasPhoto && photoBuffer) {
      mailOptions.attachments.push({
        filename: photoFilename,
        content: photoBuffer,
        cid: 'studentPhoto' // Referenced in HTML as src="cid:studentPhoto"
      });
    }

    // Generate PDF using PDFKit (serverless-compatible)
    const pdfBuffer = await generatePDF(formData, subjects, submissionDate, photoBuffer);
    
    // Add PDF as attachment
    mailOptions.attachments.push({
      filename: `Admission-Form-${formData.childName}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    });

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Admission application sent successfully' });
  } catch (error) {
    console.error('Admission form error:', error);
    return res.status(500).json({ error: 'Failed to send admission application. Please try again.' });
  }
}

// PDF Generation Function
async function generatePDF(formData, subjects, submissionDate, photoBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).fillColor('#2563eb').text('MINERVAA VIDHYA MANDHIR SCHOOL', { align: 'center' });
      doc.fontSize(16).fillColor('#7c3aed').text('Admission Enquiry Form', { align: 'center' });
      doc.fontSize(10).fillColor('#666').text('A21, A22 D Colony, Pollachi, Tamil Nadu', { align: 'center' });
      doc.text('📞 +91 98948 86733 / +91 99949 59484', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).fillColor('#000').text(`Form Submission Date: ${submissionDate}`, { align: 'center' });
      
      // Add photo if available
      if (photoBuffer) {
        doc.moveDown();
        try {
          doc.image(photoBuffer, doc.page.width - 200, 100, { width: 150, height: 150 });
        } catch (err) {
          console.log('Error adding photo to PDF:', err);
        }
      }

      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#2563eb');
      doc.moveDown();

      // Section 1: Child Information
      doc.fontSize(14).fillColor('#2563eb').text('SECTION 1: CHILD INFORMATION');
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      addField(doc, 'Name of the Child', formData.childName || 'N/A');
      addField(doc, 'Date of Birth', formData.dateOfBirth || 'N/A');
      addField(doc, 'Sex', formData.sex || 'N/A');
      addField(doc, 'Blood Group', formData.bloodGroup || 'N/A');
      addField(doc, 'Contact Type', formData.contactType || 'N/A');
      addField(doc, 'Contact Number', formData.contactNumber || 'N/A');
      
      doc.moveDown();

      // Section 2: Parents/Guardian Details
      doc.fontSize(14).fillColor('#2563eb').text('SECTION 2: DETAILS OF PARENTS/GUARDIAN');
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      
      addField(doc, 'Father Name', formData.fatherName || '-');
      addField(doc, 'Father Nationality', formData.fatherNationality || '-');
      addField(doc, 'Father Occupation', formData.fatherOccupation || '-');
      addField(doc, 'Father Office Address', formData.fatherOfficeAddress || '-');
      addField(doc, 'Father Distance from School', formData.fatherDistance || '-');
      addField(doc, 'Father Permanent Address', formData.fatherPermanentAddress || '-');
      addField(doc, 'Father Monthly Income', formData.fatherIncome || '-');
      
      doc.moveDown(0.5);
      addField(doc, 'Mother Name', formData.motherName || '-');
      addField(doc, 'Mother Nationality', formData.motherNationality || '-');
      addField(doc, 'Mother Occupation', formData.motherOccupation || '-');
      addField(doc, 'Mother Office Address', formData.motherOfficeAddress || '-');
      addField(doc, 'Mother Distance from School', formData.motherDistance || '-');
      addField(doc, 'Mother Permanent Address', formData.motherPermanentAddress || '-');
      addField(doc, 'Mother Monthly Income', formData.motherIncome || '-');
      
      doc.moveDown(0.5);
      addField(doc, 'Guardian Name', formData.guardianName || '-');
      addField(doc, 'Guardian Nationality', formData.guardianNationality || '-');
      addField(doc, 'Guardian Occupation', formData.guardianOccupation || '-');
      addField(doc, 'Guardian Office Address', formData.guardianOfficeAddress || '-');
      addField(doc, 'Guardian Distance from School', formData.guardianDistance || '-');
      addField(doc, 'Guardian Permanent Address', formData.guardianPermanentAddress || '-');
      addField(doc, 'Guardian Monthly Income', formData.guardianIncome || '-');
      
      doc.moveDown();

      // Section 3: Academic Information
      doc.fontSize(14).fillColor('#2563eb').text('SECTION 3: ACADEMIC INFORMATION');
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      addField(doc, 'Class to which Admission is Sought', formData.classAdmission || 'N/A');
      addField(doc, 'Subjects Proposed to Offer', subjects.length > 0 ? subjects.join(', ') : 'N/A');
      
      doc.moveDown();

      // Section 4: TC & Additional Information
      doc.fontSize(14).fillColor('#2563eb').text('SECTION 4: TRANSFER CERTIFICATE & ADDITIONAL INFORMATION');
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      addField(doc, 'Transfer Certificate Attached', formData.tcAttached || 'N/A');
      addField(doc, 'TC Number', formData.tcNumber || 'N/A');
      addField(doc, 'TC Date', formData.tcDate || 'N/A');
      addField(doc, 'Mother Tongue', formData.motherTongue || 'N/A');
      addField(doc, 'Home Town', formData.homeTown || 'N/A');
      addField(doc, 'How did you know about MVM', formData.howKnow || 'N/A');

      // Footer
      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#ddd');
      doc.moveDown();
      doc.fontSize(12).fillColor('#000').text('MINERVAA VIDHYA MANDHIR SCHOOL', { align: 'center' });
      doc.fontSize(9).fillColor('#666').text('This is an auto-generated admission enquiry form', { align: 'center' });
      doc.text('For any queries, please contact: +91 98948 86733 / +91 99949 59484', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to add fields to PDF
function addField(doc, label, value) {
  doc.fontSize(10).fillColor('#333').text(label + ':', { continued: true }).fillColor('#555').text(' ' + value);
  doc.moveDown(0.3);
}
