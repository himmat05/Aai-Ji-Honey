const nodemailer = require('nodemailer');
const axios = require('axios');

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });
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
    return true;
  } catch (err) {
    console.error('❌ Failed to send reply email:', err.message);
    return false;
  }
};

module.exports = {
  sendLoginEmail,
  sendMessageReplyEmail,
};
