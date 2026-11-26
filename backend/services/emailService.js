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
 * Send email via Brevo REST API (HTTPS Port 443 - works on Render Free tier without SMTP blocks)
 */
const sendViaBrevo = async ({ to, subject, html, text, fromName = 'Aai Ji Honey' }) => {
  const apiKey = process.env.BREVO_API_KEY ? String(process.env.BREVO_API_KEY).trim() : '';
  if (!apiKey) return null;

  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || 'Sitaramseervi88@gmail.com';
  const toList = Array.isArray(to) ? to.map((e) => ({ email: e })) : [{ email: to }];

  const payload = {
    sender: { name: fromName, email: senderEmail },
    to: toList,
    subject,
    htmlContent: html,
    textContent: text || (html ? html.replace(/<[^>]*>?/gm, '') : ''),
  };

  const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    timeout: 10000,
  });

  return response.data;
};

/**
 * Send email via Resend REST API (HTTPS Port 443 - works on Render Free tier)
 */
const sendViaResend = async ({ to, subject, html, text, fromName = 'Aai Ji Honey' }) => {
  const apiKey = process.env.RESEND_API_KEY ? String(process.env.RESEND_API_KEY).trim() : '';
  if (!apiKey) return null;

  const fromEmail = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const toList = Array.isArray(to) ? to : [to];

  const payload = {
    from: fromEmail.includes('<') ? fromEmail : `${fromName} <${fromEmail}>`,
    to: toList,
    subject,
    html,
    text: text || (html ? html.replace(/<[^>]*>?/gm, '') : ''),
  };

  const response = await axios.post('https://api.resend.com/emails', payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  return response.data;
};

/**
 * Unified email sender:
 * 1. Brevo HTTP API (Port 443 HTTPS - 100% bypasses Render Free SMTP block)
 * 2. Resend HTTP API (Port 443 HTTPS)
 * 3. Nodemailer Gmail SMTP (Port 465 - Localhost or Render Paid)
 */
const sendEmailUnified = async ({ to, subject, html, text, fromName = 'Aai Ji Honey' }) => {
  // 1. Try Brevo HTTPS API if key configured
  if (process.env.BREVO_API_KEY) {
    const rawKey = String(process.env.BREVO_API_KEY).trim();
    if (rawKey.startsWith('xsmtpsib-')) {
      return {
        success: false,
        error:
          'Invalid Brevo Key type: You provided an SMTP key (xsmtpsib-...). Brevo HTTPS API requires an API Key (xkeysib-...). In Brevo, click your profile -> SMTP & API -> API Keys tab -> Generate a new API key.',
      };
    }

    try {
      await sendViaBrevo({ to, subject, html, text, fromName });
      console.log(`📧 Email delivered via Brevo HTTP API (Port 443) to ${to}`);
      return { success: true, provider: 'brevo' };
    } catch (brevoErr) {
      const errDetail = brevoErr.response?.data?.message || brevoErr.message;
      console.error('❌ Brevo API error:', brevoErr.response?.data || brevoErr.message);
      return { success: false, error: `Brevo API Error: ${errDetail}` };
    }
  }

  // 2. Try Resend HTTPS API if key configured
  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend({ to, subject, html, text, fromName });
      console.log(`📧 Email delivered via Resend HTTP API (Port 443) to ${to}`);
      return { success: true, provider: 'resend' };
    } catch (resendErr) {
      console.error('❌ Resend API error:', resendErr.response?.data || resendErr.message);
    }
  }

  // 3. Fallback to standard Nodemailer SMTP (Gmail port 465)
  const { user, pass } = getCleanCredentials();
  if (!user || !pass) {
    return {
      success: false,
      error: 'No email credentials configured. Set BREVO_API_KEY or EMAIL_FROM/EMAIL_PASS.',
    };
  }

  const transporter = getTransporter();
  const mailOptions = {
    from: `${fromName} <${user}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email delivered via Gmail SMTP to ${to}`);
    return { success: true, provider: 'smtp' };
  } catch (smtpErr) {
    console.error('❌ SMTP sendMail failed:', smtpErr.message);
    let friendlyError = smtpErr.message;
    if (smtpErr.code === 'ETIMEDOUT' || smtpErr.message.includes('timeout')) {
      friendlyError =
        'Connection timeout: Render Free Tier blocks outbound SMTP ports (465/587). Add BREVO_API_KEY to Render Environment Variables to send via HTTPS Port 443.';
    }
    return { success: false, error: friendlyError, code: smtpErr.code };
  }
};

/**
 * Test SMTP or HTTP email connection diagnostics
 */
const verifySmtpConnection = async () => {
  // If Brevo configured, test Brevo HTTP API
  if (process.env.BREVO_API_KEY) {
    const rawKey = String(process.env.BREVO_API_KEY).trim();
    if (rawKey.startsWith('xsmtpsib-')) {
      return {
        connected: false,
        provider: 'Brevo',
        error:
          'Invalid Key: You configured an SMTP key (xsmtpsib-...). Brevo HTTPS API requires an API Key (xkeysib-...). In Brevo, click profile -> SMTP & API -> API Keys tab -> Generate a new API key.',
      };
    }

    try {
      const res = await axios.get('https://api.brevo.com/v3/account', {
        headers: {
          accept: 'application/json',
          'api-key': rawKey,
        },
        timeout: 8000,
      });
      return {
        connected: true,
        provider: 'Brevo HTTP API (Port 443 HTTPS - Render Free Compatible)',
        configuredEmail: res.data?.email || process.env.EMAIL_FROM,
        host: 'api.brevo.com',
        port: 443,
      };
    } catch (bErr) {
      return {
        connected: false,
        provider: 'Brevo HTTP API',
        error: bErr.response?.data?.message || bErr.message || 'Brevo API key validation failed',
      };
    }
  }

  // Otherwise test standard Gmail SMTP
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
    return {
      connected: true,
      provider: 'Google SMTP (Port 465)',
      configuredEmail: user,
      host: 'smtp.gmail.com',
      port: 465,
    };
  } catch (err) {
    let friendlyError = err.message || 'SMTP connection verification failed';
    if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
      friendlyError =
        'Connection timeout: Render Free Tier blocks outbound SMTP ports (465/587). Add BREVO_API_KEY to Render Environment Variables to send via HTTPS Port 443 for free.';
    }
    return {
      connected: false,
      error: friendlyError,
      code: err.code || 'SMTP_ERROR',
      provider: 'Google SMTP',
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

    await sendEmailUnified({
      to: toEmail,
      fromName: 'Aai Ji Honey Security',
      subject: '🔐 Login Alert - Owner Dashboard Access',
      text: `Hello,\n\nYour owner dashboard was just accessed on ${new Date().toLocaleString()}.\n\nLogin Location: ${locationInfo}\nIP Address: ${ip}\n\nIf this wasn't you, please secure your account immediately.\n\n- Aai Ji Honey Team`,
    });
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
    const safeCustomerName = customerName || 'Valued Customer';
    const safeSubject = subject || 'General Inquiry';
    const storeUrl = process.env.FRONTEND_URL || 'https://aai-ji-honey.vercel.app';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aai Ji Honey - Response to Your Inquiry</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fbf8f1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #292524; -webkit-font-smoothing: antialiased;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fbf8f1; padding: 25px 15px;">
          <tr>
            <td align="center">
              <!-- Main Card Container -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #fde68a; box-shadow: 0 4px 20px rgba(180, 83, 9, 0.08);">
                
                <!-- Brand Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 28px 24px; text-align: center;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      🍯 Aai Ji Honey
                    </h1>
                    <p style="margin: 6px 0 0; font-size: 13px; color: #fef3c7; font-weight: 500;">
                      100% Pure, Raw & Natural Apiary Harvest
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 32px 28px;">
                    <!-- Greeting -->
                    <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #78350f;">
                      Namaste ${safeCustomerName},
                    </h2>
                    
                    <p style="margin: 0 0 22px; font-size: 15px; line-height: 1.6; color: #44403c;">
                      Thank you for contacting us. Our apiary team has reviewed your inquiry.
                    </p>

                    <!-- Prominent Admin Response Card -->
                    <div style="background-color: #fffbeb; border: 1.5px solid #fcd34d; border-left: 5px solid #d97706; border-radius: 12px; padding: 20px 22px; margin-bottom: 24px;">
                      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #b45309; margin-bottom: 10px;">
                        💬 Official Response from Aai Ji Honey:
                      </div>
                      <div style="font-size: 16px; line-height: 1.65; color: #1c1917; font-weight: 500;">
                        ${replyMessage.replace(/\n/g, '<br/>')}
                      </div>
                    </div>

                    <!-- Full Original Inquiry Reference -->
                    <div style="background-color: #f7f6f4; border-radius: 12px; padding: 18px 20px; margin-bottom: 26px; border: 1px solid #e7e5e4;">
                      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #78716c; margin-bottom: 8px;">
                        📌 Your Full Inquiry (${safeSubject}):
                      </div>
                      <div style="font-size: 14px; line-height: 1.6; color: #44403c; font-weight: 500;">
                        ${originalMessage.replace(/\n/g, '<br/>')}
                      </div>
                    </div>

                    <!-- Call To Action Button -->
                    <div style="text-align: center; margin: 28px 0 18px;">
                      <a href="${storeUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff !important; text-decoration: none; padding: 13px 30px; font-size: 14px; font-weight: 700; border-radius: 9999px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);">
                        Visit Aai Ji Honey Store 🍯
                      </a>
                    </div>

                    <!-- Follow-up Support Note -->
                    <p style="margin: 20px 0 0; font-size: 13px; line-height: 1.5; color: #78716c; text-align: center;">
                      Have more questions? Reply directly to this email or reach us on WhatsApp: 
                      <a href="https://wa.me/919610047740" target="_blank" style="color: #92400e; font-weight: 800; text-decoration: underline;">+91 96100 47740</a>.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 22px 24px; text-align: center;">
                    <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #78350f;">
                      Dr. Sitaram Seervi & The Aai Ji Honey Apiary Team
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #a8a29e;">
                      Traditional Wild Harvest Apiaries • Mewar, Rajasthan, India
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textContent =
      `Namaste ${safeCustomerName},\n\n` +
      `Thank you for contacting us. Our apiary team has reviewed your inquiry.\n\n` +
      `==================================================\n` +
      `💬 OFFICIAL RESPONSE FROM AAI JI HONEY:\n` +
      `${replyMessage}\n` +
      `==================================================\n\n` +
      `📌 YOUR FULL INQUIRY (${safeSubject}):\n` +
      `${originalMessage}\n\n` +
      `Visit our store: ${storeUrl}\n\n` +
      `Have more questions? Reply directly to this email or reach us on WhatsApp: +91 96100 47740 (https://wa.me/919610047740).\n\n` +
      `Warm regards,\n` +
      `Dr. Sitaram Seervi & The Aai Ji Honey Apiary Team\n` +
      `Traditional Wild Harvest Apiaries • Rajasthan, India`;

    const result = await sendEmailUnified({
      to: toEmail,
      fromName: 'Aai Ji Honey Apiary Team',
      subject: `🍯 Response to your inquiry: ${safeSubject}`,
      text: textContent,
      html: htmlContent,
    });

    if (result.success) {
      console.log(`📧 Customer reply email sent successfully to ${toEmail} via ${result.provider}`);
      return { success: true, provider: result.provider };
    } else {
      return { success: false, error: result.error };
    }
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

    const textContent = `Hello ${applicantName},\n\nThank you for applying to Aai Ji Honey for the position of "${jobTitle}".\n\nYour Application Tracking ID is: ${trackingId}\n\nOur HR and Apiculture leadership team will review your application and contact you if shortlisted.\n\nWarm regards,\nDr. Neha Tomar & Dr. Sitaram Seervi\nAai Ji Honey Team`;

    const result = await sendEmailUnified({
      to: toEmail,
      fromName: 'Aai Ji Honey Careers',
      subject: `🐝 Application Received: ${jobTitle} (${trackingId}) — Aai Ji Honey`,
      text: textContent,
      html: htmlContent,
    });

    return result.success;
  } catch (err) {
    console.warn('⚠️ Could not send career acknowledgment email:', err.message);
    return false;
  }
};

// =========================================================================
// ADMIN DASHBOARD ACTIVITY NOTIFICATIONS (Sent to sitaramseervi88@gmail.com)
// =========================================================================

const ADMIN_NOTIFICATION_EMAIL = (process.env.ADMIN_EMAIL || 'sitaramseervi88@gmail.com').trim();
const STORE_FRONTEND_URL = (process.env.FRONTEND_URL || 'https://aai-ji-honey.vercel.app').replace(/\/+$/, '');

/**
 * Escape HTML special characters before embedding user-submitted values in email HTML.
 */
const escapeHtml = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Format timestamp in Indian Standard Time (IST) for consistent admin alerts.
 */
const formatIstTimestamp = (dateInput = new Date()) => {
  try {
    return (
      new Date(dateInput).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) + ' IST'
    );
  } catch (e) {
    return new Date().toISOString();
  }
};

/**
 * Format number as INR display string.
 */
const formatInr = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

/**
 * Build clickable Call + WhatsApp HTML links when a mobile number is provided.
 */
const buildPhoneLinksHtml = (rawMobile) => {
  if (!rawMobile) return null;
  const cleanText = escapeHtml(rawMobile);
  const digits = String(rawMobile).replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return cleanText;

  return `${cleanText} &nbsp;(<a href="tel:+91${digits}" style="color: #b45309; font-weight: 700; text-decoration: none;">Call</a> &bull; <a href="https://wa.me/91${digits}" target="_blank" style="color: #059669; font-weight: 700; text-decoration: none;">WhatsApp</a>)`;
};

/**
 * Shared HTML + plain-text email builder for all Admin Dashboard activity notifications.
 */
const sendAdminAlertEmail = async ({
  subject,
  badgeText,
  badgeBg = '#fef3c7',
  badgeColor = '#92400e',
  accentColor = '#d97706',
  headline,
  summaryText,
  timestamp,
  rows = [],
  highlightTitle,
  highlightBodyHtml,
  highlightImageUrl,
  ctaLabel = 'Open Admin Dashboard ➔',
  ctaPath = '/orderDashboard',
  plainDetails = '',
}) => {
  try {
    const safeSubject = String(subject || 'Admin Activity Alert').replace(/[\r\n]+/g, ' ').trim();
    const safeTime = formatIstTimestamp(timestamp);
    const dashboardUrl = `${STORE_FRONTEND_URL}${ctaPath}`;
    const validRows = rows.filter((r) => r && (r.rawHtml || (r.value !== undefined && r.value !== null && String(r.value).trim() !== '')));

    const rowsHtml = validRows
      .map(
        (r) => `
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #f5f5f4; font-size: 12px; font-weight: 700; color: #78716c; text-transform: uppercase; letter-spacing: 0.4px; width: 34%; vertical-align: top;">
              ${escapeHtml(r.label)}
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #f5f5f4; font-size: 14px; font-weight: 600; color: #1c1917; vertical-align: top; word-break: break-word;">
              ${r.rawHtml ? r.rawHtml : escapeHtml(r.value)}
            </td>
          </tr>
        `
      )
      .join('');

    const safeImageUrl =
      highlightImageUrl && /^https?:\/\//i.test(String(highlightImageUrl).trim())
        ? escapeHtml(String(highlightImageUrl).trim())
        : null;

    const highlightSectionHtml =
      highlightTitle || highlightBodyHtml || safeImageUrl
        ? `
          <div style="background-color: #fffbeb; border: 1.5px solid #fde68a; border-left: 5px solid ${accentColor}; border-radius: 12px; padding: 18px 20px; margin: 22px 0;">
            ${
              highlightTitle
                ? `<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: #92400e; margin-bottom: 10px;">${escapeHtml(highlightTitle)}</div>`
                : ''
            }
            ${
              highlightBodyHtml
                ? `<div style="font-size: 14px; line-height: 1.65; color: #292524;">${highlightBodyHtml}</div>`
                : ''
            }
            ${
              safeImageUrl
                ? `<div style="margin-top: 14px;"><img src="${safeImageUrl}" alt="Customer uploaded attachment" style="max-width: 240px; max-height: 200px; border-radius: 10px; border: 1px solid #fcd34d; display: block;" /></div>`
                : ''
            }
          </div>
        `
        : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(safeSubject)}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f5ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1c1917;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f5ee; padding: 24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #fde68a; box-shadow: 0 6px 24px rgba(120, 53, 15, 0.08);">
                
                <!-- Top Brand Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #78350f 0%, #b45309 55%, #d97706 100%); padding: 24px 26px; text-align: left;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <div style="font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #fde68a;">
                            🍯 AAI JI HONEY • ADMIN NOTIFICATION
                          </div>
                          <h1 style="margin: 6px 0 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                            ${escapeHtml(headline)}
                          </h1>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Activity Badge & Summary -->
                <tr>
                  <td style="padding: 26px 26px 10px;">
                    <div style="margin-bottom: 14px;">
                      <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${accentColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; padding: 5px 12px; border-radius: 9999px;">
                        ${escapeHtml(badgeText)}
                      </span>
                      <span style="display: inline-block; margin-left: 8px; font-size: 12px; color: #78716c; font-weight: 600;">
                        🕒 ${escapeHtml(safeTime)}
                      </span>
                    </div>

                    <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #44403c;">
                      ${escapeHtml(summaryText)}
                    </p>

                    <!-- Structured Details Table -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e7e5e4; border-radius: 12px; overflow: hidden; background-color: #fafaf9;">
                      ${rowsHtml}
                    </table>

                    ${highlightSectionHtml}

                    <!-- Dashboard Action Button -->
                    <div style="text-align: center; margin: 28px 0 18px;">
                      <a href="${dashboardUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff !important; text-decoration: none; padding: 13px 28px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; border-radius: 9999px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);">
                        ${escapeHtml(ctaLabel)}
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 18px 24px; text-align: center;">
                    <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #78350f;">
                      Aai Ji Honey Automated Store &amp; Admin Monitor
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #a8a29e;">
                      Sent to ${escapeHtml(ADMIN_NOTIFICATION_EMAIL)} • <a href="${STORE_FRONTEND_URL}/orderDashboard" target="_blank" style="color: #b45309; text-decoration: underline;">Go to Admin Portal</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const plainRowsText = validRows.map((r) => `- ${r.label}: ${r.plainValue || r.value}`).join('\n');
    const textContent =
      `AAI JI HONEY — ADMIN NOTIFICATION\n` +
      `${headline}\n` +
      `Time: ${safeTime}\n\n` +
      `${summaryText}\n\n` +
      `${plainRowsText}\n` +
      (plainDetails ? `\n${plainDetails}\n` : '') +
      `\nOpen Admin Dashboard: ${dashboardUrl}\n`;

    const result = await sendEmailUnified({
      to: ADMIN_NOTIFICATION_EMAIL,
      fromName: 'Aai Ji Honey Admin Alerts',
      subject: safeSubject,
      text: textContent,
      html: htmlContent,
    });

    if (result.success) {
      console.log(`📧 Admin notification delivered to ${ADMIN_NOTIFICATION_EMAIL}: ${safeSubject}`);
    } else {
      console.warn(`⚠️ Admin notification delivery warning (${safeSubject}): ${result.error}`);
    }
    return result;
  } catch (err) {
    console.warn('⚠️ Admin notification email failed:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Notify admin when a new customer order is placed (Razorpay or COD).
 */
const notifyAdminNewOrder = async ({ order, items = null, coupon = null, couponDiscount = 0 }) => {
  if (!order) return { success: false, error: 'Missing order payload' };

  const prod = order.product || {};
  const qty = parseInt(order.quantity, 10) || 1;
  const totalAmount =
    prod.totalprice !== undefined && prod.totalprice !== null
      ? Number(prod.totalprice)
      : (Number(prod.price) || 0) * qty;

  const isPaidOnline =
    order.paymentId &&
    !String(order.paymentId).toLowerCase().includes('cod') &&
    !String(order.paymentId).toLowerCase().includes('cash');

  const itemList = Array.isArray(items) && items.length > 0 ? items : null;
  const itemsHtml = itemList
    ? `<ul style="margin: 0; padding-left: 18px;">${itemList
        .map((it) => {
          const linePrice = it.totalprice !== undefined ? Number(it.totalprice) : (Number(it.price) || 0) * (parseInt(it.quantity, 10) || 1);
          return `<li style="margin-bottom: 6px;"><strong>${escapeHtml(it.name || 'Honey Product')}</strong>${
            it.flavour ? ` (${escapeHtml(it.flavour)})` : ''
          } &times; ${escapeHtml(it.quantity || 1)} &mdash; <strong>${formatInr(linePrice)}</strong></li>`;
        })
        .join('')}</ul>`
    : `<p style="margin: 0;"><strong>${escapeHtml(prod.name || 'Aai Ji Honey Order')}</strong>${
        prod.flavour ? ` (${escapeHtml(prod.flavour)})` : ''
      } &times; ${escapeHtml(qty)}</p>`;

  const appliedCoupon = coupon || prod.coupon;
  const discountVal = Number(couponDiscount || prod.couponDiscount || 0);
  const totalBannerHtml = `<div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #fcd34d; font-size: 16px; font-weight: 800; color: #065f46;">Total Amount: ${formatInr(totalAmount)}</div>`;

  const plainItems = itemList
    ? itemList
        .map((it) => `  * ${it.name || 'Honey'}${it.flavour ? ` (${it.flavour})` : ''} x${it.quantity || 1} - ${formatInr(it.totalprice ?? (Number(it.price) || 0) * (it.quantity || 1))}`)
        .join('\n')
    : `  * ${prod.name || 'Honey Product'}${prod.flavour ? ` (${prod.flavour})` : ''} x${qty}`;

  return sendAdminAlertEmail({
    subject: `🛒 [New Order] ${order.invoiceNumber || 'Order'} (${formatInr(totalAmount)}) — ${order.name}`,
    badgeText: isPaidOnline ? '💳 Paid Order Received' : '📦 New Order Received',
    badgeBg: '#ecfdf5',
    badgeColor: '#065f46',
    accentColor: '#059669',
    headline: `New Order ${order.invoiceNumber || ''} Received!`,
    summaryText: `A customer just placed an order worth ${formatInr(totalAmount)} on Aai Ji Honey.`,
    timestamp: order.createdAt || new Date(),
    rows: [
      { label: 'Invoice No.', value: order.invoiceNumber || order._id },
      { label: 'Order Status', value: order.status || 'Pending' },
      { label: 'Customer Name', value: order.name },
      {
        label: 'Mobile / Phone',
        value: order.mobile,
        plainValue: order.mobile,
        rawHtml: buildPhoneLinksHtml(order.mobile),
      },
      {
        label: 'Email',
        value: order.email,
        rawHtml: order.email
          ? `<a href="mailto:${escapeHtml(order.email)}" style="color: #b45309; text-decoration: none;">${escapeHtml(order.email)}</a>`
          : null,
      },
      { label: 'Delivery Address', value: order.address },
      { label: 'Payment ID', value: order.paymentId || 'Cash on Delivery / Standard' },
      appliedCoupon ? { label: 'Coupon Used', value: `${appliedCoupon} (Saved ${formatInr(discountVal)})` } : null,
    ],
    highlightTitle: '🍯 Ordered Items & Billed Amount',
    highlightBodyHtml: itemsHtml + totalBannerHtml,
    ctaLabel: 'Process Order in Dashboard ➔',
    ctaPath: '/orderDashboard?tab=orders',
    plainDetails: `Ordered Items:\n${plainItems}\nTotal Amount: ${formatInr(totalAmount)}`,
  });
};

/**
 * Notify admin when a customer submits a new inquiry or contact message.
 */
const notifyAdminNewMessage = async ({ inquiry }) => {
  if (!inquiry) return { success: false, error: 'Missing inquiry payload' };

  const subjectLine = inquiry.subject || 'General Inquiry';

  return sendAdminAlertEmail({
    subject: `💬 [New Inquiry] ${subjectLine} — from ${inquiry.name}`,
    badgeText: '💬 New Inquiry / Message',
    badgeBg: '#eff6ff',
    badgeColor: '#1e40af',
    accentColor: '#2563eb',
    headline: `New Inquiry from ${inquiry.name}`,
    summaryText: 'A visitor submitted a new message/inquiry on the website. You can reply directly from the Admin Dashboard.',
    timestamp: inquiry.created_at || new Date(),
    rows: [
      { label: 'Sender Name', value: inquiry.name },
      {
        label: 'Email',
        value: inquiry.email,
        rawHtml: inquiry.email
          ? `<a href="mailto:${escapeHtml(inquiry.email)}" style="color: #b45309; text-decoration: none;">${escapeHtml(inquiry.email)}</a>`
          : null,
      },
      {
        label: 'Mobile / WhatsApp',
        value: inquiry.mobile || 'Not provided',
        plainValue: inquiry.mobile || 'Not provided',
        rawHtml: inquiry.mobile ? buildPhoneLinksHtml(inquiry.mobile) : 'Not provided',
      },
      { label: 'Subject', value: subjectLine },
    ],
    highlightTitle: '📩 Customer Message',
    highlightBodyHtml: escapeHtml(inquiry.message).replace(/\n/g, '<br/>'),
    ctaLabel: 'Reply to Inquiry in Dashboard ➔',
    ctaPath: '/orderDashboard?tab=messages',
    plainDetails: `Message:\n${inquiry.message}`,
  });
};

/**
 * Notify admin when a candidate submits a job application in Careers & Hiring.
 */
const notifyAdminNewCareerApplication = async ({ application }) => {
  if (!application) return { success: false, error: 'Missing application payload' };

  const safeResumeLink =
    application.resume_url && /^https?:\/\//i.test(String(application.resume_url))
      ? `<a href="${escapeHtml(application.resume_url)}" target="_blank" style="color: #059669; font-weight: 700; text-decoration: underline;">View / Download (${escapeHtml(application.resume_filename || 'Resume')})</a>`
      : escapeHtml(application.resume_filename || 'Attached in Admin Dashboard');

  const safeLinkedinHtml =
    application.linkedin_url && /^https?:\/\//i.test(String(application.linkedin_url))
      ? `<a href="${escapeHtml(application.linkedin_url)}" target="_blank" style="color: #2563eb; text-decoration: underline;">${escapeHtml(application.linkedin_url)}</a>`
      : application.linkedin_url
      ? escapeHtml(application.linkedin_url)
      : null;

  return sendAdminAlertEmail({
    subject: `💼 [New Job Application] ${application.job_title} (${application.id}) — ${application.name}`,
    badgeText: '💼 Careers & Hiring Application',
    badgeBg: '#f5f3ff',
    badgeColor: '#5b21b6',
    accentColor: '#7c3aed',
    headline: `New Application for ${application.job_title}`,
    summaryText: `${application.name} applied for the position "${application.job_title}". Their resume is ready for review in the Careers & Hiring tab.`,
    timestamp: application.created_at || new Date(),
    rows: [
      { label: 'Tracking ID', value: application.id },
      { label: 'Position Applied', value: application.job_title },
      { label: 'Applicant Name', value: application.name },
      {
        label: 'Mobile / WhatsApp',
        value: application.mobile,
        plainValue: application.mobile,
        rawHtml: buildPhoneLinksHtml(application.mobile),
      },
      {
        label: 'Email',
        value: application.email,
        rawHtml: `<a href="mailto:${escapeHtml(application.email)}" style="color: #b45309; text-decoration: none;">${escapeHtml(application.email)}</a>`,
      },
      { label: 'City / Location', value: application.city || 'Not specified' },
      { label: 'Experience', value: application.experience || 'Not specified' },
      safeLinkedinHtml
        ? { label: 'LinkedIn / Portfolio', value: application.linkedin_url, rawHtml: safeLinkedinHtml }
        : null,
      { label: 'Resume / CV', value: application.resume_filename || 'Attached', rawHtml: safeResumeLink },
    ],
    highlightTitle: application.cover_note ? '📝 Applicant Cover Note' : null,
    highlightBodyHtml: application.cover_note ? escapeHtml(application.cover_note).replace(/\n/g, '<br/>') : null,
    ctaLabel: 'Review Candidate & Resume ➔',
    ctaPath: '/orderDashboard?tab=careers',
    plainDetails: application.cover_note ? `Cover Note:\n${application.cover_note}` : '',
  });
};

/**
 * Notify admin when a customer submits a Community Review or Product Star Rating.
 */
const notifyAdminNewReview = async ({
  review,
  isProductRating = false,
  productName = null,
  avgRating = null,
}) => {
  if (!review) return { success: false, error: 'Missing review payload' };

  const starsCount = Math.max(1, Math.min(5, parseInt(review.rating, 10) || 5));
  const starsVisual = `${'★'.repeat(starsCount)}${'☆'.repeat(5 - starsCount)} (${starsCount}/5)`;

  const badgeLabel =
    review.is_verified_buyer || review.badge_type === 'verified_buyer'
      ? '🍯 Verified Buyer ✓'
      : review.badge_type === 'community_member'
      ? '🌿 Community Member'
      : isProductRating
      ? '🍯 Verified Product Buyer ✓'
      : '📍 Guest Reviewer';

  const reviewerName = review.user_name || review.userName || 'Customer';
  const reviewComment = review.comment || review.review || '';
  const reviewTitle = review.title || '';

  const highlightHtmlParts = [];
  if (reviewTitle) {
    highlightHtmlParts.push(`<div style="font-size: 15px; font-weight: 800; color: #78350f; margin-bottom: 6px;">"${escapeHtml(reviewTitle)}"</div>`);
  }
  if (reviewComment) {
    highlightHtmlParts.push(`<div>${escapeHtml(reviewComment).replace(/\n/g, '<br/>')}</div>`);
  } else {
    highlightHtmlParts.push('<div style="color: #78716c; font-style: italic;">(Star rating submitted without written comment)</div>');
  }

  return sendAdminAlertEmail({
    subject: isProductRating
      ? `⭐ [Product Rating] ${starsVisual} on ${productName} — ${reviewerName}`
      : `⭐ [New Customer Review] ${starsVisual} — from ${reviewerName}`,
    badgeText: isProductRating ? '⭐ New Product Rating' : '⭐ New Community Review',
    badgeBg: '#fffbeb',
    badgeColor: '#92400e',
    accentColor: '#f59e0b',
    headline: isProductRating
      ? `New Rating on ${productName || 'Product'}`
      : `New ${starsCount}-Star Customer Review Published`,
    summaryText: isProductRating
      ? `${reviewerName} rated "${productName}" ${starsCount}/5 stars.${avgRating ? ` New product average: ${avgRating}★.` : ''}`
      : `${reviewerName} submitted a new review in the Community Reviews section.`,
    timestamp: review.created_at || new Date(),
    rows: [
      { label: 'Reviewer Name', value: reviewerName },
      { label: 'Badge / Status', value: badgeLabel },
      { label: 'Star Rating', value: starsVisual },
      isProductRating
        ? { label: 'Product', value: `${productName}${avgRating ? ` (Avg: ${avgRating}★)` : ''}` }
        : { label: 'Feedback Category', value: review.category || 'quality' },
      review.location ? { label: 'Location', value: review.location } : null,
      review.user_email
        ? {
            label: 'Email',
            value: review.user_email,
            rawHtml: `<a href="mailto:${escapeHtml(review.user_email)}" style="color: #b45309; text-decoration: none;">${escapeHtml(review.user_email)}</a>`,
          }
        : null,
    ],
    highlightTitle: '💬 Customer Review Content',
    highlightBodyHtml: highlightHtmlParts.join(''),
    highlightImageUrl: review.image_url || null,
    ctaLabel: isProductRating ? 'View Store Products ➔' : 'Moderate Reviews in Dashboard ➔',
    ctaPath: isProductRating ? '/products' : '/orderDashboard?tab=reviews',
    plainDetails: `${reviewTitle ? `Title: ${reviewTitle}\n` : ''}Comment: ${reviewComment || '(No written comment)'}${
      review.image_url ? `\nPhoto URL: ${review.image_url}` : ''
    }`,
  });
};

module.exports = {
  getTransporter,
  sendEmailUnified,
  verifySmtpConnection,
  sendLoginEmail,
  sendMessageReplyEmail,
  sendCareerApplicationEmail,
  notifyAdminNewOrder,
  notifyAdminNewMessage,
  notifyAdminNewCareerApplication,
  notifyAdminNewReview,
};
