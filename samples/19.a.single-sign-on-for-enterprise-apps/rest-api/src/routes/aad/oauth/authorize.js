const { randomBytes } = require('crypto');
const createPKCECodeChallenge = require('./createPKCECodeChallenge');

const {
  AAD_OAUTH_AUTHORIZE_URL,
  AAD_OAUTH_CLIENT_ID,
  AAD_OAUTH_REDIRECT_URI,
  AAD_OAUTH_SCOPE
} = process.env;

// GET /api/aad/oauth/authorize
// Redirects to https://login.microsoftonline.com/12345678-1234-5678-abcd-12345678abcd/oauth2/v2.0/authorize
module.exports = (_, res) => {
  const seed = randomBytes(32);
  const challenge = createPKCECodeChallenge(seed);
  const params = new URLSearchParams({
    client_id: AAD_OAUTH_CLIENT_ID,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    redirect_uri: AAD_OAUTH_REDIRECT_URI,
    response_type: 'code',
    scope: AAD_OAUTH_SCOPE,

    // https://tools.ietf.org/html/draft-ietf-oauth-browser-based-apps-00#section-9.4
    // "using the "state" parameter to link client requests and responses to prevent CSRF
    state: seed.toString('base64')
  });

  res.setHeader('location', `${ AAD_OAUTH_AUTHORIZE_URL }?${ params }`);
  res.send(302);
};
