const axios = require('axios');


class AuthController {

  async getAuthorizeUrl(req, res) {
    const authCodeUrlParameters = {
        scopes: ['openid', 'profile', 'offline_access', 'user.readwrite', 'files.read', 'files.readwrite.all'],
        redirectUri: process.env.REDIRECT_URI,
    };

    const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${authCodeUrlParameters.redirectUri}&response_mode=query&scope=${authCodeUrlParameters.scopes.join('%20')}`;

    
    res.redirect(authUrl);
  }


  async getToken(req, res) {
    try {
        const tokenUrl = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';

        const { code } = req.query;

        const tokenRequestData = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET, // Only needed for confidential clients
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
        };

        const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(tokenRequestData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        console.log('Token response:', tokenResponse.data);

        const tokenRs = tokenResponse.data;

        if (tokenRs && tokenRs.access_token) {
            req.session.accessToken = tokenRs.access_token;
            res.redirect('/profile');
        } else {
            throw new Error('Failed to retrieve access token');
        }

    } catch (error) {
        console.log('Token error:', error.message);
    }
  }
}

module.exports = AuthController;
