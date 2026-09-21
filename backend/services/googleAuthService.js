const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const getGoogleClient = () => {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  return new OAuth2Client(clientId, clientSecret);
};

/**
 * Verify Google ID token (from Google Sign In credential)
 * @param {string} token - Google ID Token
 * @returns {Promise<{ email: string, name: string, googleId: string, picture: string }>}
 */
const verifyGoogleToken = async (token) => {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  console.log('🔍 Verifying Google ID token. Configured Client ID:', clientId ? `${clientId.slice(0, 15)}...` : 'NONE');

  // Try official Google OAuth2Client verification first
  if (clientId) {
    try {
      const client = getGoogleClient();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      console.log('✅ Google SDK verification succeeded for:', payload.email);
      return {
        email: payload.email,
        name: payload.name || payload.given_name || 'Customer',
        googleId: payload.sub,
        picture: payload.picture,
      };
    } catch (sdkError) {
      console.warn('⚠️ Google SDK verify warning:', sdkError.message, '- falling back to Google tokeninfo endpoint');
    }
  }

  // Fallback / direct verification via Google API endpoint
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
      { timeout: 10000 }
    );
    const data = response.data;

    if (!data || !data.email) {
      throw new Error('Invalid Google token data: email missing');
    }

    // Verify audience matches if clientId is set
    if (clientId && data.aud !== clientId && data.azp !== clientId) {
      console.error(`❌ Client ID mismatch. Token aud: ${data.aud}, Configured: ${clientId}`);
      throw new Error(`Google token client ID mismatch (aud: ${data.aud})`);
    }

    console.log('✅ Google tokeninfo verification succeeded for:', data.email);
    return {
      email: data.email,
      name: data.name || data.given_name || 'Customer',
      googleId: data.sub,
      picture: data.picture,
    };
  } catch (error) {
    console.error('❌ Google token verification failed:', error.message);
    throw new Error('Failed to verify Google token: ' + error.message);
  }
};

/**
 * Exchange Google authorization code for tokens (if code flow is used)
 * @param {string} code 
 * @param {string} redirectUri 
 */
const exchangeGoogleCode = async (code, redirectUri) => {
  const client = getGoogleClient();
  const { tokens } = await client.getToken({
    code,
    redirect_uri: redirectUri || 'postmessage',
  });
  client.setCredentials(tokens);

  if (tokens.id_token) {
    return verifyGoogleToken(tokens.id_token);
  }

  const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  return {
    email: response.data.email,
    name: response.data.name,
    googleId: response.data.sub,
    picture: response.data.picture,
  };
};

module.exports = {
  verifyGoogleToken,
  exchangeGoogleCode,
};
