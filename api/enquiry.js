import nodemailer from 'nodemailer';

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
    const { name, phone, admissionType, standard, dateOfBirth } = req.body;

    if (!name || !phone || !admissionType) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

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
    return res.json({ success: true, message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Enquiry form error:', error);
    return res.status(500).json({ error: 'Failed to send enquiry. Please try again.' });
  }
}
