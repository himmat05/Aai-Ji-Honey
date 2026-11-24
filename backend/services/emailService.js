const dns = require('dns');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Force IPv4 DNS order in Node.js 18+ to avoid IPv6 connection timeouts on cloud hosts (Render, AWS, GCP)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * Clean & sanitize email credentials
 */
const getCleanCredentials = () => {
  const user = process.env.EMAIL_FROM ? String(process.env.EMAIL_FROM).trim() : '';
  const pass = process.env.EMAIL_PASS
    ? String(process.env.EMAIL_PASS).trim().replace(/["'\s]/g, '')
    : '';
  return { user, pass };
};

/**
 * Configure Nodemailer transporter with IPv4 preference, SSL port 465, and explicit timeouts
 */
const getTransporter = () => {
  const { user, pass } = getCleanCredentials();

  if (!user || !pass) {
    console.warn('⚠️ EMAIL WARNING: EMAIL_FROM or EMAIL_PASS is not configured in environment variables.');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL on port 465 for Gmail
    family: 4, // Explicitly force IPv4 to prevent cloud IPv6 connection drops
    auth: {
      user,
      pass,
    },
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false, // Prevents certificate chain rejections in Linux cloud containers
    },
  });
};

/**
 * Test SMTP connection diagnostics
 */
const verifySmtpConnection = async () => {
  const { user, pass } = getCleanCredentials();
  if (!user || !pass) {
    return {
      connected: false,
      error: 'EMAIL_FROM or EMAIL_PASS environment variable is missing on this server.',
    };
  }
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { connected: true, user };
  } catch (err) {
    return {
      connected: false,
      error: err.message || 'SMTP connection verification failed',
      code: err.code || 'SMTP_ERROR',
    };
  }
};

/**
 * Send alert email to owner on dashboard login
 * @param {string} toEmail - Recipient email
 * @param {string} ip - Client IP address
 */
const sendLoginEmail = async (toEmail, ip) => {
  try {
    let locationInfo = 'Unknown location';
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 4000 });
      const data = response.data;
      if (data && data.status === 'success') {
        locationInfo = `${data.city}, ${data.regionName}, ${data.country}`;
      }
    } catch (locationError) {
      console.error('🌐 IP location lookup failed:', locationError.message);
    }

    const transporter = getTransporter();

    const mailOptions = {
      from: `Aai Ji Honey Security <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: '🔐 Login Alert - Owner Dashboard Access',
      text: `Hello,

Your owner dashboard was just accessed on ${new Date().toLocaleString()}.

Login Location: ${locationInfo}
IP Address: ${ip}

If this wasn't you, please secure your account immediately.

- Aai Ji Honey Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Login alert email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error('❌ Failed to send login email:', error.message);
  }
};

/**
 * Send official response email to customer inquiry
 * @param {Object} params - { toEmail, customerName, subject, originalMessage, replyMessage }
 */
const sendMessageReplyEmail = async ({
  toEmail,
  customerName,
  subject,
  originalMessage,
  replyMessage,
}) => {
  try {
    const transporter = getTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fffdf8; color: #451a03; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fde68a; box-shadow: 0 10px 25px rgba(217,119,6,0.1); }
          .header { background: linear-gradient(135deg, #d97706, #f59e0b); padding: 30px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
          .header p { margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
          .content { padding: 30px 25px; }
          .greeting { font-size: 16px; font-weight: 600; color: #78350f; margin-bottom: 15px; }
          .reply-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 18px 20px; border-radius: 0 12px 12px 0; margin: 20px 0; line-height: 1.6; font-size: 15px; color: #78350f; }
          .original-box { background-color: #f5f5f4; border-radius: 10px; padding: 14px 18px; margin-top: 25px; font-size: 13px; color: #78716c; line-height: 1.5; }
          .footer { background: #fafaf9; padding: 20px; text-align: center; font-size: 12px; color: #a8a29e; border-top: 1px solid #f5f5f4; }
          .portal-link { display: inline-block; background: #f59e0b; color: #ffffff !important; padding: 10px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 13px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍯 Aai Ji Honey</h1>
            <p>100% Pure, Raw & Natural Apiary Harvest</p>
          </div>
          <div class="content">
            <div class="greeting">Namaste ${customerName || 'Customer'},</div>
            <p style="line-height: 1.6; font-size: 14px; color: #57534e;">
              Thank you for contacting us. Dr. Sitaram Seervi and the Aai Ji Honey Apiary Team have reviewed your inquiry and replied to your message:
            </p>
            
            <div class="reply-box">
              <strong style="display: block; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #b45309;">
                Official Response:
              </strong>
              ${replyMessage.replace(/\n/g, '<br/>')}
            </div>

            <p style="font-size: 13px; color: #78716c;">
              You can also view this response anytime by logging into your account profile on our website.
            </p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://aai-ji-honey.onrender.com/profile" class="portal-link">View in Your Profile</a>
            </div>

            <div class="original-box">
              <strong style="color: #44403c;">Your Original Inquiry (${subject || 'General Inquiry'}):</strong><br/>
              "${originalMessage.replace(/\n/g, '<br/>')}"
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 5px 0;">Aai Ji Honey — Traditional Apiaries, Rajasthan, India</p>
            <p style="margin: 0;">Pure • Unpasteurized • Raw Wild Honey</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `Aai Ji Honey Apiary Team <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `🍯 Response to your inquiry: ${subject || 'Aai Ji Honey'}`,
      text: `Namaste ${customerName || 'Customer'},\n\n` +
        `Regarding your inquiry: "${originalMessage}"\n\n` +
        `Official Response:\n${replyMessage}\n\n` +
        `You can also view this response in your profile at: https://aai-ji-honey.onrender.com/profile\n\n` +
        `- Dr. Sitaram Seervi & Aai Ji Honey Team`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Customer reply email sent successfully to ${toEmail}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Failed to send reply email:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send acknowledgment email to job applicant
 * @param {Object} params - { toEmail, applicantName, jobTitle, trackingId }
 */
const sendCareerApplicationEmail = async ({ toEmail, applicantName, jobTitle, trackingId }) => {
  try {
    const transporter = getTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fefce8; margin: 0; padding: 20px; color: #1c1917; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #fde68a; box-shadow: 0 10px 25px rgba(217, 119, 6, 0.1); }
          .header { background: linear-gradient(135deg, #d97706, #b45309); padding: 30px 25px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 30px 25px; line-height: 1.6; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 50px; border: 1px solid #fcd34d; margin-bottom: 15px; }
          .tracking-box { background: #fffbeb; border: 1px dashed #f59e0b; border-radius: 12px; padding: 15px; margin: 20px 0; text-align: center; }
          .footer { background: #451a03; color: #fde68a; text-align: center; padding: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐝 Aai Ji Honey — Recruitment Team</h1>
          </div>
          <div class="content">
            <div class="badge">Application Received</div>
            <p>Dear <strong>${applicantName || 'Applicant'}</strong>,</p>
            <p>
              Thank you for applying to join the hive at <strong>Aai Ji Honey</strong> for the position of:
              <br/>
              <strong style="color: #b45309; font-size: 16px;">${jobTitle || 'Apiculture Team Member'}</strong>.
            </p>
            <div class="tracking-box">
              <span style="font-size: 12px; color: #78350f; text-transform: uppercase; font-weight: 700;">Application Tracking Reference</span>
              <div style="font-size: 18px; font-weight: 900; color: #b45309; letter-spacing: 1px; margin-top: 4px;">${trackingId}</div>
            </div>
            <p>
              Our HR Director, <strong>Dr. Neha Tomar</strong>, and the apiculture operations leadership team carefully review every resume. If your profile matches our seasonal requirements, our team will connect with you via mobile or email for an introductory discussion.
            </p>
            <p style="color: #78350f; font-size: 13px;">
              🌿 <em>"Working with bees is working with nature's purest vitality. We appreciate your interest in our sustainable apiculture mission."</em>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 5px 0;">Aai Ji Honey — Traditional Rajasthan Apiaries</p>
            <p style="margin: 0;">Mewar Apiary Division, Rajasthan, India • aaijihoney24@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `Aai Ji Honey Careers <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `🐝 Application Received: ${jobTitle} (${trackingId}) — Aai Ji Honey`,
      text: `Hello ${applicantName},\n\nThank you for applying to Aai Ji Honey for the position of "${jobTitle}".\n\nYour Application Tracking ID is: ${trackingId}\n\nOur HR and Apiculture leadership team will review your application and contact you if shortlisted.\n\nWarm regards,\nDr. Neha Tomar & Dr. Sitaram Seervi\nAai Ji Honey Team`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Career confirmation email sent successfully to ${toEmail}`);
    return true;
  } catch (err) {
    console.warn('⚠️ Could not send career acknowledgment email:', err.message);
    return false;
  }
};

module.exports = {
  getTransporter,
  verifySmtpConnection,
  sendLoginEmail,
  sendMessageReplyEmail,
  sendCareerApplicationEmail,
};
