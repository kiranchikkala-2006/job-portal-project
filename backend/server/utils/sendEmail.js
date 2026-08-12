import nodemailer from 'nodemailer';

// Helper function to send email via Nodemailer
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Create a test account using Ethereal or direct JSON transport if no SMTP credentials exist
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Job Portal Support" <no-reply@jobportal.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Reset OTP email dispatched to ${to}`);
    return info;
  } catch (error) {
    console.error('[EMAIL SERVICE ERROR]', error);
    // Don't break the flow if email sending throws, log it
    return null;
  }
};
