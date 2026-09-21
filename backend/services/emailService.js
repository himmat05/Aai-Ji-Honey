const nodemailer = require('nodemailer');
const axios = require('axios');

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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: '🔐 Login Alert - Owner Dashboard Access',
      text: `Hello,

Your owner dashboard was just accessed on ${new Date().toLocaleString()}.

Login Location: ${locationInfo}
IP Address: ${ip}

If this wasn't you, please secure your account immediately.

- Aai Ji Honey Team`
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Login alert email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error('❌ Failed to send login email:', error.message);
  }
};

module.exports = {
  sendLoginEmail
};
