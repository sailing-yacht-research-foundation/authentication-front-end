const { default: axios } = require('axios');
const { handleErrorResponse } = require('../utils/helpers');

module.exports = {
    /**
     * Exchange Instagram short lived token for long lived token
     */
    async exchangeTokenForLongLivedToken(req, res, next) {
        var instagramResponse;
        const exchangeParams = {
            grant_type: 'ig_exchange_token',
            client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
            access_token: req.body.token,
        };

        try {
            instagramResponse = await axios.get('https://graph.instagram.com/access_token', {
                params: exchangeParams
            });
        } catch (err) {
            return handleErrorResponse(err, res);
        }

        return res.json(instagramResponse.data);
    },

    /**
     * Refresh Instagram long lived token
     * @param token old long lived token
     */
     async refreshLongLivedToken(req, res, next) {
        var instagramResponse;
        const params = {
            grant_type: 'ig_refresh_token',
            access_token: req.body.token,
        };

        try {
            instagramResponse = await axios.get('https://graph.instagram.com/refresh_access_token', {
                params: params
            });
        } catch (err) {
            return handleErrorResponse(err, res);
        }

        return res.json(instagramResponse.data);
    },

    /**
     * Get Instagram short lived token
     * @param code Instagram code
     */
     async getShortLivedTokenFromCode(req, res, next) {
        var instagramResponse;

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', process.env.INSTAGRAM_CLIENT_ID);
        params.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
        params.append('code', req.body.code);
        params.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URL);

        try {
            instagramResponse = await axios.post('https://api.instagram.com/oauth/access_token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        } catch (err) {
            return handleErrorResponse(err, res);
        }

        return res.json(instagramResponse.data);
    }
}
